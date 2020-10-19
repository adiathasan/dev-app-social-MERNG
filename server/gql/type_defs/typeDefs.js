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
    password: String!
    email: String!
    token: String!
  }
  input registerInput {
    username: String!
    password: String!
    email: String!
  }
  type Mutation {
    register(registerInput: registerInput): User!
  }
`;

module.exports = typeDefs;
