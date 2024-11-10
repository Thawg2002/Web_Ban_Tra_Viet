import Post from "../models/post";

export const createPost = async (req, res) => {
  try {
    const newPost = new Post(req.body);
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Cập nhật Post (PUT) - Tìm post bằng `slug`
export const updatePost = async (req, res) => {
  try {
    const updatedPost = await Post.findOneAndUpdate(
      { slug: req.params.slug }, // Tìm post theo slug
      req.body, // Cập nhật theo dữ liệu từ request body
      {
        new: true, // Trả về bản ghi đã được cập nhật
        runValidators: true, // Kiểm tra tính hợp lệ của dữ liệu
      }
    );
    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Xóa Post (DELETE) - Tìm post bằng `slug`
export const deletePost = async (req, res) => {
  try {
    const deletedPost = await Post.findOneAndDelete({ slug: req.params.slug });
    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy tất cả các Post (GET)
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find(); // Lấy tất cả post
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy một Post theo `slug` (GET)
export const getPostBySlug = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
