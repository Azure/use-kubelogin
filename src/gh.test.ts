import { isLatestVersion, createOctoKitClient } from './gh';

beforeAll(() => {
  process.env['GITHUB_ACTION'] = 'github-action-test-env';
});

test('isLatestVersion', () => {
  ['latest', 'LATEST', '', '*'].forEach((v) => {
    expect(isLatestVersion(v)).toBe(true);
  });

  ['v0.0.24'].forEach((v) => {
    expect(isLatestVersion(v)).toBe(false);
  });
});

// issue #3
test('createOctoKitClient - non-empty GITHUB_API_URL', () => {
  // even if GITHUB_API_URL is set, it should be ignored
  process.env['GITHUB_API_URL'] = 'https://foobar.com';
  const client = createOctoKitClient();
  expect(client.request.endpoint.DEFAULTS.baseUrl).toBe(
    'https://api.github.com'
  );
});

test('createOctoKitClient - with baseUrl override', () => {
  const client = createOctoKitClient({
    baseUrl: 'https://foobar.com',
  });
  expect(client.request.endpoint.DEFAULTS.baseUrl).toBe('https://foobar.com');
});
