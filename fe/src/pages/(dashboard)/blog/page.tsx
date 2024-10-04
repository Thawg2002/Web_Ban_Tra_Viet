// import React from "react";
// import { Table, Button, Space, Popconfirm } from "antd";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// import { Link } from "react-router-dom";
// import { Blog, deleteBlog, fetchBlogs } from "@/services/blogApi";

// const BlogList: React.FC = () => {
//     const queryClient = useQueryClient();

//     // Lấy danh sách blog
//     const { data: blogs, isLoading } = useQuery({
//         queryKey: ["blogs"],
//         queryFn: fetchBlogs,
//     });

//     // Xóa blog
//     const deleteMutation = useMutation({
//         mutationFn: (slug: string) => deleteBlog(slug),
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ["blogs"] }); // Làm mới danh sách sau khi xóa
//         },
//     });

//     const columns = [
//         {
//             title: "Title",
//             dataIndex: "title",
//             key: "title",
//         },
//         {
//             title: "Author",
//             dataIndex: "author",
//             key: "author",
//         },
//         {
//             title: "Actions",
//             key: "actions",
//             render: (_: any, record: Blog) => (
//                 <Space size="middle">
//                     <Link to={`/admin/blog/edit/${record.slug}`}>Edit</Link>
//                     <Popconfirm
//                         title="Are you sure to delete this blog?"
//                         onConfirm={() => deleteMutation.mutate(record.slug!)}
//                     >
//                         <Button type="link" danger>
//                             Delete
//                         </Button>
//                     </Popconfirm>
//                 </Space>
//             ),
//         },
//     ];

//     if (isLoading) {
//         return <p>Loading...</p>;
//     }

//     return (
//         <>
//             <Link to={`/admin/blog/create`}>
//                 <Button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded shadow-lg transform transition-all duration-200 hover:scale-105">
//                     Thêm bài viết
//                 </Button>
//             </Link>
//             <Table dataSource={blogs} columns={columns} rowKey="slug" />
//         </>
//     );
// };

// export default BlogList;
// import React, { useState } from "react";
// import {
//     Table,
//     Button,
//     Modal,
//     Form,
//     Input,
//     message,
//     Space,
//     Popconfirm,
// } from "antd";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import axios from "axios";
// import instance from "@/configs/axios";
// import { Blog, createBlog } from "@/services/blogApi";
// import { Link } from "react-router-dom";

// const fetchBlogs = async () => {
//     const { data } = await instance.get("/blogs");
//     return data;
// };

// const BlogList = () => {
//     const queryClient = useQueryClient();

//     // Fetch blogs using useQuery
//     const { data, isLoading, isError } = useQuery({
//         queryKey: ["blogs"], // use an array as the query key
//         queryFn: fetchBlogs,
//     });

//     // Add blog mutation (React Query v5 object form)
//     const addBlogMutation = useMutation({
//         mutationFn: (newBlog) => instance.post("/blogs", newBlog),
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ["blogs"] });
//             message.success("Blog added successfully!");
//         },
//     });

//     // Delete blog mutation (React Query v5 object form)
//     const deleteBlogMutation = useMutation({
//         mutationFn: (id) => instance.delete(`/blogs/${id}`),
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ["blogs"] });
//             message.success("Blog deleted successfully!");
//         },
//     });

//     const [isModalVisible, setIsModalVisible] = useState(false);
//     const [form] = Form.useForm();

//     const handleAddBlog = () => {
//         form.validateFields().then((values) => {
//             addBlogMutation.mutate(values);
//             form.resetFields();
//             setIsModalVisible(false);
//         });
//     };

