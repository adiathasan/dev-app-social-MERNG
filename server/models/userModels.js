const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: String,
    password: String,
    email: String,
    followers: [{ user: Schema.Types.ObjectId, username: String }],
    following: [{ user: Schema.Types.ObjectId, username: String }],
  },
  { timestamps: true }
);

module.exports = {
  User: model("User", userSchema),
};
