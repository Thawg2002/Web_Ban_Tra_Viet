import FroalaEditor from "@/common/Froala";
import useDebounce from "@/common/hooks/shared";
import { cn, uploadFileCloudinary } from "@/common/lib/utils";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
// import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import instance from "@/configs/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, message } from "antd";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
    AiOutlineCloudUpload,
    AiOutlineLoading3Quarters,
} from "react-icons/ai";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link, useNavigate, useParams } from "react-router-dom";

import { z } from "zod";
const BlogEdit = () => {
    const [statusLoading, setStatusLoading] = useState({
        isSubmitted: false,
        isLoading: false,
    });
    const [messageApi, contextHolder] = message.useMessage();
    const { id } = useParams();
    const [previewUrl, setPreviewUrl] = useState("");
    const [content, setContent] = useState("");
    const navigate = useNavigate();
    const formSchema = z.object({
        title: z.string({
            required_error: "Tiêu đề bài viết là bắt buộc",
            invalid_type_error: "Tiêu đề bài viết là một chuỗi",
        }),
        content: z.string({
            required_error: "Nội dung bài viết là bắt buộc",
            invalid_type_error: "Nội dung bài viết là một chuỗi",
        }),
        thumbnail_url: z.string({ required_error: "Ảnh thu nhỏ là bắt buộc" }),
    });
    // console.log("previewUrl", previewUrl);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });
    console.log("content", content);
    const handleFetchBlog = async (id: string) => {
        try {
            const { data } = await instance.get(`/blogs/${id}`);
            form.reset(data?.existingBlog);
            setPreviewUrl(data?.existingBlog?.thumbnail_url);
            setContent(data?.existingBlog?.content);
            console.log("data", data);
            return data;
        } catch (error) {}
    };
    useEffect(() => {
        handleFetchBlog(id as string);
    }, []);
    const handleUploadFile = async (file: File) => {
        try {
            const response = await uploadFileCloudinary(file);
            if (response?.url) {
                return response.url;
            } else {
                throw new Error("Upload failed");
            }
        } catch (error) {
            console.error("Upload failed:", error);
            form.setError("thumbnail_url", {
                type: "manual",
                message: "Upload ảnh thất bại, vui lòng thử lại.",
            });
            return null;
        }
    };
    const handleFileChange = async (event: any) => {
        const file = event.target.files[0];
        if (!file) return;

        const preview = URL.createObjectURL(file);
        setPreviewUrl(preview);

        const uploadedUrl = await handleUploadFile(file);
        if (uploadedUrl) {
            form.setValue("thumbnail_url", uploadedUrl);
            form.clearErrors("thumbnail_url");
        }

        URL.revokeObjectURL(preview);
    };
    const debouncedChangeHandler = useDebounce(() => {
        // handleAutoSave();
    }, 1000);
    console.log("id edit", id);
    const handleEditBlog = async (data: any) => {
        try {
            const response = await instance.put(`/blogs/${id}`, data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            return response.data;
        } catch (error) {
            console.log(error);
        }
    };
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const payload = {
                ...values,
            };
            await handleEditBlog(payload);
            navigate("/admin/blog");
            messageApi.success("Tạo bài viết thành công!");
        } catch (error) {
            console.log(error);
            messageApi.error("Tạo bài viết thất bại?");
        }
    };
    return (
        <div className="">
            {contextHolder}
            <div className="mb-3 flex justify-end">
                <Link to="/admin/blogs">
                    <Button className="">
                        {" "}
                        <IoMdArrowRoundBack size={20} className="pr-1" />
                        Quay lại
                    </Button>
                </Link>
            </div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col items-start gap-5"
                >
                    <div className="relative w-full">
                        <div className="w-full">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="">
                                                <Input
                                                    placeholder="Tiêu đề"
                                                    {...field}
                                                    onChange={(event) =>
                                                        field.onChange(() => {
                                                            const title = (
                                                                event.target as HTMLInputElement
                                                            ).value;
                                                            document.title =
                                                                title;
                                                            form.clearErrors(
                                                                "title",
                                                            ),
                                                                (title == "" ||
                                                                    title ==
                                                                        null) &&
                                                                    form.setError(
                                                                        "title",
                                                                        {
                                                                            type: "custom",
                                                                            message:
                                                                                "Tiêu đề nội dung là bắt buộc",
                                                                        },
                                                                    );

                                                            form.setValue(
                                                                "title",
                                                                title,
                                                            ),
                                                                debouncedChangeHandler();
                                                        })
                                                    }
                                                    className="bg-transparent py-5 border-none outline-none focus-visible:ring-0 text-2xl font-semibold text-black"
                                                />
                                            </div>
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div
                            className={cn(
                                "absolute  top-1/2 -translate-y-1/2 right-5   text-sm text-gray-300",
                                !statusLoading.isSubmitted && "hidden",
                            )}
                        >
                            <span
                                className={cn(
                                    "flex items-center justify-center gap-1",
                                    !statusLoading.isLoading && "hidden",
                                )}
                            >
                                Đang lưu
                                <span className="">
                                    <AiOutlineLoading3Quarters className="animate-spin" />
                                </span>
                            </span>
                            <span
                                className={cn(
                                    statusLoading.isLoading && "hidden",
                                )}
                            >
                                Đã lưu
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-start gap-5 w-full">
                        <div className="w-full order-2 md:order-none">
                            <FroalaEditor
                                content={content}
                                onChangeContext={(value) => {
                                    debouncedChangeHandler();
                                    setContent(value);
                                    form.setValue("content", value);
                                    form.clearErrors("content");
                                    if (value == "" || value == null) {
                                        form.setError("content", {
                                            type: "custom",
                                            message:
                                                "Nội dung bài viết là bắt buộc",
                                        });
                                    }
                                }}
                            />
                            {/*  */}
                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Textarea
                                                defaultValue={content}
                                                {...field}
                                                className="hidden"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex flex-col space-y-5 order-1 md:order-none w-full min-w-72 md:max-w-72 *:rounded-xl">
                            <div className="w-full  order-1 md:order-none box-shadow">
                                <div className=" bg-white box-shadow  rounded-lg ">
                                    <div className="flex items-center justify-end px-5 py-3">
                                        <button
                                            type="submit"
                                            className="py-2 text-white px-5 rounded-md bg-blue-500 hover:bg-blue-500/80"
                                        >
                                            Cập nhật
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full  order-1 md:order-none box-shadow">
                                <div
                                    className={cn(
                                        "bg-white box-shadow  rounded-lg",
                                    )}
                                ></div>
                            </div>
                            <div className="w-full  order-1 md:order-none box-shadow">
                                <div className=" bg-white box-shadow  rounded-lg ">
                                    <FormField
                                        control={form.control}
                                        name="thumbnail_url"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-wrap  items-center ">
                                                <FormControl>
                                                    <Accordion
                                                        type="single"
                                                        collapsible
                                                        className="w-full"
                                                    >
                                                        <AccordionItem
                                                            value="item-1"
                                                            className="border-none"
                                                        >
                                                            <AccordionTrigger className="pt-0 px-5 py-3 border-none">
                                                                <FormLabel>
                                                                    Hình ảnh thu
                                                                    nhỏ
                                                                </FormLabel>
                                                            </AccordionTrigger>
                                                            <AccordionContent className="px-5">
                                                                <div className="w-full">
                                                                    <label
                                                                        htmlFor="file-upload"
                                                                        className={cn(
                                                                            "w-full relative cursor-pointer rounded-lg p-6",
                                                                            !previewUrl &&
                                                                                "flex flex-col justify-center items-center",
                                                                        )}
                                                                    >
                                                                        {!previewUrl ? (
                                                                            <>
                                                                                <AiOutlineCloudUpload
                                                                                    size={
                                                                                        50
                                                                                    }
                                                                                    strokeWidth={
                                                                                        1
                                                                                    }
                                                                                />
                                                                                <h3 className="mt-2 text-sm font-medium text-gray-900">
                                                                                    Chọn
                                                                                    ảnh
                                                                                </h3>
                                                                                <p className="mt-1 text-xs text-gray-500">
                                                                                    PNG,
                                                                                    JPG,
                                                                                    GIF
                                                                                </p>
                                                                            </>
                                                                        ) : (
                                                                            <img
                                                                                src={
                                                                                    previewUrl
                                                                                }
                                                                                className="w-full relative max-h-[180px] object-cover"
                                                                                alt="Preview"
                                                                            />
                                                                        )}
                                                                    </label>
                                                                    <input
                                                                        type="file"
                                                                        id="file-upload"
                                                                        onChange={
                                                                            handleFileChange
                                                                        }
                                                                        hidden
                                                                    />
                                                                    <FormMessage />
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default BlogEdit;