//     const handleDelete = (id) => {
//         deleteBlogMutation.mutate(id);
//     };
//     const columns = [
//         { title: "Title", dataIndex: "title", key: "title" },
//         { title: "Slug", dataIndex: "slug", key: "slug" },
//         {
//             title: "Actions",
//             key: "actions",
//             render: (_: any, record: Blog) => (
//                 <Space size="middle">
//                     <Link to={`/admin/blog/edit/${record.slug}`}>Edit</Link>
//                     <Popconfirm
//                         title="Are you sure to delete this blog?"
//                         onConfirm={() =>
//                             deleteBlogMutation.mutate(record.slug!)
//                         }
//                     >
//                         <Button type="link" danger>
//                             Delete
//                         </Button>
//                     </Popconfirm>
//                 </Space>
//             ),
//         },
//     ];
//     if (isLoading) return <div>Loading...</div>;
//     if (isError) return <div>Error loading blogs...</div>;

//     return (
//         <div>
//             <Button type="primary" onClick={() => setIsModalVisible(true)}>
//                 Add Blog
//             </Button>

//             <Table dataSource={data} columns={columns} />

//             <Modal
//                 title="Add New Blog"
//                 open={isModalVisible}
//                 onOk={handleAddBlog}
//                 onCancel={() => setIsModalVisible(false)}
//                 width={800} // Expand modal width for more fields
//             >
//                 <Form form={form} layout="vertical">

//                     <Form.Item
//                         name="title"
//                         label="Title"
//                         rules={[
//                             {
//                                 required: true,
//                                 message: "Please input the title!",
//                             },
//                         ]}
//                     >
//                         <Input />
//                     </Form.Item>

//                     <Form.Item
//                         name={["introduction", "heading"]}
//                         label="Introduction Heading"
//                         rules={[
//                             {
//                                 required: true,
//                                 message:
//                                     "Please input the introduction heading!",
//                             },
//                         ]}
//                     >
//                         <Input />
//                     </Form.Item>

//                     <Form.List name={["introduction", "paragraphs"]}>
//                         {(fields, { add, remove }) => (
//                             <>
//                                 <Button
//                                     type="dashed"
//                                     onClick={() => add()}
//                                     block
//                                 >
//                                     Add Introduction Paragraph
//                                 </Button>
//                                 {fields.map((field, index) => (
//                                     <Space
//                                         key={field.key}
//                                         style={{
//                                             display: "flex",
//                                             marginBottom: 8,
//                                         }}
//                                         align="start"
//                                     >
//                                         <Form.Item
//                                             {...field}
//                                             name={[field.name, "paragraph"]}
//                                             label={`Paragraph ${index + 1}`}
//                                             rules={[
//                                                 {
//                                                     required: true,
//                                                     message:
//                                                         "Please input the paragraph!",
//                                                 },
//                                             ]}
//                                         >
//                                             <Input.TextArea />
//                                         </Form.Item>
//                                         <Button
//                                             danger
//                                             onClick={() => remove(field.name)}
//                                         >
//                                             Remove
//                                         </Button>
//                                     </Space>
//                                 ))}
//                             </>
//                         )}
//                     </Form.List>

//                     <Form.Item
//                         name={["mission", "heading"]}
//                         label="Mission Heading"
//                         rules={[
//                             {
//                                 required: true,
//                                 message: "Please input the mission heading!",
//                             },
//                         ]}
//                     >
//                         <Input />
//                     </Form.Item>

//                     <Form.Item
//                         name={["mission", "title"]}
//                         label="Mission Title"
//                         rules={[
//                             {
//                                 required: true,
//                                 message: "Please input the mission title!",
//                             },
//                         ]}
//                     >
//                         <Input />
//                     </Form.Item>

