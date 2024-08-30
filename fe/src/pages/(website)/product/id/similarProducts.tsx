import { IProduct } from "@/common/types/product";
import React, { forwardRef } from "react";

type Props = {
    products: any;
    category?: string;
    price?: number;
};

const SimilarProducts = forwardRef<HTMLDivElement, Props>(
    ({ products, category, price }: Props, ref) => {
        let filteredProducts = products?.data;

        // Lọc sản phẩm dựa trên danh mục
        if (category) {
            filteredProducts = filteredProducts?.filter((item: IProduct) =>
                item.category?.some((cate) => cate === category),
            );
        }

        // Lọc sản phẩm dựa trên giá
        if (price != 0 && price != undefined) {
            filteredProducts = filteredProducts?.filter((item: IProduct) => {
                const discountedPrice =
                    item.regular_price * (1 - item.discount / 100);
                return discountedPrice >= 0 && discountedPrice <= price;
            });
        }

        return (
            <div ref={ref} className="mt-28">
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
                                <h3 className="mt-4 text-gray-800 text-sm">
                                    {product.name}
                                </h3>
                                <p className="text-red-600">★★★★★</p>
                                <a className="text-red-600 text-sm font-medium">
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
    },
);

export default SimilarProducts;
