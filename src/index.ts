import { debug, getInput, setFailed } from "@actions/core";
import { exit } from "node:process";
import { clean, inc, neq } from "semver";
import { commitWithApi } from "./commitAndPush";
import { createRelease } from "./createRelease";
import { getLatestVersion } from "./getLatestVersion";
import { moveMajorVersionTag } from "./moveMajorVersionTag";
import { getVersionFromPackageJson, type ReleaseType, setPackageJsonVersion } from "./npmVersion";
import { stringToBoolean } from "./utils";

async function run() {
  const updatePackageJson = stringToBoolean(getInput("update_package_json", { required: false }));
  const moveMajorVersion = stringToBoolean(getInput("move_major_version_tag", { required: false }));

  const releaseType = getInput("release_type", { required: false }) as ReleaseType;
  const tagName = getInput("tag_name", { required: false });
  const gitTagPrefix = getInput("git_tag_prefix", { required: true });

  debug(`updatePackageJsonInput: ${updatePackageJson}`);
  debug(`releaseTypeInput: ${releaseType}`);
  debug(`tagNameInput: ${tagName}`);
  debug(`tagNameInput: ${tagName}`);

  let version = clean(tagName);

  if (!tagName) {
    const latestVersion = await getLatestVersion();

    version = inc(latestVersion, releaseType);
  }

  if (!version) {
    setFailed("Unable to validate version.");
    exit(1);
  }

  debug(`version: ${version}`);

  if (updatePackageJson) {
    if (neq(version, getVersionFromPackageJson())) {
      setPackageJsonVersion(releaseType, version);

      const isSuccessful = await commitWithApi("Update package.json");

      if (!isSuccessful) {
        setFailed("Unable to update package.json");
        exit(1);
      }
    }
  }

  if (moveMajorVersion) {
    await moveMajorVersionTag(version, gitTagPrefix);
  }

  await createRelease(version);
}

run();
