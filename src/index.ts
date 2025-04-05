import { getInput, setFailed, warning } from "@actions/core";
import { exit } from "node:process";
import { clean, inc, neq } from "semver";
import { commitWithApi } from "./commitAndPush";
import { createRelease } from "./createRelease";
import { getLatestVersion } from "./getLatestVersion";
import { getVersionFromPackageJson, type ReleaseType, setPackageJsonVersion } from "./npmVersion";

async function run() {
  const updatePackageJson = Boolean(getInput("update_package_json", { required: false }));
  const releaseType = getInput("release_type", { required: false }) as ReleaseType;
  const tagName = getInput("tag_name", { required: false });
  let version = clean(tagName);

  if (!tagName) {
    const latestVersion = await getLatestVersion();

    version = inc(latestVersion, releaseType);
  }

  if (!version) {
    setFailed("Unable to validate version.");
    exit(1);
  }

  if (updatePackageJson) {
    if (neq(version, getVersionFromPackageJson())) {
      setPackageJsonVersion(releaseType, version);
      commitWithApi("Update package.json");
    }
  }

  await createRelease(version);
}

run();
