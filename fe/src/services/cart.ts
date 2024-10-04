// Import các kiểu dữ liệu cần thiết (nếu có)

import instance from "@/configs/axios";
import axios from "axios";

export const getConfig = async () => {
    const res = await axios.get(`http://localhost:8080/api/payment/config`);
    return res.data;
};

// Hàm đặt hàng với TypeScript
export const placeOrder = async (orderData: any): Promise<Order> => {
    const response = await fetch("/api/order", {
        method: "POST",
        body: JSON.stringify(orderData),
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Đặt hàng thất bại!");
    }

    return await response.json();
};

// Hàm xóa giỏ hàng với TypeScript
// export const clearCart = async (): Promise<void> => {
//     const response = await instance.delete('/cart');

//     if (!response.ok) {
//         throw new Error('Xóa giỏ hàng thất bại!');
//     }
// };
export const clearCart = async () => {
    try {
        const response = await instance.delete(`/cart`, {
            // headers: {
            //     'Content-Type': 'application/json',
            //     "Authorization": "Bearer " + token ? token : ''
            // },
        });
        return response;
    } catch (error) {
        console.log(error);
    }
};
