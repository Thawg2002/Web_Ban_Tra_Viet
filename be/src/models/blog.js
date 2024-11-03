import mongoose from "mongoose";
import mongoosePaginate, { paginate } from "mongoose-paginate-v2";

const BlogsSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
    },
    thumbnail_url: {
      type: String,
      default: null,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    meta_title: {
      type: String,
      default: "",
    },
    meta_description: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      default: "",
    },
    views_count: {
      type: Number,
      required: true,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deleted_at: {
      type: Date,
      default: null,
    },
    countLike: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const BlogsModel = mongoose.model("Blogs", BlogsSchema);
BlogsSchema.plugin(mongoosePaginate);
export default BlogsModel;
