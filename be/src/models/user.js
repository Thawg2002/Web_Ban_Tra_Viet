import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      minlength: 3,
      maxlength: 30,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    avatar: {
      type: String,
      default: "../upload/default-avatar.jpeg",
    },
    blocked_at: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: Number,
    }
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("User", userSchema);
