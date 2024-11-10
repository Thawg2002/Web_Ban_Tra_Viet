import { Post } from '@/common/types/post';
import instance from '@/configs/axios';

// Kiểu dữ liệu cho Blog


// Lấy tất cả các blog
export const fetchPosts = async (): Promise<Post[]> => {
    const response = await instance.get(`/posts`);
    return response.data;
};

// Lấy blog theo slug
export const fetchPostBySlug = async (slug: string): Promise<Post> => {
    const response = await instance.get(`/posts/${slug}`);
    return response.data;
};

// Tạo mới blog
export const createPost = async (newBlog: Post): Promise<Post> => {
    const response = await instance.post(`/posts`, newBlog);
    return response.data;
};

// Cập nhật blog
export const updatePost = async (slug: string, updatedBlog: Post): Promise<Post> => {
    const response = await instance.put(`/posts/${slug}`, updatedBlog);
    return response.data;
};

// Xóa blog
export const deleteBlog = async (slug: string): Promise<void> => {
    await instance.delete(`/posts/${slug}`);
};
