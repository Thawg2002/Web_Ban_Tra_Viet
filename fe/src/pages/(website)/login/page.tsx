import React, { useState } from "react";

const LoginPage = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <div className="mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-10">
                {/* Đăng nhập */}
                <div className="w-full max-w-md bg-white p-6 sm:p-8 shadow-lg">
                    <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">
                        Đăng nhập
                    </h2>
                    <form>
                        <div className="mb-4">
                            <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="username"
                            >
                                Tên tài khoản hoặc địa chỉ email *
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="username"
                                type="text"
                                placeholder="Nhập tên tài khoản hoặc email"
                            />
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
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                                type="button"
                            >
                                Đăng nhập
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
                {/* Đăng ký */}
                <div className="w-full max-w-md bg-white p-6 sm:p-8 shadow-lg">
                    <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">
                        Đăng ký
                    </h2>
                    <form>
                        <div className="mb-4">
                            <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="email"
                            >
                                Địa chỉ email *
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="email"
                                type="email"
                                placeholder="Nhập địa chỉ email"
                            />
                        </div>
                        <p className="text-gray-600 text-sm mb-4">
                            Một liên kết để đặt mật khẩu mới sẽ được gửi đến địa
                            chỉ email của bạn.
                        </p>
                        <p className="text-gray-600 text-xs mb-6">
                            Dữ liệu cá nhân của bạn sẽ được sử dụng để hỗ trợ
                            trải nghiệm của bạn trên toàn bộ trang web này, quản
                            lý quyền truy cập vào tài khoản của bạn, và cho các
                            mục đích khác được mô tả trong{" "}
                            <a href="#" className="text-pink-500">
                                chính sách riêng tư
                            </a>{" "}
                            của chúng tôi.
                        </p>
                        <div className="mb-6">
                            <button
                                className="bg-pink-500 text-white font-bold py-2 px-4 rounded w-full hover:bg-pink-700 focus:outline-none focus:shadow-outline"
                                type="button"
                            >
                                Đăng ký
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
