const {
  AuthenticationError,
  SchemaError,
  ForbiddenError,
} = require('apollo-server-express');
const { validateToken, findUserByToken } = require('./authentication');

module.exports = async (args) => {
  try {
    let user;

    if (args.req) {
      const { query } = args.req.body;

      if (query) {
        const arr = query.split('\n');
        const req = args.req;
        const token = req.header('x-auth');

        // admin pass-through
        if (token === process.env.PASSTHROUGH_TOKEN)
          return { req, res: args.res, isAdmin: true };
        // console.log('arr', arr[1]);
        if (arr.length)
          if (
            arr[1].includes('getUserToken(') ||
            arr[1].includes('userSignup(') ||
            arr[1].includes('activateUserAccount(') ||
            arr[0].includes('query IntrospectionQuery {')
          ) {
            return { req, res: args.res };
          } else {
            if (!token) throw new ForbiddenError('missing token');

            const decoded = await validateToken(token, process.env.JWT_SECRET);

            user = await findUserByToken(decoded);

            if (!user) {
              const ip =
                req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.ips;
              const errorMessage = `#badtoken User with token ${token} not found. IP: ${ip}`;

              throw new ForbiddenError(errorMessage);
            }

            return { user, req: args.req, res: args.res };
          }
      } else {
        throw new SchemaError('Schema invalid');
      }
    } else {
      // console.log('web socket request');
      const isAdmin = args.connection.context.isAdmin;
      const user = args.connection.context.user;
      return { user, isAdmin };
    }
  } catch (e) {
    console.log(e);
    throw e;
  }
};
