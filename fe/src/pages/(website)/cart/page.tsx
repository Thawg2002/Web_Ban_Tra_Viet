import useCart from "@/common/hooks/useCart";
import { toast } from "@/components/ui/use-toast";
import { Checkbox, Spin } from "antd";

import React, { useMemo, useState, useEffect } from "react";
import { MdDeleteSweep } from "react-icons/md";
import { FaDeleteLeft } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";

const ShoppingCart = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [listchecked, setListChecked] = useState<string[]>([]);
    const navigate = useNavigate();
    const {
        cart,
        isLoading,
        error,
        decreaseQuantity,
        increaseQuantity,
        removeItem,
    } = useCart(user?._id);

    // Update total price whenever cart data or listchecked changes
    const totalPriceChecked = useMemo(() => {
        const selectedProducts = cart?.cart?.cartData?.products.filter(
            (item: any) => listchecked.includes(item.productId),
        );
        const result = selectedProducts?.reduce((total:any, item: any) => {
            return total + (item.finalPrice || 0);
        }, 0);
        return result || 0;
    }, [cart?.cart?.cartData?.products, listchecked]);

    const onChangeChecked = (e: any) => {
        const productId = e.target.value;
        setListChecked((prevList) =>
            prevList.includes(productId)
                ? prevList.filter((item) => item !== productId)
                : [...prevList, productId],
        );
    };

    const onChangeCheckedAll = (e: any) => {
        if (e.target.checked) {
            const allProductIds = cart?.cart?.cartData?.products.map(
                (item: any) => item.productId,
            );
            setListChecked(allProductIds || []);
        } else {
            setListChecked([]);
        }
    };

    const handleQuantity = async (message: string, productId: string) => {
        try {
            if (message === "decreaseQuantity") {
                await decreaseQuantity.mutateAsync({
                    userId: user._id,
                    productId,
                });
            } else if (message === "increaseQuantity") {
                await increaseQuantity.mutateAsync({
                    userId: user._id,
                    productId,
                });
            }
        } catch (error) {
            console.log("error", error);
        }
    };

    const onhandleDelete = async (message: string, items: any) => {
        try {
            if (message === "deleteOneProduct") {
                await removeItem.mutateAsync({
                    userId: user._id,
                    productIds: items.productId,
                });
                setListChecked((prevList) =>
                    prevList.filter((item) => item !== items.productId),
                );
                toast({
                    variant: "success",
                    title: "Xóa thành công sản phẩm.",
                });
            } else if (message === "deleteAllProduct") {
                for (const item of items) {
                    await removeItem.mutateAsync({
                        userId: user._id,
                        productIds: item.productId,
                    });
                }
                setListChecked([]);
                toast({
                    variant: "success",
                    title: "Xóa thành công sản phẩm.",
                });
            }
        } catch (error) {
            console.log("error", error);
            toast({
                variant: "error",
                title: "Đã xảy ra lỗi khi xóa sản phẩm.",
            });
        }
    };

   const handleCheckout = () => {
       if (listchecked.length === 0) {
           toast({
               variant: "error",
               title: "Vui lòng chọn ít nhất một sản phẩm để thanh toán.",
           });
           return;
       }

       const selectedProducts = cart?.cart?.cartData?.products.filter(
           (item: any) => listchecked.includes(item.productId),
       );

       localStorage.setItem(
           "selectedProducts",
           JSON.stringify(selectedProducts),
       );

       // Navigate to checkout with selected products
       navigate("/checkout", {
           state: {
               selectedProducts,
           },
       });
   };


   if (isLoading) {
       return (
           <div className="flex items-center justify-center min-h-screen bg-gray-100">
               <Spin tip="Đang tải giỏ hàng..." size="large" className="text-blue-500" />
           </div>
       );
   }
    if (error) return <p>Error loading cart data</p>;

    return (
        <main className="lg:w-[1170px] mb:w-[342px] lg:mt-8 mb:mt-6 mx-auto grid lg:grid-cols-[686px_420px] mb:grid-cols-[100%] justify-between *:w-full pb-10">
            <div>
                <h1 className="text-3xl lg:text-5xl font-bold mb-4 lg:mb-6 text-center">
                    Giỏ hàng ({cart?.cart?.totalQuantity})
                </h1>
                <span className="text-xl  mb-[1px] items-center justify-between pb-2 border-b">
                    <div className="flex justify-between">
                        <div>
                            <Checkbox
                                onChange={onChangeCheckedAll}
                                checked={
                                    listchecked.length ===
                                    cart?.cart?.cartData?.products.length
                                }
                                className="text-[#9D9EA2]"
                            >
                                Chọn tất cả
                            </Checkbox>
                        </div>
                        <div className="w-[30px] max-w-[30px]">
                            {listchecked.length ===
                                cart?.cart?.cartData?.products.length ||
                            listchecked.length > 1 ? (
                                <MdDeleteSweep
                                    className="text-[25px] text-red-500 cursor-pointer"
                                    onClick={() =>
                                        onhandleDelete(
                                            "deleteAllProduct",
                                            cart?.cart?.cartData?.products.filter(
                                                (item: any) =>
                                                    listchecked.includes(
                                                        item.productId,
                                                    ),
                                            ),
                                        )
                                    }
                                />
                            ) : (
                                <MdDeleteSweep className="text-[25px] text-red-300" />
                            )}
                        </div>
                    </div>
                </span>
                {!cart?.cart?.cartData?.products ||
                cart?.cart?.cartData?.products.length === 0 ? (
                    <div className="text-center mt-5 text-gray-400">
                        <span className="block text-lg mb-4">
                            Không có sản phẩm trong giỏ hàng
                        </span>
                        <Link
                            to={`/`}
                            className="text-pink-500 hover:text-pink-700 underline font-semibold"
                        >
                            Mua sản phẩm
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col border-b lg:pb-[22px] mb:pb-3">
                        {cart?.cart?.cartData?.products.map(
                            (item: any, index: number) => {
                                return (
                                    <section
                                        className="flex lg:mt-[23px] mb:mt-[15px] gap-x-4 group relative "
                                        key={index}
                                    >
                                        <Checkbox
                                            value={item.productId}
                                            onChange={onChangeChecked}
                                            checked={listchecked.includes(
                                                item.productId,
                                            )}
                                        ></Checkbox>
                                        <img
                                            className="border rounded w-12 h-12 p-1"
                                            src={item.image}
                                            alt=""
                                        />
                                        <div className="relative w-full flex flex-col *:justify-between gap-y-2.5 lg:gap-y-3">
                                            <div className="lg:py-2 mb-0.5 lg:mb-0 flex lg:flex-row mb:flex-col lg:items-center gap-x-4">
                                                <span className="text-[#9D9EA2] text-sm capitalize">
                                                    {item.name}
                                                </span>
                                                <div className="relative lg:absolute lg:left-1/2 lg:-translate-x-[20.5%]">
                                                    <div className="lg:mt-0 mb:mt-[12.5px] flex items-center *:grid *:place-items-center *:lg:w-9 *:lg:h-9 *:mb:w-8 *:mb:h-8">
                                                        <button
                                                            onClick={() =>
                                                                handleQuantity(
                                                                    "decreaseQuantity",
                                                                    item.productId,
                                                                )
                                                            }
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width={12}
                                                                height={12}
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth={2}
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                className="lucide lucide-minus text-xs"
                                                            >
                                                                <path d="M5 12h14" />
                                                            </svg>
                                                        </button>
                                                        <div className="bg-[#F4F4F4] text-xs rounded">
                                                            {item.quantity}
                                                        </div>
                                                        <button
                                                            onClick={() =>
                                                                handleQuantity(
                                                                    "increaseQuantity",
                                                                    item.productId,
                                                                )
                                                            }
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width={12}
                                                                height={12}
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth={2}
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                className="lucide lucide-plus text-xs"
                                                            >
                                                                <path d="M5 12h14" />
                                                                <path d="M12 5v14" />
                                                            </svg>
                                                        </button>
                                                        <span className="ml-3 text-sm">
                                                            {Number(
                                                                item.price,
                                                            ).toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <span className="block absolute lg:hidden text-[#9D9EA2] text-sm top-5 right-0">
                                                        {Number(
                                                            item.price,
                                                        ).toLocaleString()}
                                                    </span>
                                                </div>
                                                <span className="hidden lg:block text-[#4a4c54] text-sm ">
                                                    {Number(
                                                        item.finalPrice,
                                                    ).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="hidden group-hover:flex items-center justify-center w-[55px] max-w-[55px]">
                                            <FaDeleteLeft
                                                className="w-[55px] max-w-[55px] mb-2 text-red-500 text-[20px] cursor-pointer"
                                                onClick={() =>
                                                    onhandleDelete(
                                                        "deleteOneProduct",
                                                        item,
                                                    )
                                                }
                                            />
                                        </div>
                                    </section>
                                );
                            },
                        )}
                    </div>
                )}
            </div>

            <div className="hidden lg:block">
                <div className="w-full lg:p-6 mb:p-5 border rounded-2xl flex flex-col gap-y-[3px]">
                    <div className="flex flex-col gap-y-4">
                        <section className="flex justify-between text-sm">
                            <span className="text-[#9D9EA2]">Tổng </span>
                            <p>
                                {Number(totalPriceChecked).toLocaleString()} đ
                            </p>
                        </section>
                    </div>

                    <a
                        href={"/"}
                        className="font-semibold text-sm underline cursor-pointer my-1 tracking-[-0.1px]"
                    >
                        Tiếp tục mua hàng
                    </a>
                    <button
                        className="bg-[#17AF26] px-10 h-14 rounded-[100px] text-white flex my-[13px] gap-x-4 place-items-center justify-center"
                        onClick={handleCheckout}
                    >
                        <span>Thanh Toán</span> |
                        <span>
                            {Number(totalPriceChecked).toLocaleString()} đ
                        </span>
                    </button>
                </div>
            </div>
        </main>
    );
};

export default ShoppingCart;
