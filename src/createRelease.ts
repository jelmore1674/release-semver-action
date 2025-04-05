import { getInput, setFailed, setOutput } from "@actions/core";
import { context } from "@actions/github";
import { exit } from "node:process";
import { restClient } from "./github";

async function createRelease(version: string, target_commitish: string) {
  try {
    const { owner, repo } = context.repo;

    const body = getInput("body", { required: false });
    const gitTagPrefix = getInput("git_tag_prefix", { required: true });
    const generate_release_notes = Boolean(body);

    console.info({ body });

    const tag_name = `${gitTagPrefix}${version}`;

    const createdRelease = await restClient.repos.createRelease({
      owner,
      repo,
      tag_name,
      name: tag_name,
      body,
      target_commitish,
      generate_release_notes,
    });

    const { data: { id, html_url, upload_url } } = createdRelease;

    setOutput("release_id", id);
    setOutput("html_url", html_url);
    setOutput("upload_url", upload_url);
  } catch (error) {
    let errorMessage = "Unable to create release.";

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    setFailed(errorMessage);
    exit(1);
  }
}

export { createRelease };
