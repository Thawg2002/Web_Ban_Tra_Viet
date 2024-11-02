import { useAuth } from "@/common/hooks/useAuth";
import instance from "@/configs/axios";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import {
    Avatar,
    Button,
    DatePicker,
    Form,
    Input,
    InputNumber,
    message,
    Upload,
} from "antd";
import { useEffect, useState } from "react";

const AccountIndex = () => {
    const { authUser, setAuthUser } = useAuth();
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const [imageUrl, setImageUrl] = useState(null);
    console.log("auth", authUser);
    useEffect(() => {
        if (authUser) {
            form.setFieldsValue({
                name: authUser.name,
                email: authUser.email,
            });
            // setImageUrl(authUser?.avatar);
        }
    }, []);
    const { mutate } = useMutation({
        mutationFn: async (data: any) => {
            return await instance.put(`/auth/changeUser/${authUser?._id}`);
        },
        onSuccess: (response) => {
            if (setAuthUser) {
                setAuthUser(response.data);
            }
            messageApi.success("Cập nhật thông tin thành công!");
        },
        onError: (error) => {
            messageApi.error("Cập nhật thông tin thất bại!");
            console.log(error);
        },
    });
    const onFinish = (values: any) => {
        // Handle form submission
        mutate(values);
        console.log("Received values of form: ", values);
    };
    const handleUpload = (info) => {
        if (info.file.status === "done") {
            // Giả sử bạn sử dụng URL trực tiếp của file sau khi upload thành công
            setImageUrl(URL.createObjectURL(info.file.originFileObj));
        }
    };

    // Hàm giới hạn kích thước và định dạng file
    const beforeUpload = (file) => {
        const isJpgOrPng =
            file.type === "image/jpeg" || file.type === "image/png";
        if (!isJpgOrPng) {
            alert("Chỉ hỗ trợ file JPEG và PNG!");
        }
        const isLt1M = file.size / 1024 / 1024 < 1;
        if (!isLt1M) {
            alert("Dung lượng file phải nhỏ hơn 1MB!");
        }
        return isJpgOrPng && isLt1M;
    };

    const formItemLayout = {
        labelCol: {
            xs: { span: 12, align: "center" },
            sm: { span: 6 },
        },
        // wrapperCol: {
        //     xs: { span: 24 },
        //     sm: { span: 14 },
        // },
    };
    return (
        <>
            <div className="px-5">
                <div className="">
                    <h3 className="text-lg font-medium">Hồ Sơ Của Tôi </h3>
                    <span className=" text-gray-500">
                        Quản lý thông tin hồ sơ để bảo mật tài khoản
                    </span>
                </div>
                <div className="mt-10">
                    <Form
                        {...formItemLayout}
                        form={form}
                        name=""
                        onFinish={onFinish}
                        // layout="vertical"
                        initialValues={{ remember: true }}
                        validateTrigger="onSubmit"
                        className=""
                    >
                        <div className="grid grid-cols-12 gap-5">
                            <div className=" col-span-12 lg:col-span-7  ">
                                <Form.Item
                                    name="name"
                                    label={
                                        <label className="text-sm md:text-base text-[#4a90e2] font-medium">
                                            Tên người dùng
                                        </label>
                                    }
                                    rules={[
                                        // {
                                        //     type: "string",
                                        //     message: "Email không hợp lệ!",
                                        // },
                                        {
                                            required: true,
                                            message: "Vui lòng nhập tên!",
                                        },
                                    ]}
                                    className=" "
                                >
                                    <Input className="py-[10px] text-sm md:text-base w-full" />
                                </Form.Item>
                                <Form.Item
                                    name="email"
                                    label={
                                        <label className="text-sm md:text-base text-[#4a90e2] font-medium">
                                            Email
                                        </label>
                                    }
                                    className=" "
                                >
                                    <Input
                                        className="py-[10px] text-sm md:text-base w-full"
                                        disabled
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="phone"
                                    label={
                                        <label className="text-sm md:text-base text-[#4a90e2] font-medium">
                                            Số điện thoại
                                        </label>
                                    }
                                    rules={[
                                        {
                                            type: "number",
                                            message:
                                                "Số điện thoại không hợp lệ!",
                                        },
                                        {
                                            required: true,
                                            message:
                                                "Vui lòng nhập số điện thoại!",
                                        },
                                    ]}
                                    className=" "
                                >
                                    <Input className="py-[10px] text-sm md:text-base w-full" />
                                </Form.Item>
                                <Form.Item
                                    name="birthDay"
                                    label={
                                        <label className="text-sm md:text-base text-[#4a90e2] font-medium">
                                            Ngày sinh
                                        </label>
                                    }
                                    rules={
                                        [
                                            // {
                                            //     type: "email",
                                            //     message: "Email không hợp lệ!",
                                            // },
                                        ]
                                    }
                                    className=" "
                                >
                                    <DatePicker
                                        className="w-full h-12"
                                        format="DD/MM/YYYY"
                                        placeholder="Chọn ngày sinh"
                                    />{" "}
                                </Form.Item>
                            </div>
                            <div className="col-span-12 lg:col-span-5  border-t lg:border-none border-gray-300 py-8 lg:py-0 ">
                                <Form.Item>
                                    <div className="flex flex-col justify-center items-center gap-y-3">
                                        <Avatar
                                            size={128}
                                            icon={<UserOutlined />}
                                            src={imageUrl || authUser?.avatar}
                                            style={{
                                                backgroundColor: "#f5f5f5",
                                                marginBottom: 10,
                                            }}
                                        />
                                        <Upload
                                            name="avatar"
                                            showUploadList={false} // Ẩn danh sách file
                                            beforeUpload={beforeUpload} // Kiểm tra file trước khi upload
                                            onChange={handleUpload} // Gọi hàm khi có sự thay đổi
                                        >
                                            <Button icon={<UploadOutlined />}>
                                                Chọn Ảnh
                                            </Button>
                                        </Upload>
                                        <div className="flex flex-col text-[#999] text-xs md:text-base">
                                            <span className="">
                                                Dụng lượng file tối đa 1 MB
                                            </span>
                                            <span className="">
                                                {" "}
                                                Định dạng:.JPEG, .PNG
                                            </span>
                                        </div>
                                    </div>
                                </Form.Item>{" "}
                            </div>
                        </div>

                        <div className="w-full lg:w-[85%] ml-auto  ">
                            <button className="px-5 py-2 border border-transparent bg-blue-500 text-white rounded hover:bg-white hover:text-blue-500 hover:border-blue-500 duration-300 transition  ">
                                Cập nhật
                            </button>
                        </div>
                    </Form>
                </div>
            </div>
        </>
    );
};

export default AccountIndex;
