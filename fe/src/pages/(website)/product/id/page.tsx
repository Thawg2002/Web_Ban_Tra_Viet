import React, { useEffect, useState } from "react";
import { IoStar } from "react-icons/io5";
import { cn } from "@/common/lib/utils";
import { useParams } from "react-router-dom";
import { getProductById, getRelatedProduct } from "@/services/product";
import { useQuery } from "@tanstack/react-query";
import SimilarProducts from "./similarProducts";
import { IProduct } from "@/common/types/product";
const ProductDetail = () => {
    const [isActive, setIsActive] = useState(1);
    const [content, setContent] = useState("Mô tả sản phẩm");
        const [quantity, setQuantity] = useState(1);

    const { id } = useParams<{ id: any }>();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["getProductById", id],
        queryFn: () => getProductById(id),
    });
    const { data: relatedProduct } = useQuery({
        queryKey: ["relatedProducts", id],
        queryFn: () => getRelatedProduct(id),
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);
    const [mainImage, setMainImage] = useState();

    const [activeIndex, setActiveIndex] = useState(null);

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

    console.log(product);
    let filteredProducts = data?.products;

    if (product && filteredProducts) {
        filteredProducts = filteredProducts.filter(
            (item: IProduct) =>
                Array.isArray(item.category) &&
                item.category.some((cate) => product.category.includes(cate)) &&
                item._id !== product._id, // Loại bỏ sản phẩm hiện tại
        );
    }
 const handleAddToCart = () => {
        console.log(`Added ${quantity} ${product.name} to cart.`);
    };
    if (isLoading) return <div>Loading...</div>;
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
                                <h3 className="text-[42px] font-semibold py-4">
                                    {product.name}
                                </h3>
                                <div>
                                    <span className="font-medium text-[#EB2606] lg:text-xl lg:tracking-[0.7px] mb:text-base flex items-center lg:gap-x-3 lg:mt-0.5 mb:gap-x-2">
                                        {product.regular_price *
                                            (1 - product.discount / 100)}{" "}
                                        đ
                                        <del className="font-light lg:text-sm mb:text-sm text-[#9D9EA2]">
                                            {product.regular_price} đ
                                        </del>
                                    </span>
                                </div>

                                <div className="*:font-medium">
                                    <p
                                        className="pb-4 leading-[150%]"
                                        dangerouslySetInnerHTML={{
                                            __html: product?.description || "",
                                        }}
                                    ></p>
                                    <ul className="list-disc pl-5 *:leading-[160%]">
                                        <li className="">
                                            Lên men 30%, vị chát nhẹ và không
                                            gắt, mang đến một trà Ô Long thưởng
                                            thức êm dịu và tinh tế.
                                        </li>
                                        <li className="">
                                            Màu nước vàng sóng sánh, tạo điểm
                                            nhấn đẹp mắt cho ly trà.
                                        </li>
                                        <li className="">
                                            Hương thơm mạnh mẽ và hậu vị đậm đà,
                                            mang đến một trải nghiệm thưởng thức
                                            trà độc đáo.
                                        </li>
                                        <li className="">
                                            Pha được nhiều lần nước mà vẫn giữ
                                            nguyên hương vị đặc trưng.
                                        </li>
                                        <li className="">
                                            Là một lựa chọn tuyệt vời để tặng
                                            những người yêu thích hương vị trà
                                            đậm đà và trải nghiệm trà độc đáo
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            {/*Thêm giỏ hàng */}
                            <div className="mt-10 flex items-center gap-4">
                                <div className="flex items-center gap-4">
                                    <span className="whitespace-nowrap">
                                        Số lượng:
                                    </span>
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
                                <span className="">Danh mục: Trà Xanh</span>
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
                {/* <div className="mt-28">
                    <h3 className="text-xl font-semibold text-[rgba(66,66,66,0.55)] text-center pb-5">
                        Sản phẩm tương tự
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-5 mb-5">
                        <div className="text-center">
                            <div className="relative cursor-pointer">
                                <img
                                    src="https://www.traviet.com/wp-content/uploads/2015/06/tra-o-long-3-600x600.jpg"
                                    alt="Trà Sen"
                                    className="w-full transition-opacity duration-300 opacity-100 hover:opacity-0"
                                />
                                <img
                                    src="https://www.traviet.com/wp-content/uploads/2015/06/tra-o-long-2.jpg" // Thay bằng đường dẫn ảnh khác cho hover
                                    alt="Trà Sen Hover"
                                    className="w-full transition-opacity duration-300 opacity-0 hover:opacity-100 absolute top-0 left-0"
                                />
                            </div>
                            <h3 className="mt-4 text-gray-800 text-sm">
                                Trà Sen
                            </h3>
                            <p className="text-red-600">★★★★★</p>
                            <a
                                href="#"
                                className="text-red-600 text-sm font-medium"
                            >
                                ĐỌC TIẾP
                            </a>
                        </div>
                        <div className="text-center">
                            <div className="relative cursor-pointer">
                                <img
                                    src="https://www.traviet.com/wp-content/uploads/2015/06/tra-o-long-3-600x600.jpg"
                                    alt="Trà Sen"
                                    className="w-full transition-opacity duration-300 opacity-100 hover:opacity-0"
                                />
                                <img
                                    src="https://www.traviet.com/wp-content/uploads/2015/06/tra-o-long-2.jpg" // Thay bằng đường dẫn ảnh khác cho hover
                                    alt="Trà Sen Hover"
                                    className="w-full transition-opacity duration-300 opacity-0 hover:opacity-100 absolute top-0 left-0"
                                />
                            </div>
                            <h3 className="mt-4 text-gray-800 text-sm">
                                Trà Sen
                            </h3>
                            <p className="text-red-600">★★★★★</p>
                            <a
                                href="#"
                                className="text-red-600 text-sm font-medium"
                            >
                                ĐỌC TIẾP
                            </a>
                        </div>
                        <div className="text-center">
                            <div className="relative cursor-pointer">
                                <img
                                    src="https://www.traviet.com/wp-content/uploads/2015/06/tra-o-long-3-600x600.jpg"
                                    alt="Trà Sen"
                                    className="w-full transition-opacity duration-300 opacity-100 hover:opacity-0"
                                />
                                <img
                                    src="https://www.traviet.com/wp-content/uploads/2015/06/tra-o-long-2.jpg" // Thay bằng đường dẫn ảnh khác cho hover
                                    alt="Trà Sen Hover"
                                    className="w-full transition-opacity duration-300 opacity-0 hover:opacity-100 absolute top-0 left-0"
                                />
                            </div>
                            <h3 className="mt-4 text-gray-800 text-sm">
                                Trà Sen
                            </h3>
                            <p className="text-red-600">★★★★★</p>
                            <a
                                href="#"
                                className="text-red-600 text-sm font-medium"
                            >
                                ĐỌC TIẾP
                            </a>
                        </div>
                        <div className="text-center">
                            <div className="relative cursor-pointer">
                                <img
                                    src="https://www.traviet.com/wp-content/uploads/2015/06/tra-o-long-3-600x600.jpg"
                                    alt="Trà Sen"
                                    className="w-full transition-opacity duration-300 opacity-100 hover:opacity-0"
                                />
                                <img
                                    src="https://www.traviet.com/wp-content/uploads/2015/06/tra-o-long-2.jpg" // Thay bằng đường dẫn ảnh khác cho hover
                                    alt="Trà Sen Hover"
                                    className="w-full transition-opacity duration-300 opacity-0 hover:opacity-100 absolute top-0 left-0"
                                />
                            </div>
                            <h3 className="mt-4 text-gray-800 text-sm">
                                Trà Sen
                            </h3>
                            <p className="text-red-600">★★★★★</p>
                            <a
                                href="#"
                                className="text-red-600 text-sm font-medium"
                            >
                                ĐỌC TIẾP
                            </a>
                        </div>
                    </div>
                </div> */}
            </div>
        </>
    );
};

export default ProductDetail;
