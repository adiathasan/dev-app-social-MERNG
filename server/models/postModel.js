const { Schema, model } = require("mongoose");

const postSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    body: String,
    image: String,
    comments: [
      new Schema(
        {
          body: String,
          user: { type: Schema.Types.ObjectId, ref: "User" },
          username: { type: String },
        },
        { timestamps: true }
      ),
    ],
    likes: [
      new Schema(
        {
          user: { type: Schema.Types.ObjectId, ref: "User" },
          username: { type: String },
        },
        { timestamps: true }
      ),
    ],
  },
  { timestamps: true }
);

module.exports = {
  Post: model("Post", postSchema),
};
