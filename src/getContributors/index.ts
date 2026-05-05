import { setFailed } from "@actions/core";
import { context } from "@actions/github";
import { Endpoints } from "@octokit/types";
import { exit } from "node:process";
import { restClient } from "../github";

// Type for a commit response from the "get" method
type Commits = Endpoints["GET /repos/{owner}/{repo}/compare/{base}...{head}"]["response"]["data"]["commits"];

export async function getContributors() {
  let latestVersion: string | null = "";

  try {
    try {
      const latestRelease = await restClient.repos.getLatestRelease({ ...context.repo });
      latestVersion = latestRelease.data.tag_name;
    } catch (_error) {
      // Do not error, just want to get the latest version for a comparison if it is available.
    }

    const { data: repo } = await restClient.repos.get({ ...context.repo });

    let commits: Commits = [];

    if (latestVersion) {
      const { data: allCommits } = await restClient.repos.compareCommits({
        ...context.repo,
        base: latestVersion,
        head: repo.default_branch,
      });

      commits = allCommits.commits;
    } else {
      const { data: latestCommits } = await restClient.repos.listCommits({ ...context.repo });
      commits = latestCommits;
    }

    const contributors = commits.reduce((acc, commit) => {
      if (commit.author?.type !== "User") {
        return acc;
      }

      if (acc.includes(`@${commit.author?.login}`)) {
        return acc;
      }

      acc.push(`@${commit.author?.login}`);
      return acc;
    }, [] as string[]);

    return contributors.length
      ? `### Contributors
${contributors.join("\n")}`
      : "";
  } catch (error) {
    console.info(`🚨 Unable to add contributors 🚨`);
    return "";
  }
}
