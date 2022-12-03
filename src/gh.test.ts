import { isLatestVersion } from './gh';

test('isLatestVersion', () => {
  ['latest', 'LATEST', '', '*'].forEach((v) => {
    expect(isLatestVersion(v)).toBe(true);
  });

  ['v0.0.24'].forEach((v) => {
    expect(isLatestVersion(v)).toBe(false);
  });
});
