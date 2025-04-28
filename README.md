# Release Action

This actions creates a release, and helps manages the semantic version.

## Usage

Here is an example.

```yaml
name: Release

on:
  workflow_dispatch:
    inputs:
      release_type:
        description: The semver release type
        type: choice
        default: patch
        required: true
        options:
          - patch
          - minor
          - major

      tag:
        description: Release Tag
        type: string
        required: false

permissions:
  # Give the default GITHUB_TOKEN write permission to commit and push the
  # added or changed files to the repository.
  contents: write
  pull-requests: read

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Create Release
        id: create_release
        uses: ./
        with:
          release_type: ${{ inputs.release_type }}
          tag_name: ${{ steps.changelog.outputs.release_version || inputs.tag }}
          release_name: ${{ inputs.tag }}
          set_changelog_version: true
```

The action will check your latest release, will increment the version from the semver release types.

### Inputs

```yaml
inputs:
  release_type:
    description: The semantic version change type. Accepted values are major, minor, patch
    required: false
    default: patch

  tag_name:
    description: Override the version by passing in the desired version.
    required: false

  move_major_version_tag:
    description: Automate moving the major version tag.
    required: false
    default: "false"

  commit_message:
    description: |
      The commit message. You can customize your message and use `$version` as a variable
      of the version changes
    required: false
    default: "Bump version to $version"

  git_tag_prefix:
    description: The prefix for your git tags.
    default: "v"
    required: true

  show_git_tag_prefix:
    description: Whether or not the versions show the git tag prefix in the changelog.
    default: "false"
    required: false

  update_package_json:
    description: Bump the version in `package.json`.
    required: false
    default: "false"

  changelog_file:
    description: Path to the changelog file.
    default: "CHANGELOG.md"
    required: false

  set_changelog_version:
    description: Bump unreleased changes in the changelog.
    default: "false"
    required: false

  release_notes_from_changelog:
    description: Use the latest version in the changelog to use as the release notes.
    default: "false"
    required: false

  release_name:
    description: The name of the release. Defaults to the tag.
    required: false

  body:
    description: The contents of your release. Optional, if  not set, it will generate the release notes.
    required: false

  token:
    description: The secret value from your GITHUB_TOKEN or another token to access the GitHub API. Defaults to the token at `github.token`
    required: true
    default: ${{ github.token }}
```
