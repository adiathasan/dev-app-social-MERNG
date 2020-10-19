const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: String,
    password: String,
    email: String,
  },
  { timestamps: true }
);

module.exports = {
  User: model("User", userSchema),
};
