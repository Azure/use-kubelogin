import { Octokit } from '@octokit/action';

const KUBELOGIN_REPO_OWNER = 'Azure';
const KUBELOGIN_REPO = 'kubelogin';

export function isLatestVersion(version: string): boolean {
  const v = version.toLowerCase();
  return v === 'latest' || v === '*' || v === '';
}

export async function resolveLatestVersion(): Promise<string> {
  if (!process.env.GITHUB_TOKEN) {
    throw new Error(
      'GITHUB_TOKEN is not set, unable to resolve the latest version of kubelogin'
    );
  }

  const octokit = new Octokit();
  const { data } = await octokit.repos.getLatestRelease({
    owner: KUBELOGIN_REPO_OWNER,
    repo: KUBELOGIN_REPO,
  });
  return data.tag_name;
}

export function releaseArtifactURL(paths: string[]): string {
  return `https://github.com/${KUBELOGIN_REPO_OWNER}/${KUBELOGIN_REPO}/releases/download/${paths.join(
    '/'
  )}`;
}
