import instance from "@/configs/axios";

export const fetchOrders = () => {
    const uri = `/orders/`;
    return instance.get(uri)
}