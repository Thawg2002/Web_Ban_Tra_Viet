import instance from "@/configs/axios";
import { useMutation } from "@tanstack/react-query";
import { message } from "antd";
import { date } from "joi";
import React, { useEffect, useState } from "react";

export interface IBlog {
    _id?: string;
    title: string;
    content: string;
    isDeleted: string;
    createdAt: string;
    thumbnail_url?: string;
    meta_description: string;
}

const BlogList = () => {
    const [messageApi, contextHolder] = message.useMessage();

    const [blogs, setBlogs] = useState<IBlog[]>([]);
    const handleGetBlogs = async () => {
        try {
            const { data } = await instance.get(`/blogs`);
            console.log("bài viết", data);
            return data;
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        handleGetBlogs();
    }, []);
    const handleRemoveBlog = async (id: string) => {
        try {
            await instance.delete(`/blogs/${id}`);
            setBlogs(blogs.filter((blog) => blog._id !== id));
            messageApi.success("Xóa  thành công!");
        } catch (error) {
            console.log(error);
            messageApi.error("Xóa không thành công!");
        }
    };
    return (
        <>
            <div className="">
                <h2>Danh sách bài viết</h2>
            </div>
        </>
    );
};

export default BlogList;
