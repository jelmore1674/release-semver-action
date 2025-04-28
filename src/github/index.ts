import { getInput } from "@actions/core";
import { getOctokit } from "@actions/github";

const githubToken = getInput("token", { required: true });
const github = getOctokit(githubToken, { request: { fetch } });

const restClient = github.rest;
const graphqlClient = github.graphql;
const requestClient = github.request;

export { graphqlClient, requestClient, restClient };
