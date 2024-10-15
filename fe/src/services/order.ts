import instance from "@/configs/axios";

// // export const fetchOrders = (status: string | null) => {
// //     const uri = `/orders/${status}`;
// //     return instance.get(uri)
// // }
export const fetchOrders = (status: string | null) => {
    // Tạo URI với query parameter nếu có status, nếu không bỏ qua status
    const uri = status
        ? `/orders?status=${encodeURIComponent(status)}`
        : "/orders";
    return instance.get(uri);
};
export const cancelOrder = async (
    id: string,
    note: string,
    cancelBy: string,
) => {
    const data = await instance.put(`/orders/cancelOrder/${id}`, {
        note: note,
        cancelBy: cancelBy,
    });
    return data;
};
// import instance from "@/configs/axios";

// export const fetchOrders = (userId: string, status: string | null = null) => {
//     // Tạo URI với query parameters cho status và userId
//     let uri = `/orders?userId=${encodeURIComponent(userId)}`; // Bắt buộc có userId

//     // Nếu có status, thêm vào query params
//     if (status) {
//         uri += `&status=${encodeURIComponent(status)}`;
//     }

//     return instance.get(uri);
// };
