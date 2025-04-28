import nock from "nock";
import { afterEach, describe, expect, test, vi } from "vitest";
import { moveMajorVersionTag } from ".";

const sha = "6dcb09b5b57875f334f61aebed695e2e4193db5e";

vi.mock("@jelmore1674/github-action-helpers", async () => {
  const actual = await vi.importActual("@jelmore1674/github-action-helpers");
  return {
    ...actual,
    getBranch: async () => "main",
  };
});

describe("moveMajorVersionTag", () => {
  afterEach(() => {
    vi.resetAllMocks();
    nock.cleanAll();
  });

  test("Can update existing tag", async () => {
    nock("https://api.github.com")
      .persist()
      .get(
        "/repos/jelmore1674/release-semver-action/commits/main",
      )
      .reply(200, { sha });

    nock("https://api.github.com")
      .persist()
      .patch(
        "/repos/jelmore1674/release-semver-action/git/refs/tags%2Fv1",
      )
      .reply(200);

    await expect(moveMajorVersionTag("1.0.0", "v")).resolves.toBeUndefined();
  });

  test("Can create a tag if existings tag not found", async () => {
    nock("https://api.github.com")
      .persist()
      .get(
        "/repos/jelmore1674/release-semver-action/commits/main",
      )
      .reply(200, { sha });

    nock("https://api.github.com")
      .persist()
      .patch(
        "/repos/jelmore1674/release-semver-action/git/refs/tags%2Fv1",
      )
      .reply(404);

    nock("https://api.github.com")
      .persist()
      .post(
        "/repos/jelmore1674/release-semver-action/git/refs",
        { ref: "refs/tags/v1", sha },
      )
      .reply(201);

    await expect(moveMajorVersionTag("1.0.0", "v")).resolves.toBeUndefined();
  });

  test("Will throw when cannot create tag.", async () => {
    nock("https://api.github.com")
      .persist()
      .get(
        "/repos/jelmore1674/release-semver-action/commits/main",
      )
      .reply(200, { sha });

    nock("https://api.github.com")
      .persist()
      .patch(
        "/repos/jelmore1674/release-semver-action/git/refs/tags%2Fv1",
      )
      .reply(404);

    nock("https://api.github.com")
      .persist()
      .post(
        "/repos/jelmore1674/release-semver-action/git/refs",
        { ref: "refs/tags/v1", sha },
      )
      .reply(404);

    await expect(moveMajorVersionTag("1.0.0", "v")).rejects.toThrowError();
  });
});
