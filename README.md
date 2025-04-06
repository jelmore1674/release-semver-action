# Release Action

This actions creates a release, and helps manages the semantic version.

## Usage

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
    default: 'false'

  git_tag_prefix:
    description: The prefix for your git tags.
    default: 'v'
    required: true

  update_package_json:
    description: Bump the version in `package.json`.
    required: false
    default: 'false'

  release_name:
    description: The name of the release. Defaults to the tag.
    required: false

  body:
    description: The contents of your release. Optional, if  not set, it will generate the release notes.
    required: false

  skip_ci:
    description: Add [skip ci] to the end of a commit to prevent actions from triggering.
    default: 'true'
    required: false

  token:
    description: The secret value from your GITHUB_TOKEN or another token to access the GitHub API. Defaults to the token at `github.token`
    required: true
    default: ${{ github.token }}
```

> [!NOTE]
> To update the `package.json` you must set `commit-hooks` and `git-tag-version`
> in a `.npmrc` file in the repository.
>
> ```.npmrc
> `commit-hooks=false`
> `git-tag-version=false`
> ```
