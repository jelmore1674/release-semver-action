import { execSync } from "node:child_process";

function run() {
  const newVersion = execSync("npm version patch", { encoding: "utf8" });
  console.log({ newVersion });
}

run();
