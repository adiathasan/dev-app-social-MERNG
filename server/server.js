const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");

// relative imports
const { MONGODB_URI } = require("./config");
const typeDefs = require("./gql/type_defs/typeDefs");
const postResolver = require("./gql/resolvers/postsResolver");
const userResolver = require("./gql/resolvers/usersResolver");

const dbFunc = async () => {
  const connect = await mongoose.connect(MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  if (connect) {
    console.log("mongoDB connected");
  }
};

dbFunc();

const resolvers = {
  Query: {
    ...postResolver.Query,
  },
  Mutation: {
    ...userResolver.Mutation,
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen(5000).then((res) => {
  console.log("listening for requests on port:5000");
});