//                     <Form.List name={["mission", "content"]}>
//                         {(fields, { add, remove }) => (
//                             <>
//                                 <Button
//                                     type="dashed"
//                                     onClick={() => add()}
//                                     block
//                                 >
//                                     Add Mission Content
//                                 </Button>
//                                 {fields.map((field, index) => (
//                                     <Space
//                                         key={field.key}
//                                         style={{
//                                             display: "flex",
//                                             marginBottom: 8,
//                                         }}
//                                         align="start"
//                                     >
//                                         <Form.Item
//                                             {...field}
//                                             name={[field.name, "title"]}
//                                             label={`Content Title ${index + 1}`}
//                                             rules={[
//                                                 {
//                                                     required: true,
//                                                     message:
//                                                         "Please input the content title!",
//                                                 },
//                                             ]}
//                                         >
//                                             <Input />
//                                         </Form.Item>
//                                         <Form.List
//                                             name={[field.name, "paragraphs"]}
//                                         >
//                                             {(
//                                                 subFields,
//                                                 {
//                                                     add: addSub,
//                                                     remove: removeSub,
//                                                 },
//                                             ) => (
//                                                 <>
//                                                     <Button
//                                                         type="dashed"
//                                                         onClick={() => addSub()}
//                                                         block
//                                                     >
//                                                         Add Content Paragraph
//                                                     </Button>
//                                                     {subFields.map(
//                                                         (
//                                                             subField,
//                                                             subIndex,
//                                                         ) => (
//                                                             <Space
//                                                                 key={
//                                                                     subField.key
//                                                                 }
//                                                                 style={{
//                                                                     display:
//                                                                         "flex",
//                                                                     marginBottom: 8,
//                                                                 }}
//                                                                 align="start"
//                                                             >
//                                                                 <Form.Item
//                                                                     {...subField}
//                                                                     name={[
//                                                                         subField.name,
//                                                                         "paragraph",
//                                                                     ]}
//                                                                     label={`Paragraph ${subIndex + 1}`}
//                                                                     rules={[
//                                                                         {
//                                                                             required:
//                                                                                 true,
//                                                                             message:
//                                                                                 "Please input the paragraph!",
//                                                                         },
//                                                                     ]}
//                                                                 >
//                                                                     <Input.TextArea />
//                                                                 </Form.Item>
//                                                                 <Button
//                                                                     danger
//                                                                     onClick={() =>
//                                                                         removeSub(
//                                                                             subField.name,
//                                                                         )
//                                                                     }
//                                                                 >
//                                                                     Remove
//                                                                 </Button>
//                                                             </Space>
//                                                         ),
//                                                     )}
//                                                 </>
//                                             )}
//                                         </Form.List>
//                                         <Button
//                                             danger
//                                             onClick={() => remove(field.name)}
//                                         >
//                                             Remove
//                                         </Button>
//                                     </Space>
//                                 ))}
//                             </>
//                         )}
//                     </Form.List>

//                     {/* Team Members */}
//                     <Form.List name="team">
//                         {(fields, { add, remove }) => (
//                             <>
//                                 <Button
//                                     type="dashed"
//                                     onClick={() => add()}
//                                     block
//                                 >
//                                     Add Team Member
//                                 </Button>
//                                 {fields.map((field, index) => (
//                                     <Space
//                                         key={field.key}
//                                         style={{
//                                             display: "flex",
//                                             marginBottom: 8,
//                                         }}
//                                         align="start"
//                                     >
//                                         <Form.Item
//                                             {...field}
//                                             name={[field.name, "name"]}
//                                             label={`Team Member Name ${index + 1}`}
//                                             rules={[
//                                                 {
//                                                     required: true,
//                                                     message:
//                                                         "Please input the team member name!",
//                                                 },
//                                             ]}
//                                         >
//                                             <Input />
//                                         </Form.Item>
//                                         <Form.Item
//                                             {...field}
//                                             name={[field.name, "title"]}
//                                             label={`Team Member Title ${index + 1}`}
//                                             rules={[
//                                                 {
//                                                     required: true,
//                                                     message:
//                                                         "Please input the team member title!",
//                                                 },
//                                             ]}
//                                         >
//                                             <Input />
//                                         </Form.Item>
//                                         <Form.Item
//                                             {...field}
//                                             name={[field.name, "quote"]}
//                                             label={`Team Member Quote ${index + 1}`}
//                                         >
//                                             <Input />
//                                         </Form.Item>
//                                         <Form.Item
//                                             {...field}
//                                             name={[field.name, "image"]}
//                                             label={`Team Member Image URL ${index + 1}`}
//                                         >
//                                             <Input />
//                                         </Form.Item>
//                                         <Button
//                                             danger
//                                             onClick={() => remove(field.name)}
//                                         >
//                                             Remove
//                                         </Button>
//                                     </Space>
//                                 ))}
//                             </>
//                         )}
//                     </Form.List>
//                 </Form>
//             </Modal>
//         </div>
//     );
// };

