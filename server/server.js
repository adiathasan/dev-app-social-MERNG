const { ApolloServer, PubSub } = require("apollo-server");
const mongoose = require("mongoose");

// relative imports
const { MONGODB_URI } = require("./env");
const typeDefs = require("./gql/type_defs/typeDefs");
const postResolver = require("./gql/resolvers/postsResolver");
const userResolver = require("./gql/resolvers/usersResolver");

const pubsub = new PubSub();

const dbFunc = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log("mongoDB connected");
  } catch (error) {
    throw new Error("couldn't connect");
  }
};

dbFunc();

const resolvers = {
  Post: {
    totalLike: (parent) => parent.likes.length,
    totalComment: (parent) => parent.comments.length,
  },
  User: {
    totalFollowers: (parent) => parent.followers.length,
    totalFollowing: (parent) => parent.following.length,
  },
  Query: {
    ...userResolver.Query,
    ...postResolver.Query,
  },
  Mutation: {
    ...userResolver.Mutation,
    ...postResolver.Mutation,
  },
  Subscription: {
    ...postResolver.Subscription,
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubsub }),
  cors: { credentials: true },
});

server.listen(5000).then((res) => {
  console.log("listening for requests on port:5000");
});
