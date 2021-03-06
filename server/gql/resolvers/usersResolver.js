const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");

const { JWT_SECRET_KEY } = require("../../env");
const { User } = require("../../models/userModels");
const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../utils/validators");
const auth = require("../../utils/auth");
const { Post } = require("../../models/postModel");

const gererateToken = async (user) => {
  const token = jwt.sign(
    { _id: user._id, email: user.email, username: user.username },
    JWT_SECRET_KEY,
    { expiresIn: "30d" }
  );
  return token;
};

const userResolver = {
  Query: {
    getUserById: async (_, { userId }, context) => {
      const user = auth(context);
      if (user) {
        const requestedUser = await User.findById(userId);
        if (requestedUser) {
          const posts = await Post.find({ user: userId }).populate("user");
          return { user, posts };
        } else {
          throw new UserInputError("user not found");
        }
      }
    },
  },
  Mutation: {
    login: async (_, { loginInput: { email, password } }) => {
      const { isValid, errors } = validateLoginInput({ email, password });
      if (!isValid) {
        throw new UserInputError("Validation failed", {
          errors,
        });
      }
      const user = await User.findOne({ email });
      if (!user) {
        errors.email = "Invalid email";
        throw new UserInputError("email error", {
          errors,
        });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.password = "Invalid Password ";
        throw new UserInputError("password error", {
          errors,
        });
      }

      const token = await gererateToken(user);

      return { ...user._doc, token };
    },

    register: async (_, { registerInput: { username, password, email } }) => {
      const { errors, isValid } = validateRegisterInput({
        username,
        email,
        image: "/...../",
      });

      if (!isValid) {
        throw new UserInputError("Validation failed", {
          errors,
        });
      }

      const user = await User.findOne({ email });

      if (user) {
        throw new UserInputError("Email is already in use", {
          errors: {
            username: "This email is taken",
          },
        });
      }

      password = await bcrypt.hash(password, 12);
      const createdUser = await User.create({ username, password, email });
      const token = await gererateToken(createdUser);

      return { ...createdUser._doc, token };
    },
    followUnfollowUser: async (
      _,
      { followArgs: { userId, userTofollowId, userTofollowUsername } },
      context
    ) => {
      const checkedUser = auth(context);
      if (checkedUser) {
        const user = await User.findById(userId);
        const userTofollow = await User.findById(userTofollowId);
        if (user) {
          const indexOfFollowers = userTofollow.followers.findIndex(
            (f) => f.user._id == user._id
          );
          if (indexOfFollowers === -1) {
            userTofollow.followers = [
              { user: user._id, username: user.username },
              ...userTofollow.followers,
            ];
          } else {
            userTofollow.followers.splice(indexOfFollowers, 1);
          }
          const indexOfFollowing = user.following.findIndex(
            (f) => f.user._id == userTofollow._id
          );
          if (indexOfFollowing === -1) {
            user.following = [
              { user: user._id, username: userTofollowUsername },
              ...user.followers,
            ];
          } else {
            user.following.splice(indexOfFollowing, 1);
          }
          const updatedUser = await user.save();
          await userTofollow.save();
          return updatedUser;
        } else {
          throw new UserInputError("user not found");
        }
      }
    },
  },
};

module.exports = userResolver;
