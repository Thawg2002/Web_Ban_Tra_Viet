
import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import slugify from "slugify";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      lowercase: true,
    },
    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    slug: {
      type: String,
      unique: true,
    },
    regular_price: {
      type: Number,
      required: true,
      default: 0,
    },
    image: {
      type: String,
    },
    gallery: {
      type: Array,
    },
    description: {
      type: String,
    },
    countInStock: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0, 
    },
    featured: {
      type: Boolean,
      default: false,
    },
    attributes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Attribute",
      },
    ],
    seller: {
      type: Number,
      default: 0,
    },
  },

  { timestamps: true, versionKey: false }
);

// Middleware để tự động tạo slug từ name trước khi lưu
productSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  if (this.isModified("regular_price") || this.isModified("discount")) {
    this.sale_price =
      this.regular_price - this.regular_price * (this.discount / 100);
  }
  next();
});

productSchema.plugin(mongoosePaginate);

export default mongoose.model("Product", productSchema);
