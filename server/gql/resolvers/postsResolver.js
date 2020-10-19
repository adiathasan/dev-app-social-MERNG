const { Post } = require("../../models/postModel");

const postResolver = {
  Query: {
    getPosts: async () => {
      try {
        const posts = await Post.find({});
        return posts;
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};

module.exports = postResolver;
