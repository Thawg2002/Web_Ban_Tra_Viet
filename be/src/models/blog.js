import mongoose from "mongoose";
import slugify from "slugify";

// Định nghĩa Schema cho các đoạn văn
const paragraphSchema = new mongoose.Schema({
  paragraph: { type: String, required: true },
});

// Định nghĩa Schema cho nội dung
const contentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  paragraphs: [paragraphSchema],
});

// Định nghĩa Schema cho các thành viên trong đội ngũ
const teamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  quote: { type: String },

  gallery: {
    type: Array,
  }, // Đường dẫn URL của hình ảnh
});

// Định nghĩa Schema cho About
const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true, // Tiêu đề phải là duy nhất
    },
    slug: {
      type: String,
      unique: true, // Slug phải là duy nhất
      lowercase: true, // Chuyển slug thành chữ thường
    },
    introduction: {
      heading: { type: String, required: true },
      paragraphs: [paragraphSchema], // Mảng các đoạn văn trong phần giới thiệu
    },
    image: {
      type: Array,
    },
    mission: {
      heading: { type: String, required: true },
      title: { type: String, required: true },
      content: [contentSchema], // Mảng các nội dung trong phần mission
    },
    team: [teamMemberSchema], // Mảng các thành viên trong đội ngũ
  },
  {
    timestamps: true,
    versionKey: false, // Thêm các trường createdAt và updatedAt tự động
  }
);

// Middleware để tự động tạo slug từ title trước khi lưu
blogSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

// Tạo model từ schema
const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
