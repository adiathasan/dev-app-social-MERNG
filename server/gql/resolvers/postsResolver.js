const { AuthenticationError, ApolloError } = require("apollo-server");
const mongoose = require("mongoose");

const { Post } = require("../../models/postModel");
const checkAuth = require("../../utils/auth");

const postResolver = {
  Query: {
    getPosts: async () => {
      try {
        const posts = await Post.find({})
          .populate("user", "username email")
          .sort({ createdAt: -1 });
        return posts;
      } catch (error) {
        throw new Error(error);
      }
    },
    getPostById: async (_, { postId }) => {
      if (mongoose.isValidObjectId(postId)) {
        const post = await Post.findOne({ _id: postId }).populate(
          "user",
          "username email"
        );

        if (!post) {
          throw new ApolloError("Post not found.");
        } else {
          return { ...post._doc };
        }
      } else {
        throw new ApolloError("Post not found.");
      }
    },
  },
  Mutation: {
    createPost: async (_, { body, image }, context) => {
      const user = checkAuth(context);
      const post = await Post.create({
        user: user._id,
        body,
        user,
        image,
      });
      if (!post) {
        throw new Error("Couldn't create post");
      }

      context.pubsub.publish("NEW_POST", {
        newPost: post,
      });

      return { ...post._doc };
    },
    updatePost: async (_, { postId, body }) => {
      const post = await Post.findById(postId).populate(
        "user",
        "username email"
      );
      if (!post) {
        throw new Error("Post not found to update");
      }
      post.body = body;
      const updatedPost = await post.save();

      if (!updatedPost) {
        throw new Error("Couldn't update the post");
      }

      return { ...updatedPost._doc, ...post._doc.user };
    },

    deletePost: async (_, { postId }, context) => {
      const user = checkAuth(context);
      const post = await Post.findById(postId);
      if (!post) {
        throw new Error("post not found to delete");
      }
      console.log(post._doc.user, user._id);
      if (post._doc.user == user._id) {
        await Post.findByIdAndDelete(postId);
        return "Post deleted successfully";
      } else {
        throw new AuthenticationError("Not Authorized to delete the post");
      }
    },

    // comments

    createComment: async (_, { body, postId }, context) => {
      const { _id, username, email } = checkAuth(context);
      const post = await Post.findById(postId).populate(
        "user",
        "username email"
      );

      if (!post) {
        throw new Error("Couldn't comment on the post");
      }
      post.comments = [{ body, user: _id }, ...post.comments];

      const postWithNewComment = await post.save();
      return { ...postWithNewComment._doc, username, email };
    },

    updateComment: async (_, { commentId, postId, body }, context) => {
      const { _id, username, email } = checkAuth(context);
      const post = await Post.findById(postId).populate(
        "user",
        "username email"
      );

      if (!post) {
        throw new Error("Couldn't comment on the post");
      }
      const indexDelete = post.comments.findIndex((c) => {
        return c._id == commentId;
      });

      if (post.comments[indexDelete].user._id == _id) {
        post.comments[indexDelete].body = body;
        await post.save();
        return { ...post._doc, username, email };
      } else {
        throw new AuthenticationError("Not Authorized");
      }
    },
    deleteComment: async (_, { commentId, postId }, context) => {
      const { _id, username, email } = checkAuth(context);
      const post = await Post.findById(postId).populate(
        "user",
        "username email"
      );

      if (!post) {
        throw new Error("Couldn't delete the post");
      }
      const indexDelete = post.comments.findIndex((c) => {
        return c._id == commentId;
      });

      if (post.comments[indexDelete].user._id == _id) {
        post.comments.splice(indexDelete, 1);
        await post.save();
        return { ...post._doc, username, email };
      } else {
        throw new AuthenticationError("Not Authorized");
      }
    },
    likeUnlikePost: async (_, { postId }, context) => {
      const { _id, username, email } = checkAuth(context);
      const post = await Post.findById(postId).populate(
        "user",
        "username email"
      );
      if (!post) {
        throw new Error("Couldn't delete the post");
      }
      const unLikeIndex = post.likes.findIndex((p) => p.user._id == _id);
      if (unLikeIndex !== -1) {
        post.likes.splice(unLikeIndex, 1);
        console.log(post.likes, "unlike", unLikeIndex);
      } else {
        post.likes = [{ user: _id }, ...post.likes];
        console.log(post.likes);
      }
      const updatedPost = await post.save();
      return { ...updatedPost._doc, username, email };
    },
  },
  Subscription: {
    newPost: {
      subscribe: (_, __, { pubsub }) => {
        return pubsub.asyncIterator("NEW_POST");
      },
    },
  },
};

module.exports = postResolver;
