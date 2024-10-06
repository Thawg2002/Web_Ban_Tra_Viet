import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IProduct } from "@/common/types/product";
import { Spin } from "antd";

type Props = {
    products?: any;
};

const SimilarProducts: React.FC<Props> = ({ products }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const [category, setCategory] = useState<string | null>(null);
    const [priceRange, setPriceRange] = useState<string | null>(null);

    // Extract query parameters from the URL when the component mounts
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const categoryParam = params.get("category");
        const priceParam = params.get("priceRange");

        if (categoryParam) setCategory(categoryParam);
        if (priceParam) setPriceRange(priceParam);
    }, [location.search]);

    // Function to handle filter changes and update the URL with new filters
    const handleFilterChange = (newCategory: string, newPriceRange: string) => {
        const params = new URLSearchParams();

        if (newCategory) {
            params.set("category", newCategory);
        }

        if (newPriceRange) {
            params.set("priceRange", newPriceRange);
        }

        // Navigate to the new URL with the updated query parameters
        navigate({
            search: params.toString(),
        });
    };

    // Filter products based on the selected category and price range
    let filteredProducts = products?.data ?? [];

    if (category) {
        filteredProducts = filteredProducts.filter((item: IProduct) =>
            item.category?.some((cate) => cate === category),
        );
    }

    if (priceRange) {
        const [minPrice, maxPrice] = priceRange.split("-").map(Number);
        filteredProducts = filteredProducts.filter((item: IProduct) => {
            const discountedPrice =
                item.regular_price * (1 - item.discount / 100);
            return discountedPrice >= minPrice && discountedPrice <= maxPrice;
        });
    }

    return (
        <div className="mt-28">
            <h3 className="text-xl font-semibold text-[rgba(66,66,66,0.55)] text-center pb-5">
                Sản phẩm tương tự
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-5 mb-5">
                {filteredProducts && filteredProducts.length > 0 ? (
                    filteredProducts.map((product: IProduct) => (
                        <div className="text-center" key={product._id}>
                            <div className="relative cursor-pointer">
                                <a href={`${product._id}`}>
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full transition-opacity duration-300 opacity-100 hover:opacity-0"
                                    />
                                    <img
                                        src={
                                            product.gallery &&
                                            product.gallery[0]
                                        }
                                        alt={`${product.name} Hover`}
                                        className="w-full transition-opacity duration-300 opacity-0 hover:opacity-100 absolute top-0 left-0"
                                    />
                                </a>
                            </div>
                            <h3 className="mt-4 text-gray-800 text-sm capitalize">
                                {product.name}
                            </h3>
                            <p className="text-red-600">★★★★★</p>
                            <a
                                href={`/products/${product._id}`}
                                className="text-red-600 text-sm font-medium"
                            >
                                ĐỌC TIẾP
                            </a>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">
                        Không có sản phẩm tương tự.
                    </p>
                )}
            </div>
        </div>
    );
};

export default SimilarProducts;
