const { makeAugmentedSchema } = require("neo4j-graphql-js");
const { ApolloServer } = require("apollo-server");
const neo4j = require("neo4j-driver");

export const command = "dev";
export const desc = "Start GraphQL service";

/**
 *
 * **`grandstack graphql dev`**

Start local GraphQL server.

Options (should also be taken from environment variables):
  * `--type-defs`
  * `--type-defs-file`
  * `--neo4j-uri`
  * `--neo4j-user`
  * `--neo4j-password`
  * `--port`
 */

export const builder = (yargs) => {
  yargs
    .option("types", {
      description: "The GraphQL type definitions",
      required: true,
    })
    .option("neo4j-uri", {
      description:
        'URI for the Neo4j instance. Example: "bolt://localhost:7798"',
      required: true,
    })
    .option("neo4j-user", {
      description: "Database user",
      required: true,
    })
    .option("neo4j-password", {
      description: "Database password for given user",
      string: true,
      required: true,
    })
    .option("encrypted", {
      description: "Use an encrypted connection to Neo4j",
    })
    .option("database", {
      description: "The Neo4j database to use",
    })
    .option("graphql-port", {
      description: "The port for the GraphQL API to listen on",
      type: "number",
    }).example(`$0 graphql dev \\
      --types "type Person {name: string}" \\
      --neo4j-uri bolt://localhost:7687 \\
      --neo4j-user neo4j \\
      --neo4j-password letmein`);
};

export const handler = ({
  types,
  "neo4j-uri": neo4j_uri,
  "neo4j-user": neo4j_user,
  "neo4j-password": neo4j_password,
  "graphql-port": graphql_port,
  encrypted = false,
  database,
}) => {
  const port = graphql_port || 3003;

  const schema = makeAugmentedSchema({ typeDefs: types });

  const driver = neo4j.driver(
    neo4j_uri,
    neo4j.auth.basic(neo4j_user, neo4j_password),
    { encrypted: `${encrypted ? "ENCRYPTION_ON" : "ENCRYPTION_OFF"}` }
  );

  const server = new ApolloServer({
    schema,
    context: { driver, neo4jDatabase: database },
  });

  server.listen(port, "0.0.0.0").then(({ url }) => {
    console.log(`GraphQL API ready at ${url}`);
  });
};
