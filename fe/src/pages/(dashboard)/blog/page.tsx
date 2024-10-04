import React, { useState } from "react";
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    Upload,
    message,
    Space,
    Popconfirm,
    Spin,
    Alert,
} from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UploadOutlined } from "@ant-design/icons";
import instance from "@/configs/axios";
import { Blog } from "@/services/blogApi";
import axios from "axios";

const fetchBlogs = async () => {
    const { data } = await instance.get("/blogs");
    return data;
};
const CLOUDINARY_UPLOAD_PRESET = "Xuong_React_Node_SU24";
const CLOUDINARY_FOLDER = "Xuong_React_Nodejs_SU24";
const CLOUDINARY_NAME = "dtbgv9jja";

const BlogList = () => {
    const [images, setImages] = useState<string[]>([]); // Updated state for multiple images
    const queryClient = useQueryClient();

    const { data, isLoading, isError } = useQuery({
        queryKey: ["blogs"],
        queryFn: fetchBlogs,
    });

    const addBlogMutation = useMutation({
        mutationFn: (newBlog) => instance.post("/blogs", newBlog),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blogs"] });
            message.success("Thêm bài viết thành công!!!");
        },
    });

    const updateBlogMutation = useMutation({
        mutationFn: (updatedBlog) =>
            instance.put(`/blogs/${updatedBlog.slug}`, updatedBlog),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blogs"] });
            message.success("Cập nhật bài viết thành công!");
        },
    });

    const deleteBlogMutation = useMutation({
        mutationFn: (id) => instance.delete(`/blogs/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blogs"] });
            message.success("Xóa bài viết thành công!");
        },
    });

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingBlog, setEditingBlog] = useState(null);

    const handleAddBlog = () => {
        form.validateFields().then((values) => {
            const blogData = {
                ...values,
                image: images, // Save multiple image URLs into blog data
            };

            if (editingBlog) {
                updateBlogMutation.mutate({ ...editingBlog, ...blogData });
            } else {
                addBlogMutation.mutate(blogData);
            }

            form.resetFields();
            setIsModalVisible(false);
            setImages([]); // Reset images after submission
        });
    };

    const handleEdit = (blog) => {
        setEditingBlog(blog);
        form.setFieldsValue(blog);
        setIsModalVisible(true);
        setImages(blog.image || []); // Set existing images for editing
    };

    const uploadFileCloudinary = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
        formData.append("folder", CLOUDINARY_FOLDER);

        try {
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_NAME}/image/upload`,
                formData,
            );

            if (response.status === 200) {
                message.success("Upload thành công!");
                return response.data.secure_url;
            } else {
                message.error("Upload thất bại");
            }
        } catch (error) {
            message.error("Upload thất bại");
            console.error(error);
        }
    };

    const handleUploadChange = async ({ file }) => {
        const uploadedImageUrl = await uploadFileCloudinary(file);
        if (uploadedImageUrl) {
            setImages((prevImages) => [...prevImages, uploadedImageUrl]); // Append the new image URL
        }
    };

    // Function to handle removing an image from the list
    const handleRemoveImage = (imgUrl) => {
        setImages((prevImages) => prevImages.filter((img) => img !== imgUrl));
    };
    const columns = [
        { title: "Title", dataIndex: "title", key: "title" },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: Blog) => (
                <Space size="middle">
                    <Button onClick={() => handleEdit(record)}>Sửa</Button>
                    <Popconfirm
                        title="Are you sure to delete this blog?"
                        onConfirm={() => deleteBlogMutation.mutate(record.slug)}
                    >
                        <Button type="link" danger>
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    if (isLoading) return <Spin tip="Đang tải bài viết..." />;
    if (isError)
        return (
            <Alert message="Lỗi" description={isError} type="error" showIcon />
        );

    return (
        <div>
            <Button
                type="primary"
                className="bg-blue-600"
                onClick={() => {
                    setIsModalVisible(true);
                    form.resetFields();
                    setEditingBlog(null);
                    setImages([]); // Reset images for new blog
                }}
            >
                Thêm bài viết
            </Button>

            <Table className="mt-5" dataSource={data} columns={columns} />

            <Modal
                title={editingBlog ? "Cập nhật bài viết" : "Thêm bài viết"}
                open={isModalVisible}
                onOk={handleAddBlog}
                onCancel={() => {
                    setIsModalVisible(false);
                    setEditingBlog(null);
                }}
                width={800}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Tiêu đề"
                        name="title"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tiêu đề!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item label="Upload Ảnh">
                        <Upload
                            name="images"
                            listType="picture-card"
                            fileList={images.map((url) => ({
                                uid: url, // Unique identifier
                                name: url.split("/").pop(), // Display the name of the image
                                url,
                                status: "done",
                            }))}
                            multiple
                            customRequest={({ file, onSuccess }) => {
                                handleUploadChange({ file });
                                setTimeout(() => {
                                    onSuccess("ok");
                                }, 0);
                            }}
                            onRemove={(file) => handleRemoveImage(file.url)} // Handle removing images
                        >
                            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                        </Upload>
                    </Form.Item>
                    {images.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap" }}>
                            {images.map((imgUrl, index) => (
                                <img
                                    key={index}
                                    src={imgUrl}
                                    alt={`Uploaded ${index + 1}`}
                                    style={{
                                        width: "200px",
                                        marginRight: "10px",
                                        marginBottom: "10px",
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    {/* Multiple image upload (gallery) */}

                    {/* Phần giới thiệu */}
                    <Form.Item
                        label="Tiêu đề phần giới thiệu"
                        name={["introduction", "heading"]}
                        rules={[
                            {
                                required: true,
                                message:
                                    "Vui lòng nhập tiêu đề phần giới thiệu!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.List name={["introduction", "paragraphs"]}>
                        {(fields, { add, remove }) => (
                            <>
                                <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    block
                                >
                                    Thêm đoạn văn giới thiệu
                                </Button>
                                {fields.map((field, index) => (
                                    <Space
                                        key={field.key}
                                        style={{
                                            display: "flex",
                                            marginBottom: 8,
                                        }}
                                        align="start"
                                    >
                                        <Form.Item
                                            {...field}
                                            name={[field.name, "paragraph"]}
                                            label={`Đoạn văn ${index + 1}`}
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Vui lòng nhập đoạn văn!",
                                                },
                                            ]}
                                        >
                                            <Input.TextArea />
                                        </Form.Item>
                                        <Button
                                            danger
                                            onClick={() => remove(field.name)}
                                        >
                                            Xóa
                                        </Button>
                                    </Space>
                                ))}
                            </>
                        )}
                    </Form.List>

                    {/* Sứ mệnh */}
                    <Form.Item
                        label="Tiêu đề sứ mệnh"
                        name={["mission", "heading"]}
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tiêu đề sứ mệnh!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Tiêu đề chính của sứ mệnh"
                        name={["mission", "title"]}
                        rules={[
                            {
                                required: true,
                                message:
                                    "Vui lòng nhập tiêu đề chính của sứ mệnh!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.List name={["mission", "content"]}>
                        {(fields, { add, remove }) => (
                            <>
                                <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    block
                                >
                                    Thêm nội dung sứ mệnh
                                </Button>
                                {fields.map((field, index) => (
                                    <Space
                                        key={field.key}
                                        style={{
                                            display: "flex",
                                            marginBottom: 8,
                                        }}
                                        align="start"
                                    >
                                        <Form.Item
                                            {...field}
                                            name={[field.name, "title"]}
                                            label={`Tiêu đề nội dung ${index + 1}`}
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Vui lòng nhập tiêu đề nội dung!",
                                                },
                                            ]}
                                        >
                                            <Input />
                                        </Form.Item>

                                        <Form.List
                                            name={[field.name, "paragraphs"]}
                                        >
                                            {(
                                                subFields,
                                                {
                                                    add: addSub,
                                                    remove: removeSub,
                                                },
                                            ) => (
                                                <>
                                                    <Button
                                                        type="dashed"
                                                        onClick={() => addSub()}
                                                        block
                                                    >
                                                        Thêm đoạn văn
                                                    </Button>
                                                    {subFields.map(
                                                        (
                                                            subField,
                                                            subIndex,
                                                        ) => (
                                                            <Space
                                                                key={
                                                                    subField.key
                                                                }
                                                                style={{
                                                                    display:
                                                                        "flex",
                                                                    marginBottom: 8,
                                                                }}
                                                                align="start"
                                                            >
                                                                <Form.Item
                                                                    {...subField}
                                                                    name={[
                                                                        subField.name,
                                                                        "paragraph",
                                                                    ]}
                                                                    label={`Đoạn văn ${subIndex + 1}`}
                                                                    rules={[
                                                                        {
                                                                            required:
                                                                                true,
                                                                            message:
                                                                                "Vui lòng nhập đoạn văn!",
                                                                        },
                                                                    ]}
                                                                >
                                                                    <Input.TextArea />
                                                                </Form.Item>
                                                                <Button
                                                                    danger
                                                                    onClick={() =>
                                                                        removeSub(
                                                                            subField.name,
                                                                        )
                                                                    }
                                                                >
                                                                    Xóa
                                                                </Button>
                                                            </Space>
                                                        ),
                                                    )}
                                                </>
                                            )}
                                        </Form.List>
                                        <Button
                                            danger
                                            onClick={() => remove(field.name)}
                                        >
                                            Xóa nội dung
                                        </Button>
                                    </Space>
                                ))}
                            </>
                        )}
                    </Form.List>
                    {/* Thành viên trong đội ngũ */}
                    <Form.List name="team">
                        {(fields, { add, remove }) => (
                            <>
                                <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    block
                                >
                                    Thêm thành viên đội ngũ
                                </Button>
                                {fields.map((field, index) => (
                                    <Space
                                        key={field.key}
                                        style={{
                                            display: "flex",
                                            marginBottom: 8,
                                        }}
                                        align="start"
                                    >
                                        {/* Tên thành viên */}
                                        <Form.Item
                                            {...field}
                                            name={[field.name, "name"]}
                                            label="Tên thành viên"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Vui lòng nhập tên thành viên!",
                                                },
                                            ]}
                                        >
                                            <Input />
                                        </Form.Item>

                                        {/* Chức vụ */}
                                        <Form.Item
                                            {...field}
                                            name={[field.name, "title"]}
                                            label="Chức vụ"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Vui lòng nhập chức vụ!",
                                                },
                                            ]}
                                        >
                                            <Input />
                                        </Form.Item>

                                        {/* Câu nói trích dẫn */}
                                        <Form.Item
                                            {...field}
                                            name={[field.name, "quote"]}
                                            label="Câu nói trích dẫn"
                                        >
                                            <Input.TextArea />
                                        </Form.Item>

                                        {/* Upload ảnh */}
                                        <Form.Item
                                            {...field}
                                            name={[field.name, "gallery"]}
                                            label="Thư viện ảnh"
                                        >
                                            <Upload
                                                name="file"
                                                listType="picture"
                                                maxCount={1}
                                                customRequest={async ({
                                                    file,
                                                    onSuccess,
                                                }) => {
                                                    const uploadedImageUrl =
                                                        await uploadFileCloudinary(
                                                            file,
                                                        );
                                                    form.setFieldsValue({
                                                        team: form
                                                            .getFieldValue(
                                                                "team",
                                                            )
                                                            .map(
                                                                (
                                                                    member: any,
                                                                    idx: number,
                                                                ) => {
                                                                    if (
                                                                        idx ===
                                                                        index
                                                                    ) {
                                                                        return {
                                                                            ...member,
                                                                            gallery:
                                                                                uploadedImageUrl, // Save uploaded image URL to gallery field
                                                                        };
                                                                    }
                                                                    return member;
                                                                },
                                                            ),
                                                    });
                                                    setTimeout(() => {
                                                        onSuccess("ok");
                                                    }, 0);
                                                }}
                                            >
                                                <Button
                                                    icon={<UploadOutlined />}
                                                >
                                                    Chọn ảnh
                                                </Button>
                                            </Upload>
                                            {form.getFieldValue([
                                                "team",
                                                index,
                                                "gallery",
                                            ]) && (
                                                <img
                                                    src={form.getFieldValue([
                                                        "team",
                                                        index,
                                                        "gallery",
                                                    ])}
                                                    alt={`Gallery item ${index}`}
                                                    style={{
                                                        width: "100%",
                                                        height: "auto",
                                                    }}
                                                />
                                            )}
                                        </Form.Item>

                                        {/* Xóa thành viên */}
                                        <Button
                                            danger
                                            onClick={() => remove(field.name)}
                                        >
                                            Xóa thành viên
                                        </Button>
                                    </Space>
                                ))}
                            </>
                        )}
                    </Form.List>
                </Form>
            </Modal>
        </div>
    );
};

export default BlogList;
