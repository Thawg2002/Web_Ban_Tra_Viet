import { Router } from "express";
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlogBySlug,
  updateBlog,
} from "../controllers/blogController";

const router = Router();
router.post("/blogs", createBlog);

// Lấy tất cả bài viết
router.get("/blogs", getAllBlogs);

// Lấy một bài viết theo slug
router.get("/blogs/:slug", getBlogBySlug);

// Cập nhật bài viết theo slug
router.put("/blogs/:slug", updateBlog);

// Xóa bài viết theo slug
router.delete("/blogs/:slug", deleteBlog);
export default router;
