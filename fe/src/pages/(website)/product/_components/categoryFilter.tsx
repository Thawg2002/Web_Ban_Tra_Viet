import type { RadioChangeEvent } from "antd";
import { Col, InputNumber, Radio, Row, Slider } from "antd";
import { useState } from "react";

type Props = {
    category: any[];
    onchangeCategories: (
        categoryId: string | null,
        price: number,
        categoryName: string,
        categoryDescription: string
    ) => void;
    onScrollToProductList: () => void;
};

const CategoryFilter = ({
    category,
    onchangeCategories,
    onScrollToProductList,
}: Props) => {
    const [valueCategory, setValueCategory] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState<number>(0);
    const [selectedCategoryName, setSelectedCategoryName] =
        useState<string>("Trà Xanh");
    const [selectedCategoryDescription, setSelectedCategoryDescription] =
        useState<string>("");

    const onChangeCategory = (e: RadioChangeEvent) => {
        const selectedId = e.target.value;
        setValueCategory(selectedId);
        const selectedCategory = category.find(
            (item) => item._id === selectedId,
        );
        if (selectedCategory) {
            setSelectedCategoryName(selectedCategory.name);
            setSelectedCategoryDescription(selectedCategory.description || "");
        }
    };

    const onChangePrice = (newValue: number) => {
        setInputValue(newValue);
    };

    const onHandleApply = () => {
        console.log("Applying filter:", {
            categoryId: valueCategory,
            price: inputValue,
            categoryName: selectedCategoryName,
            categoryDescription: selectedCategoryDescription,
        });
        onchangeCategories(valueCategory, inputValue, selectedCategoryName, selectedCategoryDescription);
        onScrollToProductList();
    };

    const onHandleClearFilter = () => {
        setValueCategory(null);
        setInputValue(0);
        setSelectedCategoryName("Trà Xanh");
        setSelectedCategoryDescription("");
        onchangeCategories(null, 0, "Trà Xanh", "");
    };

    return (
        <div className="md:w-1/6 p-4">
            <h2 className="font-semibold text-lg">DANH MỤC SẢN PHẨM</h2>
            <Radio.Group onChange={onChangeCategory} value={valueCategory}>
                <ul className="mt-4 space-y-2">
                    {category?.map((item: any) => (
                        <li
                            key={item._id}
                            className="flex items-center justify-between"
                        >
                            <Radio
                                className="text-base font-normal"
                                value={item._id}
                            >
                                {item.name}
                            </Radio>
                            <span className="text-gray-600">{item.count}</span>
                        </li>
                    ))}
                </ul>
            </Radio.Group>
            <div className="mt-8">
                <h3 className="font-semibold text-lg">KHOẢNG GIÁ TUỲ CHỌN</h3>
                <div className="mt-4">
                    <Row>
                        <Col span={12}>
                            <Slider
                                min={0}
                                max={1000000}
                                onChange={onChangePrice}
                                value={
                                    typeof inputValue === "number"
                                        ? inputValue
                                        : 0
                                }
                            />
                        </Col>
                        <Col span={4}>
                            <InputNumber
                                min={1}
                                max={1000000}
                                value={inputValue}
                                onChange={onChangePrice}
                            />
                        </Col>
                    </Row>
                    <div className="flex space-x-4">
                        <button
                            className="mt-4 bg-red-600 text-white py-2 px-4 rounded text-xs md:text-base"
                            onClick={onHandleApply}
                        >
                            LỌC
                        </button>
                        <button
                            className="bg-[#FFBE98] rounded text-sm leading-[21px] text-[#fff] mt-4 h-10 px-8"
                            onClick={onHandleClearFilter}
                        >
                            XÓA
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryFilter;
