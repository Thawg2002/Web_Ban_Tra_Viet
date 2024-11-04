import mongoose from "mongoose";

const Schema = mongoose.Schema;

const BannerSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    imageBanner: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Banner = mongoose.model("Banner", BannerSchema);

export default Banner;
