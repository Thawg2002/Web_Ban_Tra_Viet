import { cn } from "@/common/lib/utils";
import { fetchOrders } from "@/services/order";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import LoadingTable from "./TableLoading";

const PurchaseIndex = () => {
    const queryCLient = useQueryClient();
    const [active, setActive] = useState(7);
    const [status, setStatus] = useState<string | null>(null);
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
            name: "Đang giao hàng",
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
    // const statusList = [
    //     "chờ xác nhận",
    //     "đã xác nhận",
    //     "đang giao",
    //     "đã giao",
    //     "đã hủy",
    // ];
    const handleMenuClick = (item: any) => {
        console.log("item", item);
        setActive(item.name);
        setStatus(item.name === "Tất cẩ" ? null : item.name);
    };
    // console.log("status", status);
    const { data, isLoading, refetch } = useQuery({
        queryKey: ["purchase"],
        queryFn: async () => {
            try {
                const { data } = await fetchOrders(status);
                // console.log("dadadadada00", data);
                return data;
            } catch (error) {
                throw new Error("Error");
            }
        },
        staleTime: 5 * 60 * 60,
        enabled: !!status,
    });
    // console.log("data", data)
    useEffect(() => {
        // Refetch orders whenever status changes
        if (status !== undefined) {
            refetch(); // Trigger refetch on status change
        }
    }, [status, refetch]);
    return (
        <>
            <div className="w-full bg-gray-100/60">
                <div className="sticky top-0">
                    <ul className="flex scroll-custom  no-scrollbar text-base bg-white md:border md:border-gray-200 rounded box-shadow scroll-custom overflow-x-auto">
                        {menuList.map((item: any) => (
                            <li
                                key={item.name}
                                onClick={() => handleMenuClick(item)}
                                className={cn(
                                    `flex-1 text-nowrap text-sm md:text-base px-5 cursor-pointer font-medium flex justify-center py-3 md:py-5 border-b-2 border-gray-200 hover:border-b-2
                                 hover:border-blue-500 hover:text-blue-500 transition-all duration-300 `,
                                    active === item.name &&
                                        `border-blue-500 text-blue-500`,
                                )}
                            >
                                {item.name}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="h-[500px">
                    {isLoading && (
                        <div className="">
                            <LoadingTable />
                        </div>
                    )}
                </div>
                <div className="">
                    <div className="">
                        {!isLoading &&
                            data &&
                            (data as any)?.map(
                                (orderList: any, index: number) => {
                                    // console.log("item", orderItem)
                                    return (
                                        <>
                                            <div
                                                className=" my-8 px-10 border-b"
                                                key={orderList?._id}
                                            >
                                                <div className="w-full bg-white box-shadow flex justify-between items-center rounded-sm border border-gray-200 px-2 md:px-5 py-3">
                                                    <div className="text-xs md:text-base font-semibold">
                                                        Mã đơn hàng:{" "}
                                                        <span className="text-gray-900 font-medium">
                                                            {orderList?._id}{" "}
                                                        </span>
                                                    </div>
                                                    <div
                                                        className={cn(
                                                            orderList.status ==
                                                                "cancelled"
                                                                ? "text-red-500"
                                                                : " text-blue-500 ",
                                                            "text-xs font-medium uppercase",
                                                        )}
                                                    >
                                                        {orderList?.status}
                                                    </div>
                                                </div>
                                                {/* end */}

                                                {orderList?.items?.map(
                                                    (
                                                        orderItem: any,
                                                        index: number,
                                                    ) => {
                                                        return (
                                                            <>
                                                                <div className="pt-3">
                                                                    <div
                                                                        key={
                                                                            orderItem?._id
                                                                        }
                                                                        className="w-full flex justify-between gap-3 md:gap-5 pb-4 border-b border-gray-300 "
                                                                    >
                                                                        <div className="size-[80px] md:size-[130px] bg-gray-100 ">
                                                                            <img
                                                                                src={
                                                                                    orderItem
                                                                                        ?.productId
                                                                                        ?.image
                                                                                }
                                                                                className="w-full h-full"
                                                                                alt=""
                                                                            />
                                                                        </div>
                                                                        <div className="flex flex-1 flex-col md:flex-row md:justify-between gap-2">
                                                                            <div className="">
                                                                                <h3 className="text-base md:text-[18px] font-medium line-clamp-1 ">
                                                                                    {
                                                                                        orderItem
                                                                                            ?.productId
                                                                                            .name
                                                                                    }
                                                                                </h3>
                                                                                <div className="flex flex-row md:flex-col gap-x-3">
                                                                                    <span className="text-sm text-gray-900 md:text-base">
                                                                                        x
                                                                                        {
                                                                                            orderItem?.quantity
                                                                                        }
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                            <div className="text-red-500 text-sm md:text-base flex items-end md:items-center font-medium ">
                                                                                <span className="text-gray-500 line-through pr-3">
                                                                                    {Number(
                                                                                        orderItem
                                                                                            ?.productId
                                                                                            .regular_price,
                                                                                    ).toLocaleString()}{" "}
                                                                                    đ
                                                                                </span>
                                                                                <span className="">
                                                                                    {Number(
                                                                                        orderItem
                                                                                            ?.productId
                                                                                            .regular_price *
                                                                                            (1 -
                                                                                                orderItem
                                                                                                    ?.productId
                                                                                                    .discount /
                                                                                                    100),
                                                                                    ).toLocaleString()}{" "}
                                                                                    đ
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className=""></div>
                                                            </>
                                                        );
                                                    },
                                                )}
                                                <div className="flex justify-between item-center w-full py-5">
                                                    {["Chờ xác nhận"].includes(
                                                        orderList?.status,
                                                    ) && (
                                                        <button
                                                            className="px-3 py-3 cursor-pointer text-white border 
                                                border-[#ee4d2d] rounded-[6px] bg-[#ee4d2d] hover:bg-[#cd3011]
                                                 transition-all duration-300  text-xs lg:text-[16px]"
                                                        >
                                                            Hủy đơn hàng
                                                        </button>
                                                    )}
                                                    <button className=""></button>
                                                    <p className="text-right text-sm md:text-base lg:font-medium lg:flex gap-x-3">
                                                        Tổng số tiền:
                                                        <span className="text-red-500 font-medium lg:font-semibold text-sm lg:text-[18px] pl-2 lg:pl-0">
                                                            {Number(
                                                                orderList.totalPrice,
                                                            ).toLocaleString()}{" "}
                                                            đ
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                        </>
                                    );
                                },
                            )}
                    </div>
                    {data?.length === 0 && (
                        <div className="w-full bg-white h-[300px] flex flex-col justify-center items-center">
                            <div className="w-20">
                                <img
                                    src="https://toinh-ecommerce.vercel.app/images/no-order.png"
                                    alt=""
                                    className=""
                                />
                            </div>
                            <h3 className="">Chưa có đơn hàng.</h3>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default PurchaseIndex;
