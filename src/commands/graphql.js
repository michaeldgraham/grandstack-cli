export const command = "graphql";
export const aliases = [];
export const desc = "GraphQL operations for GRANDstack";

export const builder = (yargs) =>
  yargs.commandDir("./graphql", { recurse: true }).demandCommand().argv;
