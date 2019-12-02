/*
 * we use semantic-release to automate the whole
 * package release workflow and the options,
 * mode and plugins can be set here
 * more info: https://github.com/semantic-release/semantic-release
 */
module.exports = {
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    '@semantic-release/npm',
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md', 'package.json', 'yarn.lock'],
      },
    ],
    '@semantic-release/github',
  ]
};