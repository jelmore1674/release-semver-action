import { getInput, setFailed, setOutput } from "@actions/core";
import { context, getOctokit } from "@actions/github";
import { exit } from "node:process";
import { inc } from "semver";
import type { ReleaseType } from "./npmVersion";

async function createRelease(releaseType: ReleaseType, version?: string) {
  const { owner, repo } = context.repo;
  const githubToken = getInput("token", { required: true });
  const body = getInput("body", { required: false });
  const github = getOctokit(githubToken);
  const target_commitish = getInput("commitish", { required: false });
  const generate_release_notes = Boolean(body);

  let tag_name = version;

  if (!tag_name) {
    const latestRelease = await github.rest.repos.getLatestRelease({ owner, repo });

    if (!latestRelease) {
      throw Error("No tag");
    }

    const newTag = inc(latestRelease.data.tag_name, releaseType);
    if (!newTag) {
      setFailed("Unable to bump the latest version.");
      exit(1);
    }

    tag_name = `v${newTag}`;
  }

  const createdRelease = await github.rest.repos.createRelease({
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
}

export { createRelease };
