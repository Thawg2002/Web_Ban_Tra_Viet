import instance from '@/configs/axios';




// Kiểu dữ liệu cho Blog
export interface Blog {
    mission: any;
    introduction: any;
    introduction: any;
    team: any;
    _id?: string;
    title: string;
    slug?: string;
    content: string;
    description: string;
    author: string;
    authorImage?: string;
    image?: string;
    category: string;
    createdAt?: string;
}

// Lấy tất cả các blog
export const fetchBlogs = async (): Promise<Blog[]> => {
    const response = await instance.get(`/blogs`);
    return response.data;
};

// Lấy blog theo slug
export const fetchBlogBySlug = async (slug: string): Promise<Blog> => {
    const response = await instance.get(`/blogs/${slug}`);
    return response.data;
};

// Tạo mới blog
export const createBlog = async (newBlog: Blog): Promise<Blog> => {
    const response = await instance.post(`/blogs`, newBlog);
    return response.data;
};

// Cập nhật blog
export const updateBlog = async (slug: string, updatedBlog: Blog): Promise<Blog> => {
    const response = await instance.put(`/blogs/${slug}`, updatedBlog);
    return response.data;
};

// Xóa blog
export const deleteBlog = async (slug: string): Promise<void> => {
    await instance.delete(`/blogs/${slug}`);
};