// export default BlogList;
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

const fetchBlogs = async () => {
    const { data } = await instance.get("/blogs");
    return data;
};

const BlogList = () => {
    const queryClient = useQueryClient();

    // Fetch blogs using useQuery
    const { data, isLoading, isError } = useQuery({
        queryKey: ["blogs"],
        queryFn: fetchBlogs,
    });

    // Add blog mutation
    const addBlogMutation = useMutation({
        mutationFn: (newBlog) => instance.post("/blogs", newBlog),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blogs"] });
            message.success("Thêm bài viết thành công!!!");
        },
    });

    // Update blog mutation
    const updateBlogMutation = useMutation({
        mutationFn: (updatedBlog) =>
            instance.put(`/blogs/${updatedBlog.slug}`, updatedBlog),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blogs"] });
            message.success("Cập nhật bài viết thành công!");
        },
    });

    // Delete blog mutation
    const deleteBlogMutation = useMutation({
        mutationFn: (id) => instance.delete(`/blogs/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blogs"] });
            message.success("Xóa bài viết thành công!");
        },
    });

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingBlog, setEditingBlog] = useState(null); // Track which blog is being edited
    const [fileList, setFileList] = useState([]); // State to manage file list

    const handleAddBlog = () => {
        form.validateFields().then((values) => {
            const blogData = {
                ...values,
                image: fileList[0]?.url, // Lưu URL của ảnh vào dữ liệu blog
            };

            if (editingBlog) {
                updateBlogMutation.mutate({ ...editingBlog, ...blogData });
            } else {
                addBlogMutation.mutate(blogData);
            }

            form.resetFields();
            setIsModalVisible(false);
            setFileList([]); // Reset fileList
        });
    };

    const handleEdit = (blog) => {
        setEditingBlog(blog); // Set the blog to be edited
        form.setFieldsValue(blog); // Populate form with blog data
        setIsModalVisible(true); // Open modal
    };

    const handleUploadChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };
    const uploadFileCloudinary = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "your_preset"); // Thay bằng preset của bạn
        formData.append("folder", "blogs"); // Thư mục trên Cloudinary

        const response = await fetch(
            "https://api.cloudinary.com/v1_1/your_cloudinary_name/image/upload",
            {
                method: "POST",
                body: formData,
            },
        );

        const data = await response.json();
        return data;
    };
    // normFile để chuyển file event thành định dạng phù hợp với form
    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
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
                    form.resetFields(); // Reset form for adding new blog
                    setEditingBlog(null); // Clear editing state
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
                    setEditingBlog(null); // Reset editing state on cancel
                }}
                width={800}
            >
                <Form form={form} layout="vertical">
                    {/* Tiêu đề */}
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

                    {/* Phần upload ảnh */}
                    <Form.Item
                        label="Tải ảnh lên"
                        name="image"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                    >
                        <Upload
                            name="image"
                            listType="picture"
                            customRequest={async ({
                                file,
                                onSuccess,
                                onError,
                            }) => {
                                try {
                                    const result =
                                        await uploadFileCloudinary(file); // Gọi hàm upload ảnh
                                    setFileList([
                                        {
                                            uid: file.uid,
                                            name: file.name,
                                            status: "done",
                                            url: result.url, // URL của ảnh sau khi upload thành công
                                        },
                                    ]);
                                    onSuccess?.(result.url); // Trả về URL ảnh
                                } catch (error) {
                                    onError?.(error);
                                }
                            }}
                            fileList={fileList}
                            onRemove={() => setFileList([])} // Xóa ảnh khỏi danh sách
                        >
                            <Button icon={<UploadOutlined />}>
                                Tải ảnh lên
                            </Button>
                        </Upload>
                    </Form.Item>

                    {/* Đường dẫn (Slug) */}

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
