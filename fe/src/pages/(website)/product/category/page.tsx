import React, { useState } from "react";

import { banner_banh_trung_thu_5, banner_qua_tet_scaled } from "@/assets/img";
import { useQuery } from "@tanstack/react-query";
import instance from "@/configs/axios";

const ProductCategory = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [price, setPrice] = useState(0);

    // Hàm xử lý khi giá trị của thanh trượt thay đổi
    const handleRangeChange = (event) => {
        setPrice(event.target.value);
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const { data } = useQuery({
        queryKey: ["products"],
        queryFn: async () => {
            try {
                const response = await instance.get("products");
                return response.data;
                // Trả về dữ liệu từ API
            } catch (error) {
                throw new Error("LỖI API");
            }
        },
    });

    const { data: categories } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            try {
                return await instance.get("categories");
                // Trả về dữ liệu từ API
            } catch (error) {
                throw new Error("LỖI API");
            }
        },
    });

    console.log(categories);

    return (
        <div>
            <div className="text-center mt-10">
                <h1 className="text-2xl md:text-4xl font-semibold">Trà Xanh</h1>

                <p className="text-gray-600 text-sm md:text-lg mt-4 mx-4 md:mx-96">
                    Các chuyên gia của Trà Việt đi khắp các vùng trà từ Tây Bắc,
                    Thái Nguyên đến Bảo Lộc để lựa chọn ra 12 loại trà xanh cao
                    cấp nhất Việt Nam.
                </p>
                <p className="text-sm md:text-xl text-gray-600 mt-4">
                    Tham khảo:
                    <a className="text-red-600 mx-2 inline-block">TRÀ TẾT</a>
                </p>
            </div>
            <div className="flex flex-col md:flex-row mx-4 md:mx-10 mt-5">
                <div className="md:w-1/6 p-4">
                    <h2 className="font-semibold text-lg">DANH MỤC SẢN PHẨM</h2>
                    <ul className="mt-4 space-y-2">
                        {categories?.data?.categories.map((category: any) => (
                            <li
                                key={category.id}
                                className="flex items-center justify-between"
                            >
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="category"
                                        className="mr-2"
                                        value={category.id} // Gán giá trị cho radio button
                                    />
                                    <span>{category.name}</span>
                                </label>
                                <span className="text-gray-600">
                                    {category.count}
                                </span>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-8">
                        <h3 className="font-semibold text-lg">
                            KHOẢNG GIÁ TUỲ CHỌN
                        </h3>
                        <div className="mt-4">
                            {/* Thanh trượt */}
                            <input
                                type="range"
                                min="0"
                                max="9999000"
                                step="1000"
                                value={price}
                                onChange={handleRangeChange}
                                className="w-full"
                            />
                            {/* Hiển thị giá */}
                            <div className="flex justify-between mt-2 text-xs md:text-sm text-gray-600">
                                <span>{price.toLocaleString()} đ</span>
                                <span>9.999.000 đ</span>
                            </div>
                            <button className="mt-4 bg-red-600 text-white py-2 px-4 rounded text-xs md:text-base">
                                LỌC
                            </button>
                        </div>
                    </div>
                </div>

                <div className="md:w-5/6 p-4">
                    <div className="flex flex-col md:flex-row">
                        <div className="flex-grow">
                            <nav className="text-gray-500 text-xs">
                                <a href="#" className="hover:text-gray-700">
                                    TRANG CHỦ
                                </a>{" "}
                                /
                                <a
                                    href="#"
                                    className="mx-2 hover:text-gray-700"
                                >
                                    CỬA HÀNG
                                </a>{" "}
                                /
                                <a
                                    href="#"
                                    className="mx-2 hover:text-gray-700"
                                >
                                    TRÀ
                                </a>{" "}
                                /
                                <a
                                    href="#"
                                    className="mx-2 hover:text-gray-700"
                                >
                                    TRÀ XANH
                                </a>
                            </nav>
                        </div>

                        <div className="w-full md:w-1/6 text-right mt-4 md:mt-0">
                            <div className="relative">
                                <button
                                    onClick={toggleDropdown}
                                    className="text-gray-700 font-medium"
                                >
                                    THỨ TỰ MẶC ĐỊNH
                                    <span className="ml-1">&#9662;</span>
                                </button>
                                {isOpen && (
                                    <div className="absolute right-0 mt-2 w-full md:w-48 bg-white border border-gray-200 rounded shadow-lg z-50">
                                        <ul className="py-2 text-sm text-gray-700">
                                            <li>
                                                <a
                                                    href="#"
                                                    className="block px-4 py-2 text-left hover:bg-red-500 hover:text-white"
                                                >
                                                    Mới nhất
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    href="#"
                                                    className="block px-4 py-2 text-left hover:bg-red-500 hover:text-white"
                                                >
                                                    Giá: Thấp đến Cao
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    href="#"
                                                    className="block px-4 py-2 text-left hover:bg-red-500 hover:text-white"
                                                >
                                                    Giá: Cao đến Thấp
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    href="#"
                                                    className="block px-4 py-2 text-left hover:bg-red-500 hover:text-white"
                                                >
                                                    Đánh giá tốt nhất
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-5 mb-5">
                        {data?.data.map((product: any) => (
                            <div key={product._id} className="text-center">
                                <div className="relative cursor-pointer">
                                    <a
                                        href={`products/${product._id}`}
                                        className="text-red-600 text-sm font-medium"
                                    >
                                        {" "}
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full transition-opacity duration-300 opacity-100 hover:opacity-0"
                                        />
                                        <img
                                            src={product.gallery[0]} // Hình ảnh thứ hai khi hover
                                            alt={`${product.name} Hover`}
                                            className="w-full transition-opacity duration-300 opacity-0 hover:opacity-100 absolute top-0 left-0"
                                        />
                                    </a>
                                </div>
                                <h3 className="mt-4 text-gray-800 text-sm">
                                    {product.name}
                                </h3>
                                <p className="text-red-600">★★★★★</p>
                                <a
                                    href={`products/${product._id}`}
                                    className="text-red-600 text-sm font-medium"
                                >
                                    ĐỌC TIẾP
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="w-full md:w-5/6 md:ml-72 md:pr-60 px-4 mt-8">
                <p className="mb-5">
                    Trà xanh là một sản phẩm được chế biến từ lá của cây chè
                    (tên khoa học: Camellia sinensis). Lá trà xanh không trải
                    qua quá trình oxy hóa, nên giữ lại nhiều thành phần tự nhiên
                    hơn so với các sản phẩm khác.
                </p>
                <p className="mb-5">
                    Đánh giá hình thức bên ngoài, cánh trà xanh khô có lớp nhung
                    mỏng lộ ra, búp sắc nét. Trà xanh cho ra nước trà màu xanh
                    hoặc vàng, vị chát. Nó có mùi cháy nếu là trà xào, hoặc mùi
                    lúa non nếu là trà hấp.
                </p>
                <h2 className="text-2xl md:text-4xl font-bold text-gray-600">
                    Nội dung chính
                </h2>
                <ul className="list-disc pl-4 md:pl-6 space-y-2 mt-5 mb-5">
                    <li>
                        <a href="#" className="text-red-600 hover:underline">
                            Trà Xanh là gì?
                        </a>
                    </li>
                    <li>
                        <a href="#" className="text-red-600 hover:underline">
                            Tác dụng của Trà Xanh với cơ thể
                        </a>
                    </li>
                    <ul className="list-disc pl-6 md:pl-8 space-y-2 mb-5">
                        <li>
                            <a
                                href="#"
                                className="text-gray-800 hover:underline"
                            >
                                Lợi ích sức khỏe
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="text-gray-800 hover:underline"
                            >
                                Lợi ích sắc đẹp
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="text-gray-800 hover:underline"
                            >
                                Lợi ích tinh thần
                            </a>
                        </li>
                    </ul>
                    <li>
                        <a href="#" className="text-red-600 hover:underline">
                            Quá trình oxy hóa tối thiểu – chìa khóa để tạo nên
                            trà xanh
                        </a>
                    </li>
                    <li>
                        <a href="#" className="text-red-600 hover:underline">
                            Sự khác nhau giữa Trà Xanh, Trà Đen và Trà Ô Long
                        </a>
                    </li>
                    <ul className="list-disc pl-6 md:pl-8 space-y-2 mb-5">
                        <li>
                            <a
                                href="#"
                                className="text-gray-800 hover:underline"
                            >
                                Mức độ oxy hóa
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="text-gray-800 hover:underline"
                            >
                                Phương pháp xử lý
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="text-gray-800 hover:underline"
                            >
                                Hương vị
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="text-gray-800 hover:underline"
                            >
                                Màu sắc lá trà
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="text-gray-800 hover:underline"
                            >
                                Hàm lượng caffein
                            </a>
                        </li>
                    </ul>
                </ul>
                <p className="mb-5">
                    Nếu tìm kiếm từ "trà xanh" trên mạng, bạn chắc chắn sẽ gặp
                    rất nhiều các định nghĩa, và cách lý giải khác nhau về từ
                    này. Dưới đây là một số định nghĩa mà bạn thường gặp khi tìm
                    kiếm từ "Trà Xanh":
                </p>
                <ul className="list-disc pl-4 md:pl-6 space-y-2">
                    <li>
                        <strong>Nước trà xanh:</strong> để nói đến trà nước từ
                        lá chè tươi
                    </li>
                    <li>
                        <strong>Trà xanh matcha:</strong> nói đến các loại trà
                        bột, thường dùng trong việc pha chế đồ uống hoặc làm
                        bánh. Một số ít nói đến bột trà matcha cao cấp, được
                        trồng nghi thức Trà đạo Nhật Bản.
                    </li>
                    <li>
                        <strong>Trà xanh nói chung:</strong> trong ngôn ngữ của
                        nhiều người, trà xanh là để chỉ những loại trà sợi rời,
                        được làm khô, để phân biệt với những loại thảo mộc khác
                        như trà vàng, trà vối, trà atiso...
                    </li>
                </ul>
                <p className="mt-5">
                    Trong bài viết này, tôi sẽ nói đến Trà Xanh ở khía cạnh là
                    một "phân loại trà" - một cách khoa học, nhưng đơn giản và
                    dễ hiểu. Hy vọng bài viết này sẽ cung cấp thêm cho bạn những
                    kiến thức bổ ích về trà.
                </p>
                <p className="mt-5">
                    Trà là thức uống phổ biến thứ 2 trên thế giới, sau chỉ nước.
                    Tất cả các loại trà đều được chế biến từ cây chè, hay còn
                    gọi là Camellia sinensis, không hề nhầm lẫn với các loại trà
                    thảo mộc. Các phương pháp chế biến lá trà khác nhau liên
                    quan đến mức độ oxy hóa khác nhau tạo ra các loại trà khác
                    nhau: trà xanh, trà ô long hoặc trà đen.
                </p>
            </div>
            <div className="my-4 md:grid md:grid-cols-2 mt-[40px] ">
                <div className="relative h-[160px] md:h-auto mb-4 md:h-[430px]">
                    <img
                        src={banner_banh_trung_thu_5}
                        alt=""
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <h1 className="text-[#fff] text-[40px]">
                            Bánh Trung Thu 2024
                        </h1>
                        <hr className="w-full max-w-[100px] my-2" />
                        <h2 className="text-[#fff]">ĐÚC LOGO LÊN BÁNH</h2>
                    </div>
                </div>
                <div className="relative h-[160px] md:h-auto md:h-[430px]">
                    <img
                        src={banner_qua_tet_scaled}
                        alt=""
                        className="w-full h-full object-cover "
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <h1 className="text-[#fff] text-[40px]">
                            Qùa Tết doanh nghiệp 2024
                        </h1>
                        <hr className="w-full max-w-[100px] my-2" />
                        <h2 className="text-[#fff]">QÙA TẾT IN LOGO</h2>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCategory;
