const { gql } = require('apollo-server-express');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type AuthenticationResponse {
    ok: Boolean!
    token: String
    refreshToken: String
    user: User
    error: Error
  }

  type Query {
    getUserToken(
      email: String
      password: String
      facebookId: String
      facebookAuthToken: String
      googleId: String
      googleAuthToken: String
    ): AuthenticationResponse!
  }
`;

module.exports = typeDefs;
