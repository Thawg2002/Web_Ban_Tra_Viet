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
    phone: {
      type: Number,
    },
    birthDay: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    resetPasswordToken: {
      type: String,
    }, // Thêm token để reset mật khẩu
    resetPasswordExpiry: {
      type: Date,
    }, // Thêm thời gian hết hạn của token
    avatar: {
      type: String,
    },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("User", userSchema);
