import nock from "nock";
import { afterEach, describe, expect, test, vi } from "vitest";
import { getLatestVersion } from ".";

describe("getLatestVersion", () => {
  afterEach(() => {
    vi.resetAllMocks();
    nock.cleanAll();
  });

  test("Can get latest version", async () => {
    nock("https://api.github.com")
      .persist()
      .get(
        "/repos/jelmore1674/release-semver-action/releases/latest",
      )
      .reply(200, { tag_name: "1.0.1" });

    const result = await getLatestVersion();
    expect(result).toBe("1.0.1");
  });

  test("Will throw when not found.", async () => {
    nock.cleanAll();
    nock("https://api.github.com")
      .persist()
      .get(
        "/repos/jelmore1674/release-semver-action/releases/latest",
      )
      .reply(404, "This is an error");

    await expect(getLatestVersion()).rejects.toThrowError();
  });
});
