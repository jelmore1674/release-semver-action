import * as actionsCore from "@actions/core";
import nock from "nock";
import process from "node:process";
import { afterEach, describe, expect, test, vi } from "vitest";
import { createRelease } from ".";

describe("createRelease", () => {
  afterEach(() => {
    vi.resetAllMocks();
    nock.cleanAll();
  });

  test("Can create a release", async () => {
    process.env.INPUT_BODY = "";
    process.env.INPUT_RELEASE_NAME = "";
    process.env.INPUT_BODY = "";

    nock("https://api.github.com")
      .persist()
      .post(
        "/repos/jelmore1674/release-semver-action/releases",
      )
      .reply(201, {
        id: 1,
        html_url: "https://github.com/jelmore1674/release-semver-action/releases/v1.0.0",
        upload_url: "https://uploads.github.com",
      });

    const setOutput = vi.spyOn(actionsCore, "setOutput");

    await createRelease("1.0.0");

    expect(setOutput).toHaveBeenCalledTimes(3);
  });

  test("Can handle error when thrown.", async () => {
    process.env.INPUT_BODY = "";
    process.env.INPUT_RELEASE_NAME = "";
    process.env.INPUT_GIT_TAG_PREFIX = "v";
    process.env.GITHUB_REPOSITORY = "jelmore1674/release-semver-action";
    process.env.INPUT_BODY = "";
    process.env.INPUT_TOKEN = "token";

    nock("https://api.github.com")
      .persist()
      .post(
        "/repos/jelmore1674/release-semver-action/releases",
      )
      .reply(404);

    await expect(() => createRelease("1.0.0")).rejects.toThrowError();
  });
});
