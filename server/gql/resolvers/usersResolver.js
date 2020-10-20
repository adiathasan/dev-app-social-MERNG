const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");

const { JWT_SECRET_KEY } = require("../../env");
const { User } = require("../../models/userModels");
const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../utils/validators");

const gererateToken = async (user) => {
  const token = jwt.sign(
    { _id: user._id, email: user.email, username: user.username },
    JWT_SECRET_KEY,
    { expiresIn: "30d" }
  );
  return token;
};

const userResolver = {
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
  },
};

module.exports = userResolver;
