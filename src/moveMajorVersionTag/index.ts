import { info, setFailed } from "@actions/core";
import { context } from "@actions/github";
import { getBranch } from "@jelmore1674/github-action-helpers";
import { exit } from "node:process";
import { major } from "semver";
import { requestClient, restClient } from "../github";

/**
 * Move the majorVersion tag
 *
 * @param version - the full version that we will be moving to match.
 * @param gitTagPrefix- the git tag prefix
 */
async function moveMajorVersionTag(version: string, gitTagPrefix: string) {
  const rawMajorVersion = major(version);
  const majorVersion = `${gitTagPrefix}${rawMajorVersion}`;

  info(`Updating the ${majorVersion} tag.`);

  const branch = await getBranch();
  const latestCommit = await requestClient("GET /repos/{owner}/{repo}/commits/{ref}", {
    ...context.repo,
    ref: branch,
  });

  info(`Latest SHA: ${latestCommit.data.sha}`);

  try {
    await restClient.git.updateRef({
      ...context.repo,
      ref: `tags/${majorVersion}`,
      sha: latestCommit.data.sha,
      force: true,
    });

    info(`Successfully moved the tag:\n\ntag: ${majorVersion}\nsha: ${latestCommit.data.sha}`);
  } catch (_error) {
    info("Unable to update tag. Attempting to create the tag.");

    try {
      await restClient.git.createRef({
        ...context.repo,
        ref: `refs/tags/${majorVersion}`,
        sha: latestCommit.data.sha,
      });
    } catch (_error) {
      setFailed(`Unable to update the ${majorVersion} tag`);
      exit(1);
    }
  }
}

export { moveMajorVersionTag };
