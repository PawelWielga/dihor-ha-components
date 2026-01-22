# Contributing

Thanks for contributing! To ensure smooth automated releases, please follow these guidelines:

- Follow Conventional Commits for commit messages. Examples:
  - `feat(clock): add timezone option`
  - `fix(minecraft): handle missing sensor`
  - `chore: update deps`
- Open PRs against `main`. The CI will run type checks, build and commitlint.
- PRs must pass the Commit Lint check (GitHub Action) — it validates commit messages in the PR.

Why? Semantic Release uses the commit messages to determine next version and generate changelog automatically.
