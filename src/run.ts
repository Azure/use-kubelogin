import * as core from '@actions/core';
import { getReleaseArtifact, setupArtifact } from './release';

const inputNameKubeloginVersion = 'kubelogin-version';
const inputNameSkipCache = 'skip-cache';

async function main() {
  const kubeloginVersion = core.getInput(inputNameKubeloginVersion);
  const skipCache = core.getInput(inputNameSkipCache) === 'true';
  core.debug(`kubelogin-version: ${kubeloginVersion} skip-cache: ${skipCache}`);

  const artifact = await getReleaseArtifact(kubeloginVersion);
  core.debug(`Resolved artifact: ${JSON.stringify(artifact)}`);

  await setupArtifact(artifact, skipCache);
}

try {
  main();
} catch (e) {
  core.setFailed((e as { message: string }).message);
}
