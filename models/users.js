const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    password: {
      type: String,
      required: [true, "Set password for user"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },

    avatarURL: {
      type: String,
    },

    token: { type: String },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const User = mongoose.model("user", schema);

module.exports = {
  User,
};
