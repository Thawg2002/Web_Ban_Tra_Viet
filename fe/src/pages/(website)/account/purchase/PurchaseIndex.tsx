import { cn } from '@/common/lib/utils';
import { fetchOrders } from '@/services/order';
import { getProductById } from '@/services/product';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'lucide-react';
import React, { useState } from 'react'

const PurchaseIndex = () => {
    const queryCLient = useQueryClient();
    const [active, setActive] = useState(7);
    const [status, setStatus] = useState(null);
    const menuList = [
        {
            index: 7,
            name: "Tất cả",
        },
        {
            index: 1,
            name: "Chờ xác nhận",
        },
        {
            index: 2,
            name: "Chờ lấy hàng",
        },
        {
            index: 3,
            name: "Chờ giao hàng",
        },
        {
            index: 8,
            name: "Đã giao",
        },
        {
            index: 6,
            name: "Đã hủy",
        },
    ];
    const statusList = [
        {
            index: 1,
            name: "Chờ xác nhận",
        },
        {
            index: 2,
            name: "Chờ lấy hàng",
        },
        {
            index: 3,
            name: "Đang giao hàng",
        },
        {
            index: 4,
            name: "Đã giao hàng",
        },
        {
            index: 5,
            name: "Đã nhận hàng",
        },
        {
            index: 6,
            name: "Đã hủy",
        },
    ];
    const handleMenuClick = (item: any) => {
        setActive(item.index);
        setStatus(item.index === 7 ? null : item.index);
    };
    const { data, isLoading } = useQuery({
        queryKey: ['purchase'],
        queryFn: async () => {
            try {
                const { data } = await fetchOrders();
                // console.log("dadadadada00", data);
                return data
            } catch (error) {
                throw new Error("Error");
            }
        },
        staleTime: 5 * 60 * 60,
    });
    // console.log("data", data)
    return (
        <>
            <div className="w-full bg-gray-100/60">
                <div className="sticky top-0">
                    <ul className="flex scroll-custom  no-scrollbar text-base bg-white md:border md:border-gray-200 rounded box-shadow scroll-custom overflow-x-auto">
                        {menuList.map((item: any) => (
                            <li
                                key={item.index}
                                onClick={() => handleMenuClick(item)}
                                className={cn(
                                    `flex-1 text-nowrap text-sm md:text-base px-5 cursor-pointer font-medium flex justify-center py-3 md:py-5 border-b-2 border-gray-200 hover:border-b-2
                                 hover:border-blue-500 hover:text-blue-500 transition-all duration-300 `,
                                    active === item.index && `border-blue-500 text-blue-500`,
                                )}
                            >
                                {item.name}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="">
                    {!isLoading && data && (data as any)?.map((orderList: any, index: number) => {
                        // console.log("item", orderItem)
                        return (
                            <>
                                <div className="my-8 px-10 border-b" key={orderList?._id}>
                                    <div className="w-full bg-white box-shadow flex justify-between items-center rounded-sm border border-gray-200 px-2 md:px-5 py-3">
                                        <div className="text-xs md:text-base font-semibold">
                                            Mã đơn hàng:{" "}
                                            <span className="text-gray-900 font-medium">
                                                {orderList?._id}{" "}
                                            </span>
                                        </div>
                                        <div
                                            className={cn(
                                                orderList.status == "cancelled"
                                                    ? "text-red-500 text-xs md:text-base font-medium"
                                                    : "text-xs md:text-base text-blue-500 font-medium ", "uppercase"
                                            )}
                                        >
                                            {
                                                orderList?.status
                                            }
                                        </div>
                                    </div>
                                    {/* end */}

                                    {orderList?.items?.map((orderItem: any, index: number) => {
                                        return (
                                            <>
                                                <div className="pt-3">
                                                    <div
                                                        key={orderItem?._id}
                                                        className="w-full flex justify-between gap-3 md:gap-5 pb-4 border-b border-gray-300 "
                                                    >
                                                        <div className="size-[80px] md:size-[130px] bg-gray-100 ">
                                                            <img
                                                                src={orderItem?.productId?.image}
                                                                className="w-full h-full"
                                                                alt=""
                                                            />
                                                        </div>
                                                        <div className="flex flex-1 flex-col md:flex-row md:justify-between gap-2">
                                                            <div className="">
                                                                <h3 className="text-base md:text-[18px] font-medium line-clamp-1 ">
                                                                    {orderItem?.productId.name}
                                                                </h3>
                                                                <div className="flex flex-row md:flex-col gap-x-3">
                                                                    <span className="text-sm text-gray-900 md:text-base">
                                                                        x{orderItem?.quantity}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="text-red-500 text-sm md:text-base flex items-end md:items-center font-medium ">
                                                                <span className="text-gray-500 line-through pr-3">
                                                                    {orderItem?.productId.regular_price}

                                                                </span>
                                                                <span className="">
                                                                    {orderItem?.productId.regular_price - orderItem?.productId.discount}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className=""></div>
                                            </>
                                        )
                                    })}
                                    <div className="flex justify-end w-full py-5">
                                        <p className="text-right text-sm md:text-base lg:font-medium lg:flex gap-x-3">
                                            Tổng số tiền:
                                            <span className="text-red-500 font-medium lg:font-semibold text-sm lg:text-[18px] pl-2 lg:pl-0">
                                                {orderList.totalPrice}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </>
                        )
                    })}
                </div>
            </div>
        </>
    )
}

export default PurchaseIndex