import React, { useState } from "react";
import { Form, Input, Button, Upload, message } from "antd";
import { BackwardFilled, FileImageOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { RcFile, UploadProps } from "antd/es/upload";
import axios from "axios";

import { Link, useNavigate } from "react-router-dom";
import instance from "@/configs/axios";
import { Banner } from "@/common/types/banner";

type BannerType = {
    title: string | undefined;
    imageBanner: string;
    description: string;
};

const BannerAddPage: React.FC = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [imageUrl, setImageUrl] = useState<string>("");
    const [, setUploading] = useState<boolean>(false);

    const { mutate } = useMutation<void, Error, BannerType>({
        mutationFn: async (banner: BannerType) => {
            return await instance.post(`/banners`, banner);
        },
        onSuccess: () => {
            message.success("Thêm banner thành công");
            queryClient.invalidateQueries({ queryKey: ["banners"] });
            setTimeout(() => {
                navigate("/admin/banner");
            }, 2000);
            form.resetFields();
            setImageUrl("");
        },
        onError: (error) => {
            message.error(`Lỗi: ${error.message}`);
        },
    });

    const uploadImage = async (file: RcFile): Promise<string> => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "duan_totnghiep");

        try {
            const res = await axios.post(
                "https://api.cloudinary.com/v1_1/duantotnghiep/image/upload",
                formData,
            );
            const imageUrl = res.data.secure_url;

            return imageUrl;
        } catch (error) {
            message.error("Upload ảnh thất bại!");
            throw error;
        }
    };

    const handleUpload: UploadProps["customRequest"] = async ({
        file,
        onSuccess,
        onError,
    }) => {
        setUploading(true);
        try {
            const uploadedUrl = await uploadImage(file as RcFile);
            setImageUrl(uploadedUrl);
            onSuccess && onSuccess("ok");
        } catch (error) {
            onError && onError(error as Error);
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveImage = () => {
        setImageUrl("");
        message.info("Ảnh đã được xóa. Vui lòng upload ảnh mới.");
    };

    const onFinish = async (values: Banner) => {
        if (!imageUrl) {
            message.error("Vui lòng upload ảnh trước khi thêm banner!");
            return;
        }
        const newBanner: BannerType = {
            title: values.title,
            imageBanner: imageUrl,
            description: values.description,
        };
        mutate(newBanner);
    };

    return (
        <>
            <div className="flex items-center justify-between mb-5">
                <h1 className="font-semibold text-2xl">Thêm banner mới</h1>
                <Link to="/admin/banner">
                    <Button
                        className="flex items-center justify-center bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-sm font-medium text-white shadow-md transition duration-300 ease-in-out"
                        type="primary"
                    >
                        <BackwardFilled /> Quay lại
                    </Button>
                </Link>
            </div>
            <div className="max-w-3xl mx-auto max-h-[450px] overflow-y-auto ">
                <Form
                    form={form}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="Tiêu đề"
                        name="title"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tiêu đề",
                            },
                            {
                                min: 3,
                                message: "Tiêu đề phải có ít nhất 5 ký tự",
                            },
                        ]}
                    >
                        <Input
                            className="Input-antd text-sm placeholder-gray-400"
                            placeholder="Nhập tiêu đề"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Ảnh Banner"
                        name="imageBanner"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => e && e.fileList}
                        rules={[
                            { required: true, message: "Vui lòng upload ảnh" },
                        ]}
                    >
                        <Upload
                            name="file"
                            listType="picture-card"
                            customRequest={handleUpload}
                            onRemove={handleRemoveImage}
                            maxCount={1}
                        >
                            <Button icon={<FileImageOutlined />}></Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item label="Mô tả" name="description">
                        <Input.TextArea
                            className="Input-antd text-sm placeholder-gray-400"
                            placeholder="Nhập mô tả"
                            rows={4}
                        />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button className="bg-green-600" type="primary" htmlType="submit">
                            Thêm banner
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </>
    );
};

export default BannerAddPage;
