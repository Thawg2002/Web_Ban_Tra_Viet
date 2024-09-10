import { SignupUser } from "@/services/auth";
import { useMutation } from "@tanstack/react-query";
import { Form, Input, message } from "antd";
import { LoaderCircle } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

interface SignupFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const Signup = (props: Props) => {
    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };
    const [messageApi, contextHolder] = message.useMessage();
    // const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm<SignupFormData>({
        mode: "onBlur", // Trigger validation on blur
    });

     const { mutate, isPending, isError, error } = useMutation({
         mutationFn: async (user: SignupFormData) => {
             return await SignupUser(user);
         },
         onSuccess: (response: any) => {
             messageApi.open({
                 type: "success",
                 content: "Đăng ký thành công",
             });
             // Điều hướng người dùng đến trang đăng nhập hoặc trang khác sau khi thành công
         },
         onError: (error: any) => {
             // Xử lý lỗi khi đăng ký thất bại
             if (error.message.includes("email")) {
                 // Nếu API trả về lỗi liên quan đến email đã tồn tại
                 messageApi.open({
                     type: "error",
                     content: "Email đã tồn tại, vui lòng sử dụng email khác",
                 });
             } else {
                 messageApi.open({
                     type: "error",
                     content: "Đăng ký thất bại, vui lòng thử lại",
                 });
             }
         },
     });

    const onSubmit = async (data: SignupFormData) => {
        mutate(data);
    };
    return (
        <>
            {contextHolder}
            <div className="w-full max-w-md bg-white p-6 sm:p-8 shadow-lg">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">
                    Đăng ký
                </h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="username"
                        >
                            Tên tài khoản *
                        </label>
                        <input
                            {...register("name", {
                                required: "Tên tài khoản là bắt buộc",
                            })}
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                errors.name ? "border-red-500" : ""
                            }`}
                            id="username"
                            type="text"
                            placeholder="Nhập tên tài khoản"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-xs mt-2">
                                {errors.name.message}
                            </p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="email"
                        >
                            Địa chỉ email *
                        </label>
                        <input
                            {...register("email", {
                                required: "Email là bắt buộc",
                                pattern: {
                                    value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                                    message: "Email không hợp lệ",
                                },
                            })}
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                errors.email ? "border-red-500" : ""
                            }`}
                            id="email"
                            type="email"
                            placeholder="Nhập địa chỉ email"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-2">
                                {errors.email.message}
                            </p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="password"
                        >
                            Mật khẩu *
                        </label>
                        <div className="relative">
                            <input
                                {...register("password", {
                                    required: "Mật khẩu là bắt buộc",
                                    minLength: {
                                        value: 6,
                                        message:
                                            "Mật khẩu phải có ít nhất 6 ký tự",
                                    },
                                })}
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                    errors.password ? "border-red-500" : ""
                                }`}
                                id="password"
                                type={passwordVisible ? "text" : "password"}
                                placeholder="Nhập mật khẩu"
                            />
                            <span
                                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                                onClick={togglePasswordVisibility}
                            >
                                <svg
                                    className={`h-5 w-5 ${
                                        passwordVisible
                                            ? "text-pink-500"
                                            : "text-gray-500"
                                    }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        d={
                                            passwordVisible
                                                ? "M10 4c3.314 0 6 2.686 6 6s-2.686 6-6 6-6-2.686-6-6 2.686-6 6-6m0-2C5.586 2 2 6.486 2 10s3.586 8 8 8 8-3.486 8-8-3.586-8-8-8zM10 12a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"
                                                : "M10 2C5.586 2 2 6.486 2 10s3.586 8 8 8 8-3.486 8-8-3.586-8-8-8-8zm0 14c-3.243 0-6-3.482-6-6s2.757-6 6-6 6 3.482 6 6-2.757 6-6 6zm0-11c-1.655 0-3 1.345-3 3s1.345 3 3 3 3-1.345 3-3-1.345-3-3-3z"
                                        }
                                    />
                                </svg>
                            </span>
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-2">
                                {errors.password.message}
                            </p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="confirmPassword"
                        >
                            Xác nhận mật khẩu *
                        </label>
                        <input
                            {...register("confirmPassword", {
                                required: "Xác nhận mật khẩu là bắt buộc",
                                validate: (value) =>
                                    value === getValues("password") ||
                                    "Mật khẩu xác nhận không khớp",
                            })}
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                errors.confirmPassword ? "border-red-500" : ""
                            }`}
                            id="confirmPassword"
                            type={passwordVisible ? "text" : "password"}
                            placeholder="Xác nhận mật khẩu"
                        />
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-xs mt-2">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label className="inline-flex items-center">
                            <input
                                type="checkbox"
                                className="form-checkbox text-pink-500"
                            />
                            <span className="ml-2 text-gray-700 text-sm">
                                Ghi nhớ mật khẩu
                            </span>
                        </label>
                    </div>
                    <div className="mb-6">
                        <button
                            className="bg-pink-500 text-white font-bold py-2 px-4 rounded w-full hover:bg-pink-700 focus:outline-none focus:shadow-outline"
                            type="submit"
                        >
                            {isPending ? (
                                <LoaderCircle />
                            ) : (
                                <span> Đăng kí</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Signup;
