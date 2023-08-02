import * as core from '@actions/core';
import {
  GetReleaseArtifactOpts,
  getReleaseArtifact,
  setupArtifact,
} from './release';

const inputNameKubeloginVersion = 'kubelogin-version';
const inputNameSkipCache = 'skip-cache';
const inputNameGitHubAPIBaseUrl = 'github-api-base-url';

async function main() {
  const kubeloginVersion = core.getInput(inputNameKubeloginVersion);
  const skipCache = core.getInput(inputNameSkipCache) === 'true';
  core.debug(`kubelogin-version: ${kubeloginVersion} skip-cache: ${skipCache}`);

  const githubAPIBaseUrl = core.getInput(inputNameGitHubAPIBaseUrl);
  const opts: GetReleaseArtifactOpts = {};
  if (githubAPIBaseUrl) {
    opts.octokitClientOptions = { baseUrl: githubAPIBaseUrl };
    core.info(`github-api-base-url: ${githubAPIBaseUrl}`);
  }

  const artifact = await getReleaseArtifact(kubeloginVersion, opts);
  core.debug(`Resolved artifact: ${JSON.stringify(artifact)}`);

  await setupArtifact(artifact, skipCache);
}

try {
  main();
} catch (e) {
  core.setFailed((e as { message: string }).message);
}
