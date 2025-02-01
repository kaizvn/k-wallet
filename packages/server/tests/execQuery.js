import path from 'path';

import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import { graphql } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';

const typesArray = fileLoader(path.join(__dirname, '../graphql/**/*.graphql'), {
  recursive: true
});

const resolversArray = fileLoader(
  path.join(__dirname, '../graphql/**/*.resolver.js'),
  {
    recursive: true
  }
);

const typeDefs = mergeTypes(typesArray, { all: true });
const resolvers = mergeResolvers(resolversArray, { all: true });
const schema = makeExecutableSchema({ typeDefs, resolvers });

const execQuery = (...args) => {
  let query, variables, ctx;

  if (args.length === 2) {
    query = args[0];
    variables = {};
    ctx = args[1];
  }
  if (args.length === 3) {
    query = args[0];
    variables = args[1];
    ctx = args[2];
  }

  const rootValue = {};

  return graphql(schema, query, rootValue, ctx, variables);
};

const safe = async (...args) => {
  const { data, errors } = await execQuery(...args);

  expect(errors).toBeUndefined();
  expect(data).toBeDefined();

  return { data, errors };
};

module.exports = execQuery;
module.exports.safe = safe;
