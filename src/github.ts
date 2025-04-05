import { getInput } from "@actions/core";
import { getOctokit } from "@actions/github";

const githubToken = getInput("token", { required: true });
const github = getOctokit(githubToken);

const restClient = github.rest;
const graphqlClient = github.graphql;

export { graphqlClient, restClient };
