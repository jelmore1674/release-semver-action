import { setFailed } from "@actions/core";
import { context } from "@actions/github";
import { exit } from "node:process";
import semver from "semver";
import { restClient } from "./github";

/**
 * Get the latest version of the current repo.
 */
async function getLatestVersion() {
  try {
    const { owner, repo } = context.repo;

    const latestRelease = await restClient.repos.getLatestRelease({ owner, repo });

    const cleanedVersion = semver.clean(latestRelease.data.tag_name);

    if (!cleanedVersion) {
      throw new Error("Unable to validate version.");
    }

    return cleanedVersion;
  } catch (error) {
    if (error) {
      let errorMessage = "Unable to get the latest release.";

      if (error instanceof Error) {
        if (!error.message.includes("Not Found")) {
          errorMessage = error.message;
        }
      }

      setFailed(errorMessage);
      exit(1);
    }
  }

  throw new Error("Unable to find the latest release or tag.");
}

export { getLatestVersion };
