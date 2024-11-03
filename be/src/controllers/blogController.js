// // controllers/blogController.js

import Blog from "../models/blog";

// import Blog from "../models/blog";

// // Tạo mới Blog
// export const createBlog = async (req, res) => {
//   try {
//     const blog = new Blog(req.body);
//     await blog.save();
//     res.status(201).send(blog);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// };

// // Lấy tất cả các Blog
// export const getAllBlogs = async (req, res) => {
//   try {
//     const blogs = await Blog.find();
//     res.status(200).send(blogs);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// };

// // Lấy một Blog theo Slug
// export const getBlogBySlug = async (req, res) => {
//   try {
//     const blog = await Blog.findOne({ slug: req.params.slug });
//     if (!blog) {
//       return res.status(404).send();
//     }
//     res.status(200).send(blog);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// };

// // Cập nhật Blog
// export const updateBlog = async (req, res) => {
//   try {
//     const blog = await Blog.findOneAndUpdate(
//       { slug: req.params.slug },
//       req.body,
//       { new: true, runValidators: true }
//     );
//     if (!blog) {
//       return res.status(404).send();
//     }
//     res.status(200).send(blog);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// };

// // Xóa Blog
// export const deleteBlog = async (req, res) => {
//   try {
//     const blog = await Blog.findOneAndDelete({ slug: req.params.slug });
//     if (!blog) {
//       return res.status(404).send();
//     }
//     res.status(200).send(blog);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// };
// Import mô hình About

// Tạo mới hoặc cập nhật About (nếu đã có sẵn)

// Tạo hoặc cập nhật thông tin "About"
export const createBlog = async (req, res) => {
  try {
    const newBlog = new Blog(req.body);
    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Cập nhật Blog (PUT) - Tìm blog bằng `slug`
export const updateBlog = async (req, res) => {
  try {
    const updatedBlog = await Blog.findOneAndUpdate(
      { slug: req.params.slug }, // Tìm blog theo slug
      req.body, // Cập nhật theo dữ liệu từ request body
      {
        new: true, // Trả về bản ghi đã được cập nhật
        runValidators: true, // Kiểm tra tính hợp lệ của dữ liệu
      }
    );
    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json(updatedBlog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Xóa Blog (DELETE) - Tìm blog bằng `slug`
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id)
      return res.status(400).json({
        message: "Bạn chưa chọn bài viết",
      });

    const existingBlog = await Blog.findById(id);
    if (!existingBlog) {
      return res.status(404).json({ message: "Bài viết không tồn tại" });
    }
    await Blog.findByIdAndDelete(id);

    res.status(200).json({ message: "Bạn đã xóa bài viết thành công!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy tất cả các Blog (GET)
export const getAllBlogs = async (req, res) => {
  try {
    const {
      limit = 10 || pageSize,
      page = 1,
      sort = "createAt",
      order = "dessc",
    } = req.query;
    const option = {
      page: page,
      limit,
      sort: { [sort]: order === "desc" ? 1 : -1 },
    };
    const blogs = await Blog.paginate(option); // Lấy tất cả blog
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy một Blog theo `slug` (GET)
export const getBlogDetail = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Bạn chưa chọn bài viết" });
    }
    const existingBlog = await Blog.findById(id);
    if (!existingBlog) {
      return res.status(404).json({ message: "Bài viết không tồn tại" });
    }
    res.status(200).json({
      message: "Lấy bài viết thành công",
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};
export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
