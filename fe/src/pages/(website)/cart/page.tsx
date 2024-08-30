import { tra_o_long } from "@/assets/img";
import React from "react";

const ShoppingCart = () => {
    const cartItems = [
        {
            name: "Quà tặng khách hàng, đối tác - Trà Cổ Thụ, Trà Lài, Trà Thái Nguyên, Trà Ô Long",
            price: 1000000,
            quantity: 9,
        },
        {
            name: "Trà Ô Long - Hộp 10 túi 8 gram tiện dụng",
            price: 247000,
            quantity: 1,
        },
    ];

    const subtotal = 9247000;
    const tax = 739760;
    const total = 9986760;

    return (
        <div className="max-w-full lg:max-w-[1200px] mx-auto p-4 lg:p-6">
            <h1 className="text-3xl lg:text-5xl font-bold mb-4 lg:mb-6 text-center">
                Giỏ hàng
            </h1>
            <div className="flex flex-col md:flex-row gap-4 lg:gap-6 mt-6 lg:mt-8">
                <div className="w-full md:w-2/3">
                    {cartItems.map((item, index) => (
                        <div
                            key={index}
                            className="flex flex-col md:flex-row items-center border-b py-4 md:py-2"
                        >
                            <button className="mr-4 text-gray-500">
                                &times;
                            </button>
                            <img
                                src={tra_o_long}
                                alt={item.name}
                                className="w-16 h-16 md:w-20 md:h-20 object-cover mb-4 md:mb-0 mr-0 md:mr-4"
                            />
                            <div className="flex-grow text-center md:text-left">
                                <p className=" font-semibold">{item.name}</p>
                                <p className="text-gray-600">
                                    {item.price.toLocaleString()} ₫
                                </p>
                            </div>
                            <input
                                type="number"
                                value={item.quantity}
                                className="w-16 p-2 border rounded text-center mt-2 md:mt-0"
                                min="1"
                            />
                            <p className="ml-0 md:ml-4 mt-2 md:mt-0 font-roboto">
                                {(item.price * item.quantity).toLocaleString()}{" "}
                                ₫
                            </p>
                        </div>
                    ))}
                </div>
                <div className="w-full md:w-1/3 bg-gray-100 p-4 lg:p-6 rounded">
                    <h2 className="text-lg lg:text-xl font-bold mb-2 lg:mb-4">
                        CỘNG GIỎ HÀNG
                    </h2>
                    <div className="flex justify-between mb-2">
                        <span>TẠM TÍNH</span>
                        <span>{subtotal.toLocaleString()} ₫</span>
                    </div>
                    <div className="flex justify-between mb-2 lg:mb-4">
                        <span>THUẾ VAT 8%</span>
                        <span>{tax.toLocaleString()} ₫</span>
                    </div>
                    <div className="flex justify-between font-bold text-base lg:text-lg">
                        <span>TỔNG</span>
                        <span>{total.toLocaleString()} ₫</span>
                    </div>
                    <button className="w-full bg-red-500 text-white py-2 lg:py-3 rounded mt-4 uppercase font-bold">
                        Tiến hành thanh toán
                    </button>
                </div>
            </div>
            <div className="mt-6 flex flex-col md:flex-row items-center">
                <input
                    type="text"
                    placeholder="Mã ưu đãi"
                    className="p-2 border rounded mr-2 mb-2 md:mb-0"
                />
                <button className="bg-gray-200 text-gray-700 py-2 px-4 rounded">
                    ÁP DỤNG
                </button>
            </div>
        </div>
    );
};

export default ShoppingCart;
