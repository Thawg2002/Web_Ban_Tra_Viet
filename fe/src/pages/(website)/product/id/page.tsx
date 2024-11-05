import React, { useEffect, useState } from "react";
import { IoStar } from "react-icons/io5";
import { cn } from "@/common/lib/utils";
import { useParams } from "react-router-dom";
import { getProductById, getRelatedProduct } from "@/services/product";
import { useQuery } from "@tanstack/react-query";
import SimilarProducts from "./similarProducts";
import useCart from "@/common/hooks/useCart";
import { toast } from "@/components/ui/use-toast";
import { getAllCategories } from "@/services/categories";
import { Spin } from "antd";
const ProductDetail = () => {
    const [isActive, setIsActive] = useState(1);
    const [content, setContent] = useState("Mô tả sản phẩm");
    const [quantity, setQuantity] = useState(1);
    const [mainImage, setMainImage] = useState<string | undefined>();
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const { id } = useParams<{ id: string }>();
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["getProductById", id],
        queryFn: () => getProductById(id),
    });
    console.log(data);
    const { data: relatedProduct } = useQuery({
        queryKey: ["relatedProducts", id],
        queryFn: () => getRelatedProduct(id),
    });
    const { data: category } = useQuery({
        queryKey: ["categories"],
        queryFn: getAllCategories,
    });
    const { addItem } = useCart(user?._id);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    const handleAddToCart = () => {
        if (!user?._id) {
            toast({
                variant: "error",
                title: "Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.",
            });
            return;
        }

        if (product && quantity <= product.countInStock) {
            addItem.mutate(
                {
                    userId: user._id,
                    productId: product._id,
                    quantity,
                },
                {
                    onSuccess: () => {
                        toast({
                            variant: "success",
                            title: "Thêm sản phẩm thành công.",
                        });
                    },
                    onError: (error: any) => {
                        toast({
                            variant: "error",
                            title: "Đã xảy ra lỗi khi thêm sản phẩm.",
                            description: error.message,
                        });
                    },
                },
            );
        } else {
            toast({
                variant: "error",
                title: "Số lượng sản phẩm không hợp lệ.",
            });
        }
    };
    const menuList = [
        {
            index: 1,
            name: "Mô tả",
            content: "Mô tả sản phẩm",
        },
        {
            index: 2,
            name: "Thông tin bổ sung",
            content: "Thông tin sản phẩm",
        },
        {
            index: 3,
            name: "Đánh giá (09)",
            content: "Đánh giá sản phẩm",
        },
    ];
    const handleClickMenu = (item: any) => {
        setIsActive(item.index);
        setContent(item.content);
    };
    const product = data?.product;
    const images = product ? [product.image, ...(product.gallery || [])] : [];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <Spin
                    tip="Đang tải..."
                    size="large"
                    className="text-blue-500"
                />
            </div>
        );
    }

    if (isError) return <div>{error.message}</div>;
    return (
        <>
            <div className="padding py-16 lg:py-20">
                {/* head */}
                <div className="max-w-[1200px] mx-auto ">
                    <div className=" grid grid-cols-1 lg:grid-cols-2 gap-y-20  gap-x-16 ">
                        {/*   left */}
                        <div className="">
                            <div className="flex flex-col lg:flex-row gap-7 justify-center">
                                <div className="order-2 lg:order-1 flex flex-1 flex-row lg:flex-col gap-7 justify-center">
                                    {images.map((image, index) => (
                                        <div
                                            key={index}
                                            className={`w-[20%] lg:w-full border border-gray-200 shadow-xl cursor-pointer transition-opacity duration-300 ${
                                                activeIndex === index
                                                    ? "opacity-50"
                                                    : "opacity-100"
                                            }`}
                                            onClick={() => {
                                                setMainImage(image);
                                                setActiveIndex(index);
                                            }}
                                        >
                                            <img
                                                src={image}
                                                alt={`Thumbnail ${index + 1}`}
                                                className="w-full h-full object-cover transition-transform duration-300 ease-in-out transform hover:scale-105"
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="order-1 lg:order-2 w-[100%] lg:w-[85%] border-gray-200 overflow-hidden rounded-[6px] shadow-md">
                                    <img
                                        src={mainImage || product.image}
                                        className="w-full h-full object-cover transition-opacity duration-300 ease-in-out"
                                        alt="Main"
                                    />
                                </div>
                            </div>
                        </div>
                        {/* right */}
                        <div className="">
                            <div className="flex flex-col lg:flex-row justify-between">
                                <div className="flex gap-x-2 text-sm text-[rgba(66,66,66,0.55)] uppercase">
                                    <span className="">Trang chủ /</span>
                                    <span className="">Trà việt shop /</span>
                                    <span className="">Trà /</span>
                                    <span className="">Trà xanh /</span>
                                </div>
                                <div className="flex">
                                    <span className="">
                                        <IoStar
                                            size={14}
                                            className="text-red-600"
                                        />
                                    </span>
                                    <span className="">
                                        <IoStar
                                            size={14}
                                            className="text-red-600"
                                        />
                                    </span>
                                    <span className="">
                                        <IoStar
                                            size={14}
                                            className="text-red-600"
                                        />
                                    </span>
                                    <span className="">
                                        <IoStar
                                            size={14}
                                            className="text-red-600"
                                        />
                                    </span>
                                    <span className="">
                                        <IoStar
                                            size={14}
                                            className="text-red-600"
                                        />
                                    </span>
                                </div>
                            </div>
                            <div className="*:text-[#424242]">
                                <h3 className="text-[42px] font-semibold py-4 capitalize">
                                    {product.name}
                                </h3>
                                <div>
                                    <span className="font-medium text-[#EB2606] lg:text-xl lg:tracking-[0.7px] mb:text-base flex items-center lg:gap-x-3 lg:mt-0.5 mb:gap-x-2">
                                        {Number(
                                            product.regular_price *
                                                (1 - product.discount / 100),
                                        ).toLocaleString()}{" "}
                                        đ
                                        <del className="font-light lg:text-sm mb:text-sm text-[#9D9EA2]">
                                            {Number(
                                                product.regular_price,
                                            ).toLocaleString()}{" "}
                                            đ
                                        </del>
                                    </span>
                                </div>

                                <div className="*:font-medium">
                                    <ul className="list-disc pl-5 *:leading-[160%] mt-5">
                                        <li
                                            className=""
                                            dangerouslySetInnerHTML={{
                                                __html:
                                                    product?.description || "",
                                            }}
                                        ></li>
                                    </ul>
                                </div>
                            </div>
                            {/*Thêm giỏ hàng */}
                            {/* Quantity and Add to Cart */}
                            <div className="mt-10 flex items-center gap-4">
                                <div className="flex items-center gap-4">
                                    <span>Số lượng:</span>
                                    <input
                                        type="number"
                                        value={quantity}
                                        min={1}
                                        onChange={(e) =>
                                            setQuantity(Number(e.target.value))
                                        }
                                        className="border border-gray-300 w-20 p-2 text-center"
                                    />
                                </div>
                                <button
                                    onClick={handleAddToCart}
                                    className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 ml-10 transition-colors"
                                >
                                    Thêm vào giỏ hàng
                                </button>
                            </div>

                            <div className="border-t mt-10 pt-8 border-gray-300 *:uppercase *:text-[rgba(66,66,66,0.55)] *:text-sm *:font-semibold flex flex-col *:leading-[160%] tracking-[0.14px]">
                                <span className="">Mã: 19001901</span>
                                <span className="">
                                    Danh mục: {product.name}
                                </span>
                                <span className="">
                                    Thẻ: Ai cũng thích, Bậc tăng ni, Bán chạy
                                    nhất, Bảo Lộc, Dễ ngủ, Hương nồng đượm, Mới
                                    bắt đầu, Người Bắc, Người lớn tuổi, Người
                                    Nam, Người sành trà, Người yêu trà, Phụ nữ,
                                    Tập trung, Thích khám phá, Thư giãn, Đà Lạt
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                {/*  */}
                <div className="pt-28">
                    <div className="flex gap-10 justify-center">
                        {menuList.map((item: any) => (
                            <span
                                onClick={() => handleClickMenu(item)}
                                key={item.index}
                                className={cn(
                                    `text-[rgba(66,66,66,0.55)] text-base py-2 font-semibold border-transparent border-t-[3px] hover:border-red-700`,
                                    isActive === item.index &&
                                        `bborder-t-[3px] border-red-700 text-[#424242]`,
                                )}
                            >
                                {item.name}
                            </span>
                        ))}
                    </div>
                    <div className="text-center pt-10">{content}</div>
                </div>
                {/* similar product */}
                <SimilarProducts products={relatedProduct} />
            </div>
        </>
    );
};

export default ProductDetail;
