# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Common Changelog](https://common-changelog.org),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] - TBD

### Fixed

- Prevent generated release notes from appearing when getting the release notes from the changelog. [`5812a15`](https://github.com/jelmore1674/release-semver-action/commit/5812a151ddb3f7811bcbe7912821fb7f453cb371) | [#20](https://github.com/jelmore1674/release-semver-action/pull/20) | [Justin Elmore](https://github.com/jelmore1674)

## [1.2.1] - 2025-04-28

### Fixed

- Generated reference link to the updated version. [`08d737a`](https://github.com/jelmore1674/release-semver-action/commit/08d737a866076cd5458711bdbf8483ec5f36fe50) | [#19](https://github.com/jelmore1674/release-semver-action/pull/19) | [Justin Elmore](https://github.com/jelmore1674)

## [1.2.0] - 2025-04-28

### Added

- Support to bump unreleased changes in changelog. [`fa97e97`](https://github.com/jelmore1674/release-semver-action/commit/fa97e97bd52fcfb8b0f1a375aff5f85ceb52819f) | [#17](https://github.com/jelmore1674/release-semver-action/issues/17), [#18](https://github.com/jelmore1674/release-semver-action/pull/18) | [Justin Elmore](https://github.com/jelmore1674)
- Unit testing on api calls in the project. [`fa97e97`](https://github.com/jelmore1674/release-semver-action/commit/fa97e97bd52fcfb8b0f1a375aff5f85ceb52819f) | [#17](https://github.com/jelmore1674/release-semver-action/issues/17), [#18](https://github.com/jelmore1674/release-semver-action/pull/18) | [Justin Elmore](https://github.com/jelmore1674)

### Security

- Updates `typescript` from 5.8.2 to 5.8.3 ([`12d6a70`](https://github.com/jelmore1674/release-semver-action/commit/12d6a7004b93089ed5acd89297ecf7f3c68396aa)) ([#15](https://github.com/jelmore1674/release-semver-action/pull/15)) ([dependabot](https://github.com/apps/dependabot))

## [1.1.0] - 2025-04-11

### Added

- Flag when setting npm version so the `.npmrc` is no longer required. ([#13](https://github.com/jelmore1674/release-semver-action/pull/13)) ([Justin Elmore](https://github.com/jelmore1674))
- Optional `commit_message` input to customize commit message. ([#12](https://github.com/jelmore1674/release-semver-action/pull/12)) ([Justin Elmore](https://github.com/jelmore1674))

### Removed

- No longer commits `package.json` as a single commit. ([#12](https://github.com/jelmore1674/release-semver-action/pull/12)) ([Justin Elmore](https://github.com/jelmore1674))

## [1.0.1] - 2025-04-06

### Changed

- Removed [skip ci] flag from `package.json` commit message. ([#10](https://github.com/jelmore1674/release-semver-action/pull/10)) ([Justin Elmore](https://github.com/jelmore1674))

### Added

- Support for committing delete files. ([#10](https://github.com/jelmore1674/release-semver-action/pull/10)) ([Justin Elmore](https://github.com/jelmore1674))

## [1.0.0] - 2025-04-05

_Initial Release_

[1.2.1]: https://github.com/jelmore1674/release-semver-action/releases/tag/v1.2.1
[1.2.0]: https://github.com/jelmore1674/release-semver-action/releases/tag/v1.2.0
[1.1.0]: https://github.com/jelmore1674/release-semver-action/releases/tag/v1.1.0
[1.0.1]: https://github.com/jelmore1674/release-semver-action/releases/tag/v1.0.1
[1.0.0]: https://github.com/jelmore1674/release-semver-action/releases/tag/v1.0.0
