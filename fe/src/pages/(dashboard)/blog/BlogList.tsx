import { Button } from "@/components/ui/button";
import instance from "@/configs/axios";
import { message } from "antd";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { Link } from "react-router-dom";
export interface IBlog {
    _id?: string;
    title: string;
    content: string;
    isDeleted: string;
    createdAt: string;
    thumbnail_url?: string;
    meta_description: string;
}
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

const BlogList = () => {
    const [messageApi, contextHolder] = message.useMessage();

    const [blogs, setBlogs] = useState<IBlog[]>([]);
    const handleGetBlogs = async () => {
        try {
            const { data } = await instance.get(`/blogs`);

            setBlogs(data);
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
            const confirm = window.confirm(
                "Bạn có muốn xóa bài viết này không?",
            );
            if (confirm) {
                await instance.delete(`/blogs/${id}`);
                setBlogs(blogs.filter((blog) => blog._id !== id));
                messageApi.success("Xóa  thành công!");
            }
        } catch (error) {
            console.log(error);
            messageApi.error("Xóa không thành công!");
        }
    };
    return (
        <>
            <div className="padding">
                {contextHolder}
                <div className="flex justify-between items-center pb-7">
                    <h2 className="text-2xl font-medium ">
                        Danh sách bài viết
                    </h2>
                    <Link to="/admin/blog/add">
                        <Button className="">Tạo bài viết</Button>
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogs &&
                        blogs?.map((item: any, index: number) => (
                            <div className="">
                                <Link to={`/admin/blog/${item?._id}`}>
                                    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                                        <img
                                            src={item?.thumbnail_url}
                                            alt={item?.meta_title}
                                            className="w-full h-[300px] object-cover"
                                        />
                                    </div>{" "}
                                </Link>

                                <div className="p-4">
                                    <Link to={`/admin/blog/${item?._id}`}>
                                        <h3 className="text-lg font-bold">
                                            {item?.meta_title}
                                        </h3>
                                        <p className="text-sm font-normal text-gray-600">
                                            {format(
                                                item?.createdAt || "",
                                                "dd.MM.yyyy",
                                            )}
                                        </p>
                                        <p className="text-gray-600 font-medium mt-2">
                                            {item?.meta_description}
                                        </p>
                                    </Link>
                                    <div className="w-full flex gap-3 justify-end">
                                        <button
                                            onClick={() =>
                                                handleRemoveBlog(item?._id)
                                            }
                                            className="border border-red-600 p-1 rounded-full "
                                        >
                                            <MdOutlineDeleteOutline
                                                color="red"
                                                size={18}
                                            />
                                        </button>

                                        <Link
                                            to={`/admin/blog/edit/${item?._id}`}
                                            className="border border-gray-500 p-1 rounded-full "
                                        >
                                            <FaRegEdit color="" size={16} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </>
    );
};

export default BlogList;
