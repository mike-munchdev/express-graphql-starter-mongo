const { gql } = require('apollo-server-express');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type User {
    id: ID!
    email: String
    firstName: String!
    middleName: String
    lastName: String!
    googleId: String
    facebookId: String
    pushTokens: [String!]
    isActive: Boolean
    confirmToken: String
    createdAt: Date!
  }

  type UserResponse {
    ok: Boolean!
    user: User
    error: Error
  }

  input CreateUserInput {
    email: String!
    firstName: String!
    middleName: String
    lastName: String!
    password: String!
    googleId: String
    facebookId: String
  }

  input UpdateUserInput {
    userId: String!
    email: String
    firstName: String
    middleName: String
    lastName: String
    googleId: String
    facebookId: String
  }

  input UpdateUserPasswordInput {
    userId: String!
    password: String!
  }

  input UserSignupInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String
    facebookId: String
    facebookAuthToken: String
    googleId: String
    googleAuthToken: String
  }

  input AddPushToken {
    userId: String!
    pushToken: String!
  }

  type Query {
    getUserById(userId: String!): UserResponse!
  }

  type Mutation {
    createUser(input: CreateUserInput!): UserResponse!
    updateUser(input: UpdateUserInput!): UserResponse!
    updateUserPassword(input: UpdateUserPasswordInput!): GeneralResponse!
    userSignup(input: UserSignupInput!): GeneralResponse!
    addPushToken(input: AddPushToken!): UserResponse!
    activateUserAccount(confirmToken: String!): GeneralResponse!
  }
`;

module.exports = typeDefs;
