import instance from "@/configs/axios";

// export const fetchOrders = (status: string | null) => {
//     const uri = `/orders/${status}`;
//     return instance.get(uri)
// }
export const fetchOrders = (status: string | null) => {
    // Tạo URI với query parameter nếu có status, nếu không bỏ qua status
    const uri = status ? `/orders?status=${encodeURIComponent(status)}` : '/orders';

    return instance.get(uri);
}
