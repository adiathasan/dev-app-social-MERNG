const gql = require("graphql-tag");

const typeDefs = gql`
  type comments {
    _id: ID!
    body: String!
    user: ID!
    username: String
    createdAt: String!
    updatedAt: String!
  }
  type likes {
    _id: ID!
    user: ID!
    createdAt: String!
    updatedAt: String!
    username: String
  }
  type followers {
    user: ID!
    username: String!
  }
  type following {
    user: ID!
    username: String!
  }
  type User {
    _id: ID!
    image: String!
    username: String!
    email: String
    token: String!
    createdAt: String!
    totalFollowing: Int!
    totalFollowers: Int!
    followers: [followers]
    following: [following]
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

  type UserWithPost {
    user: User!
    posts: [Post]!
  }

  type Query {
    getPosts: [Post]
    getPostById(postId: ID!): Post!
    getUserById(userId: ID!): UserWithPost!
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
  input followArgs {
    userId: ID!
    userTofollowId: ID!
    userTofollowUsername: String!
  }

  type Mutation {
    login(loginInput: loginInput): User!
    register(registerInput: registerInput): User!
    followUnfollowUser(followArgs: followArgs): User!
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
