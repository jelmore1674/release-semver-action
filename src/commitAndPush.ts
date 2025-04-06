import { debug, setFailed } from "@actions/core";
import { context } from "@actions/github";
import { exit } from "node:process";
import { getExpectedHeadOid, gitBranch, gitDiff } from "./git";
import { graphqlClient } from "./github";

/**
 * Commit using the GitHub GraphQL api.
 *
 * @param commitMessage - the commit message.
 * @param skipCi - Add the [skip ci] to end of commit to prevent workflows from triggering.
 *
 * @returns  if the api request isSuccessful.
 */
async function commitWithApi(commitMessage: string, skipCi?: boolean) {
  const branch = await gitBranch();
  const repo = `${context.repo.owner}/${context.repo.repo}`;

  const skippedCiCommitMessage = `${commitMessage} [skip ci]`;

  debug(`repo: ${repo}`);

  const expectedHeadOid = await getExpectedHeadOid(branch);

  const { fileAdditions, fileDeletions } = await gitDiff();
  if (fileAdditions.length > 0 || fileDeletions.length > 0) {
    try {
      await graphqlClient(
        `mutation($expectedHeadOid: GitObjectID!, $fileAdditions: [FileAddition!]!, $fileDeletions: [FileDeletion!]!) {
          createCommitOnBranch(
            input: {
              branch: {
                repositoryNameWithOwner: "${repo}",
                branchName: "${branch}"
              },
              message: { headline: "${skipCi ? skippedCiCommitMessage : commitMessage}" },
              fileChanges: {
                additions: $fileAdditions,
                deletions: $fileDeletions
              },
              expectedHeadOid: $expectedHeadOid
            }
          ){
            commit {
              url,
              changedFilesIfAvailable
            }
          }
        }`,
        {
          expectedHeadOid,
          fileAdditions,
          fileDeletions,
        },
      );
    } catch (error) {
      let errorMessage = "Unable to create commit.";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      setFailed(errorMessage);
      exit(1);
    }
  }

  return true;
}

export { commitWithApi };
