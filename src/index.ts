import { debug, getBooleanInput, getInput, setFailed } from "@actions/core";
import { context } from "@actions/github";
import { getLatestRelease, getReleaseNotes, setUnreleasedChangesVersion } from "@jelmore1674/changelog";
import { commit, getValidStringInput } from "@jelmore1674/github-action-helpers";
import { readFileSync } from "node:fs";
import { exit } from "node:process";
import { clean, inc, neq } from "semver";
import { createRelease } from "./createRelease";
import { getLatestVersion } from "./getLatestVersion";
import { moveMajorVersionTag } from "./moveMajorVersionTag";
import { getVersionFromPackageJson, type ReleaseType, setPackageJsonVersion } from "./npmVersion";

async function run() {
  const updatePackageJson = getBooleanInput("update_package_json", { required: false });
  const moveMajorVersion = getBooleanInput("move_major_version_tag", { required: false });
  const setChangelogVersion = getBooleanInput("set_changelog_version", { required: false });
  const releaseNotesFromChangelog = getBooleanInput("release_notes_from_changelog", { required: false });
  const showGitTagPrefix = getBooleanInput("show_git_tag_prefix", { required: false });
  const autoVersioning = getBooleanInput("auto_version", { required: false });

  const token = getInput("token", { required: true });
  const tagName = getInput("tag_name", { required: false });
  const gitTagPrefix = getInput("git_tag_prefix", { required: true });
  const commitMessage = getInput("commit_message", { required: false });
  const changelogFile = getInput("changelog_file", { required: false });

  const releaseType = getValidStringInput<ReleaseType>("release_type", {
    required: false,
    validInputs: ["major", "minor", "patch"],
  });

  debug(`updatePackageJsonInput: ${updatePackageJson}`);
  debug(`releaseTypeInput: ${releaseType}`);
  debug(`tagNameInput: ${tagName}`);

  let version = clean(tagName);

  if (autoVersioning) {
    const changelog = readFileSync("CHANGELOG.md", "utf8");
    version = getLatestRelease(changelog) ?? version;
  }

  if (!(tagName || autoVersioning)) {
    const latestVersion = await getLatestVersion();

    version = inc(latestVersion, releaseType);
  }

  if (!version) {
    setFailed("Unable to validate version.");
    exit(1);
  }

  debug(`version: ${version}`);

  if (setChangelogVersion) {
    const url =
      `${context.serverUrl}/${context.repo.owner}/${context.repo.repo}/releases/tag/${gitTagPrefix}${version}`;
    setUnreleasedChangesVersion(
      changelogFile,
      version,
      url,
      { showGitTagPrefix, gitTagPrefix, autoVersioning },
    );
  }

  if (updatePackageJson) {
    if (neq(version, getVersionFromPackageJson())) {
      setPackageJsonVersion(releaseType, version);
    }
  }

  const { error } = await commit(token, commitMessage.replace("$version", version));

  if (error) {
    setFailed("Unable to update.");
    exit(1);
  }

  if (moveMajorVersion) {
    await moveMajorVersionTag(version, gitTagPrefix);
  }

  let releaseNotes: string | undefined;

  if (releaseNotesFromChangelog) {
    const changelog = readFileSync(changelogFile, "utf8");
    releaseNotes = getReleaseNotes(changelog, version);
  }

  await createRelease(version, releaseNotes);
}

run();
