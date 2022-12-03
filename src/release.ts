import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import * as fs from 'fs';
import path from 'path';
import {
  isLatestVersion,
  releaseArtifactURL,
  resolveLatestVersion,
} from './gh';
import { sha256File } from './hash';

const TOOL_NAME = 'kubelogin';

export type Platform =
  | 'darwin-amd64'
  | 'darwin-arm64'
  | 'linux-amd64'
  | 'linux-arm64'
  | 'win-amd64';

function resolvePlatform(): Platform {
  const platform = process.platform;
  const arch = process.arch;
  if (platform === 'darwin' && arch === 'x64') {
    return 'darwin-amd64';
  } else if (platform === 'darwin' && arch === 'arm64') {
    return 'darwin-arm64';
  } else if (platform === 'linux' && arch === 'x64') {
    return 'linux-amd64';
  } else if (platform === 'linux' && arch === 'arm64') {
    return 'linux-arm64';
  } else if (platform === 'win32' && arch === 'x64') {
    return 'win-amd64';
  } else {
    throw new Error(`Unsupported platform: ${platform}-${arch}`);
  }
}

export interface KubeloginArtifact {
  // version is the SemVer of the release.
  readonly version: string;
  // platform is the platform of the artifact.
  readonly platform: Platform;
  // artifactName is the name of the artifact.
  readonly artifactName: string;
  // artifactUrl is the URL of the artifact.
  readonly artifactUrl: string;
  // checksumUrl is the SHA256 checksum URL of the artifact.
  readonly checksumUrl: string;
}

// getReleaseArtifact retrieves a release artifact with specified version and platform.
// platform is resolved automatically if not specified.
export async function getReleaseArtifact(
  version: string,
  platform?: Platform
): Promise<KubeloginArtifact> {
  if (isLatestVersion(version)) {
    version = await resolveLatestVersion();
  }

  platform = platform || resolvePlatform();

  const artifactName = `kubelogin-${platform}.zip`;

  return {
    version,
    platform,
    artifactName,
    // NOTE: we construct the URL by convention. If the release artifacts change in kubelogin side,
    //       we need to update this function.
    artifactUrl: releaseArtifactURL([version, artifactName]),
    checksumUrl: releaseArtifactURL([version, `${artifactName}.sha256`]),
  };
}

function resolveBinaryPath(artifact: KubeloginArtifact, dir: string): string {
  if (artifact.platform.startsWith('win')) {
    // windows has a different story :)
    // ex: bin/windows_amd64/kubelogin.exe
    const normalizedPlatform = artifact.platform.replace('win-', 'windows_');
    return path.join(dir, 'bin', normalizedPlatform, 'kubelogin.exe');
  } else {
    // ex: bin/linux_amd64/kubelogin
    const normalizedPlatform = artifact.platform.replace('-', '_');
    return path.join(dir, 'bin', normalizedPlatform, 'kubelogin');
  }
}

async function verifyZipballChecksum(
  zipballPath: string,
  artifactName: string,
  checksumPath: string
) {
  const zipballChecksum = await sha256File(zipballPath);
  core.debug(
    `calculated sha256 checksum of ${artifactName}: ${zipballChecksum}`
  );

  // format:
  //  {checksum}  {filename}
  const checksumLines = fs
    .readFileSync(checksumPath, 'utf8')
    .toString()
    .split('\n')
    .map((l) => l.split(/\s+/));
  const expectedChecksum = checksumLines.find(
    (l) => l[1].trim() === artifactName
  );
  if (!expectedChecksum) {
    throw new Error(
      `No checksum found for ${artifactName} from ${checksumPath}`
    );
  }

  if (expectedChecksum[0] !== zipballChecksum) {
    throw new Error(
      `Checksum mismatch: expected ${expectedChecksum[0]}, got ${zipballChecksum}`
    );
  }
}

// downloadAndCache downloads the artifact and caches it.
// Returns the path to the cached artifact.
async function downloadAndCache(artifact: KubeloginArtifact): Promise<string> {
  const artifactZipball = await tc.downloadTool(artifact.artifactUrl);
  core.debug(`Downloaded ${artifact.artifactUrl} to ${artifactZipball}`);

  const artifactChecksum = await tc.downloadTool(artifact.checksumUrl);
  core.debug(`Downloaded ${artifact.checksumUrl} to ${artifactChecksum}`);

  await verifyZipballChecksum(
    artifactZipball,
    artifact.artifactName,
    artifactChecksum
  );
  core.debug(`Verified checksum of ${artifactZipball}`);

  const artifactFolder = await tc.extractZip(artifactZipball);
  core.debug(`Extracted ${artifactZipball} to ${artifactFolder}`);

  const cachedDir = await tc.cacheDir(
    artifactFolder,
    TOOL_NAME,
    artifact.version
  );
  const rv = resolveBinaryPath(artifact, cachedDir);
  core.debug(`Cached kubelogin to ${rv}`);

  return rv;
}

// setupArtifact prepares the kubelogin binary and add it to PATH.
export async function setupArtifact(artifact: KubeloginArtifact) {
  const cachedDir = tc.find(TOOL_NAME, artifact.version);

  let binaryPath: string;

  if (cachedDir) {
    binaryPath = resolveBinaryPath(artifact, cachedDir);
    core.debug(`Found cached kubelogin at ${binaryPath}`);
  } else {
    binaryPath = await downloadAndCache(artifact);
    core.debug(`Downloaded and cached kubelogin to ${binaryPath}`);
  }

  core.addPath(path.dirname(binaryPath));
  core.info(`Added ${binaryPath} to PATH`);
}
