import { useState } from "react";
import axios from "axios";
import instance from "@/configs/axios";

const DropdownMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const closeDropdown = () => {
        setIsOpen(false);
    };

    const handleOptionSelect = async (sortOption) => {
        setLoading(true);
        setError(null);
        try {
            const response = await instance.get(`products`);
            let sortedProducts = response.data.data;

            // Sắp xếp dữ liệu dựa trên tùy chọn
            switch (sortOption) {
                case "newest":
                    sortedProducts = sortedProducts.sort(
                        (a: any, b: any) =>
                            new Date(b.createdAt) - new Date(a.createdAt),
                    );
                    break;
                case "low-to-high":
                    sortedProducts = sortedProducts.sort(
                        (a, b) => a.regular_price - b.regular_price,
                    );
                    break;
                case "high-to-low":
                    sortedProducts = sortedProducts.sort(
                        (a, b) => b.regular_price - a.regular_price,
                    );
                    break;
                case "top-rated":
                    // Giả sử bạn có thuộc tính "rating" cho đánh giá tốt nhất
                    // sortedProducts = sortedProducts.sort((a, b) => b.rating - a.rating);
                    break;
                default:
                    break;
            }

            setProducts(sortedProducts);
        } catch (error) {
            setError("Error fetching data");
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
            closeDropdown();
        }
    };

    return (
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
                            <button
                                className="block px-4 py-2 text-left w-full hover:bg-red-500 hover:text-white"
                                onClick={() => handleOptionSelect("newest")}
                            >
                                Mới nhất
                            </button>
                        </li>
                        <li>
                            <button
                                className="block px-4 py-2 text-left w-full hover:bg-red-500 hover:text-white"
                                onClick={() =>
                                    handleOptionSelect("low-to-high")
                                }
                            >
                                Giá: Thấp đến Cao
                            </button>
                        </li>
                        <li>
                            <button
                                className="block px-4 py-2 text-left w-full hover:bg-red-500 hover:text-white"
                                onClick={() =>
                                    handleOptionSelect("high-to-low")
                                }
                            >
                                Giá: Cao đến Thấp
                            </button>
                        </li>
                        <li>
                            <button
                                className="block px-4 py-2 text-left w-full hover:bg-red-500 hover:text-white"
                                onClick={() => handleOptionSelect("top-rated")}
                            >
                                Đánh giá tốt nhất
                            </button>
                        </li>
                    </ul>
                </div>
            )}
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-600">{error}</p>}
            <div>
                {products.map((product) => (
                    <div key={product._id} className="p-4 border-b">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-32 h-32 object-cover mb-2"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DropdownMenu;
