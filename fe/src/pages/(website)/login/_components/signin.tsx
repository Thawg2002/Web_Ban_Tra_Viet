import React, { useState } from "react";

import { LoaderCircle } from "lucide-react";
import { message } from "antd";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { SigninUser } from "@/services/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/common/hooks/useAuth";
interface SignupFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}
const Signin = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const { setAuthUser, setIsLoggedIn } = useAuth();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const { mutate, isPending } = useMutation({
        mutationFn: (user: SignupFormData) => SigninUser(user),
        onSuccess: (response: any) => {
            if (response) {
                const { user, accessToken, refreshToken } = response.data;

                setAuthUser?.(user);
                setIsLoggedIn?.(true);

                localStorage.setItem("user", JSON.stringify(user));
                localStorage.setItem("accessToken", accessToken);

                document.cookie = `refreshToken=${refreshToken}; path=/; secure; samesite=strict; expires=${new Date(
                    Date.now() + 7 * 24 * 60 * 60 * 1000,
                ).toUTCString()}`;

                messageApi.success("Đăng nhập thành công");

                setTimeout(() => {
                    navigate("/");
                }, 1000);
            }
        },
        onError: () => {
            messageApi.error("Đăng nhập thất bại");
        },
    });

    const onSubmit = async (data: any) => {
        mutate(data);
    };
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };
    return (
        <>
            {contextHolder}
            <div className="w-full max-w-md bg-white p-6 sm:p-8 shadow-lg">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">
                        Đăng nhập
                    </h2>
                </div>
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="username"
                        >
                            Tên tài khoản hoặc địa chỉ email *
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
                                {errors.email.message as any}
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
                                                : "M10 2C5.586 2 2 6.486 2 10s3.586 8 8 8 8-3.486 8-8-3.586-8-8-8zm0 14c-3.243 0-6-3.482-6-6s2.757-6 6-6 6 3.482 6 6-2.757 6-6 6zm0-11c-1.655 0-3 1.345-3 3s1.345 3 3 3 3-1.345 3-3-1.345-3-3-3z"
                                        }
                                    />
                                </svg>
                            </span>
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-2">
                                {errors.password.message as any}
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
                            type="submit"
                            className="bg-pink-500 text-white font-bold py-2 px-4 rounded w-full hover:bg-pink-700 focus:outline-none focus:shadow-outline"
                        >
                            {isPending ? <LoaderCircle /> : "Đăng nhập"}
                        </button>
                    </div>
                    <div className="text-center">
                        <a
                            className="inline-block align-baseline font-bold text-sm text-pink-500 hover:text-pink-800"
                            href="#"
                        >
                            Quên mật khẩu?
                        </a>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Signin;
