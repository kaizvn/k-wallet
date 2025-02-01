import './_env';
import './db';
import './sentry';

import ApolloServer from './graphql';
import app from './server';
//import cronJobs from './cronJobs';
import listeners from './pubsub';

//cronJobs();
listeners();

ApolloServer.applyMiddleware({
  app,
  path: process.env.GRAPHQL_PATH
});

const env = process.env.NODE_ENV || 'development';
const port = process.env.NODE_PORT || 3005;

app.listen({ port }, () => {
  console.log('environment:', env);
  console.log(`The GraphQL server is running on port ${port}`);
});

process.on('unhandledRejection', (error) => {
  // Will print "unhandledRejection err is not defined"
  console.log('unhandledRejection', error.message);
});
