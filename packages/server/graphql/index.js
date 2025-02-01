import path from 'path';

import { ApolloServer } from 'apollo-server-express';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import { makeExecutableSchema } from 'graphql-tools';

import { Base } from '../services';
import auth from '../authentications';

const env = process.env.NODE_ENV || 'development';

const typesArray = fileLoader(path.join(__dirname, '/**/*.graphql'), {
  recursive: true
});

const resolversArray = fileLoader(path.join(__dirname, '/**/*.resolver.js'), {
  recursive: true
});

const typeDefs = mergeTypes(typesArray, { all: true });
const resolvers = mergeResolvers(resolversArray, { all: true });
const schema = makeExecutableSchema({ typeDefs, resolvers });

module.exports = new ApolloServer({
  schema,
  context: async ({ req, res }) => {
    const currentToken = (req.headers.authorization || '').substr(7);

    try {
      //do not check session for this phase
      // if (!isVerifiedSession(req.session, currentToken)) {
      //   throw new AuthenticationError(
      //     'you are unauthorized to do this action!'
      //   );
      // }

      const payload = await auth.verify(currentToken);

      const [currentUser, currentPartner] = await Promise.all([
        Base.getUserByType(payload),
        Base.getCurrentPartner(payload)
      ]);

      return {
        currentUser,
        currentPartner,
        req,
        res
      };
    } catch (error) {
      throw error;
    }
  },
  formatError: error => {
    if (env === 'production') {
      delete error.extensions.exception;
    }

    return error;
  }
});
