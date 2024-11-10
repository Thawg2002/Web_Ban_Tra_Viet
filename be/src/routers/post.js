import { Router } from "express";

import {
  createPost,
  deletePost,
  getAllPosts,
  getPostBySlug,
  updatePost,
} from "../controllers/post";
const router = Router();
router.post("/posts", createPost);
// Lấy tất cả bài viết
router.get("/posts", getAllPosts);
// Lấy một bài viết theo slug
router.get("/posts/:slug", getPostBySlug);
// Cập nhật bài viết theo slug
router.put("/posts/:slug", updatePost);
// Xóa bài viết theo slug
router.delete("/posts/:slug", deletePost);
export default router;
