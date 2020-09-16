if (process.env.NODE_ENV !== 'production') require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const http = require('http');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { ApolloServer } = require('apollo-server-express');
const context = require('./server/utils/context');
const helmet = require('helmet');
// const Bugsnag = require('@bugsnag/js');
// const BugsnagPluginExpress = require('@bugsnag/plugin-express');

// Bugsnag.start({
//   apiKey: process.env.BUGSNAG_API_KEY,
//   plugins: [BugsnagPluginExpress],
// });

const {
  validateToken,
  findUserByToken,
} = require('./server/utils/authentication');

// Provide schemas for apollo server
const typeDefs = require('./server/schemas/index');

// Provide resolver functions for your schema fields
const resolvers = require('./server/resolvers/index');

(async () => {
  // initialize server
  const app = express();
  //   const middleware = Bugsnag.getPlugin('express');
  //   app.use(middleware.requestHandler);
  //   app.use(middleware.errorHandler);
  //   app.use(helmet());
  const allowedOrigin = process.env.CORS_URL
    ? process.env.CORS_URL.split(',')
    : [''];

  app.use(
    cors({
      origin: allowedOrigin,
      credentials: true,
    })
  );

  app.use(cookieParser());

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(express.static(path.join(__dirname, 'public')));

  const playground = process.env.GRAPHQL_PLAYGROUND_ENABLED === 'true';
  const introspection = process.env.GRAPHQL_INTROSPECTION_ENABLED === 'true';

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection,
    playground,
    context,
    formatError: (err) => {
      console.log('graphql: error', err);
      return err;
    },
    subscriptions: {
      onConnect: async (connectionParams, webSocket) => {
        try {
          let token;
          if (connectionParams['x-auth']) {
            token = connectionParams['x-auth'];
          } else {
            token = connectionParams['headers']
              ? connectionParams['headers']['x-auth']
              : null;
          }
          if (token) {
            if (token === process.env.PASSTHROUGH_TOKEN)
              return { isAdmin: true };
            const decoded = await validateToken(token, process.env.JWT_SECRET);

            const user = await findUserByToken(decoded);

            return { user, isAdmin: false };
          } else {
            return {};
          }
          // throw new Error('Missing auth token!');
        } catch (e) {
          console.log('subscriptions: error', e);
          throw e;
        }
      },
    },
  });

  server.applyMiddleware({
    app,
    cors: false,
  });

  const httpServer = http.createServer(app);

  server.installSubscriptionHandlers(httpServer);
  const ipaddr = process.env.IP || 'localhost';
  const PORT = Number(process.env.PORT) || 4010;

  httpServer.listen({ port: PORT }, async () => {
    console.log(
      `🚀 GraphQL Server ready at http://${ipaddr}:${PORT}${server.graphqlPath}`
    );
    console.log(
      `🚀 GraphQL Subscriptions ready at ws://${ipaddr}:${PORT}${server.subscriptionsPath}`
    );

    (async () => {
      // await importDrugs();
    })();
  });
})();
