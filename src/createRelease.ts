import { getInput } from "@actions/core";
import { context, getOctokit } from "@actions/github";

async function createRelease() {
  const { owner, repo } = context.repo;
  const githubToken = getInput("token", { required: true });
  const github = getOctokit(githubToken);

  // target_commitish
  await github.rest.repos.createRelease({
    owner,
    repo,
    tag_name: "v0.0.1",
  });
}

export { createRelease };
