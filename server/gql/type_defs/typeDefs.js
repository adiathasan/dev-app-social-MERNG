const gql = require("graphql-tag");

const typeDefs = gql`
  type comments {
    body: String
    user: ID
  }
  type likes {
    user: ID
  }
  type Post {
    _id: ID!
    body: String!
    user: ID!
    comments: [comments]
    likes: [likes]
  }
  type Query {
    getPosts: [Post]
  }
  type User {
    _id: ID!
    username: String!
    email: String!
    token: String!
    createdAt: String!
  }
  input registerInput {
    username: String!
    password: String!
    email: String!
  }
  input loginInput {
    email: String!
    password: String!
  }
  type Mutation {
    login(loginInput: loginInput): User!
    register(registerInput: registerInput): User!
  }
`;

module.exports = typeDefs;
