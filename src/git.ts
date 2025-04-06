import { debug } from "@actions/core";
import { getExecOutput } from "@actions/exec";
import { readFileSync } from "node:fs";

const ADDITION_REGEX = /^1 \.?(M|A)\.?/;
const DELETION_REGEX = /^1 \.?D\.?/;

/**
 * This is used for creating the type that will be sent to GitHub for file changes.
 */
interface Addition {
  /**
   * The file path to the file with changes.
   */
  path: string;
  /**
   * Base64 encoded file that will be sent to the GitHub api.
   */
  contents: string;
}

/**
 * Add the change of the package.json
 */
async function gitDiff() {
  const { stdout: diff } = await getExecOutput("git", ["status", "--porcelain=v2", "--branch", "--untracked-files=no"]);

  debug(`Diff:\n${diff}`);

  const stagedAdditionFilePaths: string[] = [];
  const stagedDeletionFilePaths: string[] = [];

  const lines = diff.split("\n");

  for (const line of lines) {
    const file = line.split(" ").pop();

    if (file) {
      if (line.match(ADDITION_REGEX)) {
        stagedAdditionFilePaths.push(file);
      }

      if (line.match(DELETION_REGEX)) {
        stagedDeletionFilePaths.push(file);
      }
    }
  }

  const fileAdditions = stagedAdditionFilePaths.reduce((acc, path) => {
    debug(`Path: ${path}`);
    const file = readFileSync(path, { encoding: "utf8" });
    acc.push({ path, contents: Buffer.from(file).toString("base64") });
    return acc;
  }, [] as Addition[]);

  const fileDeletions = stagedDeletionFilePaths.map(path => ({
    path,
  }));

  debug(`File Additions: ${JSON.stringify(fileAdditions, null, 2)}`);
  return { fileAdditions, fileDeletions };
}

/**
 * The git commit oid expected at the head of the branch prior to the commit.
 *
 * @param branch - the branch we are currently on.
 */
async function getExpectedHeadOid(branch: string) {
  const { stdout: branchOid } = await getExecOutput("git", ["ls-remote", "origin", `refs/heads/${branch}`]);
  const { stdout: headOid } = await getExecOutput("git", ["ls-remote", "origin", "refs/heads/HEAD"]);

  // Fallback to the HEAD oid.
  const output = branchOid.split("\t")[0] || headOid.split("\t")[0];

  debug(`getExpectedHeadOid: ${output}`);
  return output;
}

/**
 * Get the current git branch.
 */
async function gitBranch() {
  const { stdout } = await getExecOutput("git", ["branch", "--show-current"]);
  const output = stdout.trim();

  debug(`gitBranch: ${output}`);
  return output;
}

export { getExpectedHeadOid, gitBranch, gitDiff };
