const { User } = require("../../models/userModels");

const userResolver = {
  Mutation: {
    register: async (
      _,
      { registerInput: { username, password, email } },
      context,
      info
    ) => {
      try {
        const user = await User.findOne({ username });
        if (user) {
          return {
            message: "Oops! email already in use",
          };
        } else {
          const createdUser = await User.create({ username, password, email });
          return createdUser;
        }
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};

module.exports = userResolver;
