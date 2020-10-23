const gql = require("graphql-tag");

const typeDefs = gql`
  type comments {
    _id: ID!
    body: String!
    user: ID!
    createdAt: String!
    updatedAt: String!
  }
  type likes {
    _id: ID!
    user: ID!
    createdAt: String!
    updatedAt: String!
  }
  type User {
    _id: ID!
    image: String!
    username: String!
    email: String!
    token: String!
    createdAt: String!
  }
  type Post {
    _id: ID!
    body: String!
    user: User
    image: String!
    comments: [comments]!
    likes: [likes]!
    totalComment: Int!
    totalLike: Int!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    getPosts: [Post]
    getPostById(postId: ID!): Post!
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
  extend type Mutation {
    createPost(body: String!, image: String): Post!
    updatePost(postId: ID!, body: String!): Post!
    deletePost(postId: ID!): String
  }
  extend type Mutation {
    createComment(body: String!, postId: ID!): Post!
    updateComment(commentId: ID!, postId: ID!, body: String!): Post!
    deleteComment(commentId: ID!, postId: ID!): Post!
  }
  extend type Mutation {
    likeUnlikePost(postId: ID!): Post!
  }

  type Subscription {
    newPost: Post!
  }
`;

module.exports = typeDefs;
