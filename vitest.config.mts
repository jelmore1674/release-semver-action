import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    env: {
      GITHUB_SERVER_URL: "https://github.com",
      GITHUB_REPOSITORY: "jelmore1674/release-semver-action",
      INPUT_TOKEN: "token",
      INPUT_GIT_TAG_PREFIX: "v",
    },
    environment: "node",
    include: ["./src/**/*.test.ts"],
    exclude: ["dist", "lib"],
    retry: 1,
    coverage: {
      reporter: ["text", "json", "html"],
      include: ["src"],
      exclude: ["dist"],
    },
  },
});
