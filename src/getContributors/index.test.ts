import nock from "nock";
import { afterEach, describe, expect, test, vi } from "vitest";
import { getContributors } from ".";

const tag_name = "v1";

const repo = {
  default_branch: "main",
};

const userCommit = {
  author: {
    login: "jelmore1674",
    type: "User",
  },
};

const botCommit = {
  author: {
    login: "dependabot[bot]",
    type: "Bot",
  },
};

describe("getContributors", () => {
  afterEach(() => {
    vi.resetAllMocks();
    nock.cleanAll();
  });

  test("Can get contributors from all commits", async () => {
    nock("https://api.github.com")
      .persist()
      .get(
        "/repos/jelmore1674/release-semver-action/releases/latest",
      )
      .reply(200, { tag_name: null });

    nock("https://api.github.com")
      .persist()
      .get(
        "/repos/jelmore1674/release-semver-action",
      )
      .reply(200, repo);

    nock("https://api.github.com")
      .persist()
      .get(
        "/repos/jelmore1674/release-semver-action/commits",
      )
      .reply(200, [userCommit, botCommit, { author: { ...userCommit.author, login: "testUser" } }]);

    const result = await getContributors();
    expect(result).toBe("### Contributors\n@jelmore1674\n@testUser");
  });

  test("Can get contributors from comparison to latest release", async () => {
    nock("https://api.github.com")
      .persist()
      .get(
        "/repos/jelmore1674/release-semver-action/releases/latest",
      )
      .reply(200, { tag_name });

    nock("https://api.github.com")
      .persist()
      .get(
        "/repos/jelmore1674/release-semver-action",
      )
      .reply(200, repo);

    nock("https://api.github.com")
      .persist()
      .get(
        "/repos/jelmore1674/release-semver-action/compare/v1...main",
      )
      .reply(200, { commits: [userCommit, botCommit, userCommit] });

    const result = await getContributors();
    expect(result).toBe("### Contributors\n@jelmore1674");
  });
});
