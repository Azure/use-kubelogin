import * as core from '@actions/core';
import { getReleaseArtifact, setupArtifact } from './release';

const inputNameKubeloginVersion = 'kubelogin-version';

async function main() {
  const kubeloginVersion = core.getInput(inputNameKubeloginVersion);
  core.debug(`kubelogin-version: ${kubeloginVersion}`);

  const artifact = await getReleaseArtifact(kubeloginVersion);
  core.debug(`Resolved artifact: ${JSON.stringify(artifact)}`);

  await setupArtifact(artifact);
}

try {
  main();
} catch (e: any) {
  core.setFailed(e.message);
}