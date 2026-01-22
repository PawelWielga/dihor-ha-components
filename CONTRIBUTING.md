# Contributing

Thanks for contributing! To ensure smooth automated releases, please follow these guidelines:

- Follow Conventional Commits for commit messages. Examples:
  - `feat(clock): add timezone option`
  - `fix(minecraft): handle missing sensor`
  - `chore: update deps`
- Open PRs against `main`. The CI will run type checks and build.

Why? Semantic Release uses Conventional Commits in merged PRs to determine the next version and generate the changelog automatically. Ensure PRs use Conventional Commit messages (e.g., `feat(...)`, `fix(...)`) so releases are created correctly.

Note: Automatic GitHub Releases and changelog updates are enabled via `semantic-release`. Publishing to npm is optional — if you want the project to be published to npm automatically, add an `NPM_TOKEN` secret (an **Automation** token with publish rights). By default, the release process updates `package.json` and `hacs.json` and creates GitHub releases without requiring an npm token.
