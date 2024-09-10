import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OrderSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { orderNumber, products, totalPrice } = location.state || {};

    useEffect(() => {
        // Xóa giỏ hàng sau khi hiển thị trang thành công
        localStorage.removeItem("cart");
        // Hoặc nếu bạn đang sử dụng một state management library như Redux:
        // dispatch(clearCart());
    }, []);

    const handleContinueShopping = () => {
        navigate("/products");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 sm:p-6">
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg text-center ">
                <div className="flex justify-center items-center mb-6">
                    <div className="bg-green-100 text-green-500 rounded-full p-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-16 w-16"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold mb-4">
                    Cảm ơn bạn đã mua hàng
                </h1>
                <p className="text-gray-700 mb-6">
                    Chúng tôi đã nhận đơn hàng của bạn và sẽ gửi đi trong 5-7
                    ngày làm việc. <br />
                    Mã đơn hàng của bạn là <strong>#{orderNumber}</strong>
                </p>

                {/* Tóm tắt đơn hàng */}
                <div className="bg-gray-100 p-4 rounded-lg mb-6">
                    <h2 className="text-lg font-semibold mb-3 text-left">
                        Tóm tắt đơn hàng
                    </h2>
                    {products?.map((product: any, index: any) => (
                        <div
                            key={index}
                            className="flex justify-between items-center mb-2"
                        >
                            <div className="flex items-center">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-12 h-12 rounded mr-4"
                                />
                                <span className="capitalize">
                                    {product.name}
                                </span>
                                <span className="text-gray-600 ml-2">
                                    x {product.quantity}
                                </span>
                            </div>
                            <span className="">
                                {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                }).format(product.price)}
                            </span>
                        </div>
                    ))}
                    <hr className="my-4" />
                    <div className="flex justify-between items-center font-bold">
                        <span>Tổng cộng</span>
                        <span>
                            {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                            }).format(totalPrice)}
                        </span>
                    </div>
                </div>

                <button
                    className="bg-pink-500 text-white font-bold py-2 px-4 rounded hover:bg-pink-700 focus:outline-none focus:shadow-outline"
                    onClick={handleContinueShopping}
                >
                    Tiếp tục mua sắm
                </button>
            </div>
        </div>
    );
};

export default OrderSuccess;
