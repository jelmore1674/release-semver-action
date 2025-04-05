import { setFailed } from "@actions/core";
import { context } from "@actions/github";
import { exit } from "node:process";
import { major } from "semver";
import { gitBranch } from "./git";
import { requestClient, restClient } from "./github";

/**
 * Move the majorVersion tag
 *
 * @param version - the full version that we will be moving to match.
 * @param gitTagPrefix- the git tag prefix
 */
async function moveMajorVersionTag(version: string, gitTagPrefix: string) {
  const { repo, owner } = context.repo;
  const rawMajorVersion = major(version);
  const majorVersion = `${gitTagPrefix}${rawMajorVersion}`;

  console.info(`Updating the ${majorVersion} tag.`);

  const branch = await gitBranch();
  const latestCommit = await requestClient("GET /repos/{owner}/{repo}/commits/{ref}", {
    owner,
    repo,
    ref: branch,
  });

  console.info(`Latest SHA: ${latestCommit.data.sha}`);

  try {
    await requestClient("PATCH /repos/{owner}/{repo}/git/refs/{ref}", {
      owner,
      repo,
      ref: `refs/tags/${majorVersion}`,
      sha: latestCommit.data.sha,
      force: true,
    });

    console.info(`Successfully moved the tag:\n\ntag: ${majorVersion}\nsha: ${latestCommit.data.sha}`);
  } catch (e) {
    console.info("Unable to update tag. Attempting to create the tag.");

    console.info({ e });

    const response = await restClient.git.createRef({
      owner,
      repo,
      ref: `refs/tags/${majorVersion}`,
      sha: latestCommit.data.sha,
    });

    if (response) {
      return;
    }

    setFailed(`Unable to update the ${majorVersion} tag`);
    exit(1);
  }
}

export { moveMajorVersionTag };
