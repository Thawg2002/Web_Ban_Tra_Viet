import instance from "@/configs/axios";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const BlogIndex = () => {
    const [blogs, setBlogs] = useState<any>([]);
    useEffect(() => {
        (async () => {
            try {
                const { data } = await instance.get(`/blogs`);
                setBlogs(data);
            } catch (error) {
                console.log(error);
            }
        })();
    }, []);
    console.log("blog", blogs);
    return (
        <div>
            <div className="padding mb-20">
                <div className="mt-8 flex justify-between items-center pb-7">
                    <h2 className="text-2xl font-medium ">
                        Danh sách bài viết
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-6">
                    {blogs &&
                        blogs?.map((item: any, index: number) => (
                            <div className="" key={index}>
                                <Link to={`/blog/${item?._id}`}>
                                    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                                        <img
                                            src={item?.thumbnail_url}
                                            alt={item?.meta_title}
                                            className="w-full h-[300px] object-cover"
                                        />
                                    </div>{" "}
                                </Link>

                                <div className="p-4">
                                    <Link to={`/blog/${item?._id}`}>
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
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default BlogIndex;
