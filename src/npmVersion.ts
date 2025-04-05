import { execSync } from "node:child_process";

/**
 * The supported SemVer release types
 */
type ReleaseType = "major" | "minor" | "patch";

/**
 * Get the version from the `package.json` file.
 */
function getVersionFromPackageJson() {
  return execSync("npm pkg get version", { encoding: "utf8" }).replace(/"/g, "");
}

/**
 * Set the version using the npm cli `version` command.
 *
 * @param releaseType - The release type.
 * @param [version] - Override the release type by setting the version directly.
 */
function setPackageJsonVersion(releaseType: ReleaseType, version?: string | null) {
  return execSync(`npm version ${version || releaseType}`, { encoding: "utf8" }).replace(/"/g, "");
}

export type { ReleaseType };

export { getVersionFromPackageJson, setPackageJsonVersion };
