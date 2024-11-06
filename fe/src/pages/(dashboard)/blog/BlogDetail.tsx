import instance from "@/configs/axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Remarkable } from "remarkable";
const BlogDetail = () => {
    const [blog, setBlog] = useState<any>();
    const { id } = useParams();
    useEffect(() => {
        (async () => {
            try {
                const { data } = await instance.get(`/blogs/${id}`);
                setBlog(data?.existingBlog);
            } catch (error) {
                console.log(error);
            }
        })();
    }, []);
    const md = new Remarkable({
        html: true, // Cho phép HTML bên trong Markdown
        xhtmlOut: false, // Xuất ra HTML với các tag tự đóng
        breaks: false, // Tự động ngắt dòng thành <br>
        langPrefix: "language-", // Tiền tố cho class của các khối code
        linkify: true, // Tự động chuyển đổi URL thành liên kết
        typographer: true, // Thay thế các ký tự đặc biệt như quotes, dashes thành kiểu typographic
    });
    const markdownContent = blog?.content;
    const htmlContent = md.render(markdownContent as any);
    return (
        <div className="padding">
            <div className=""></div>
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </div>
    );
};

export default BlogDetail;
