import useCart from "@/common/hooks/useCart";
import instance from "@/configs/axios";
import { getConfig } from "@/services/cart";
import React, { useState, useEffect, useMemo } from "react";
import { AiFillContainer } from "react-icons/ai";
import { FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { Alert, Spin } from "antd";
const CheckoutPage = () => {
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState("");
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [user, setUser] = useState({
        userId: "",
        fullName: "",
        address: "",
        city: "",
        phone: "",
        email: "",
    });
    const [userPaypal, setUserPaypal] = useState({
        userId: "",
        fullName: "",
        address: "",
        city: "",
        phone: "",
        email: "",
    });
    useEffect(() => {
        if (user) {
            setUserPaypal(user);
        }
    }, [user]);
    console.log("user", user);
    console.log("userPaypal", userPaypal);
    const initialOptions = {
        clientId: "test",
        currency: "USD",
        intent: "capture",
    };
    const {
        cart,
        isLoading,
        isError,
        error,
        decreaseQuantity,
        increaseQuantity,
        removeItem,
    } = useCart(user?.userId);
    const listchecked =
        cart?.cart?.cartData?.products?.filter((product) =>
            selectedProducts.some(
                (selected) => selected.productId === product.productId,
            ),
        ) || [];

    const totalPriceChecked = useMemo(() => {
        if (!selectedProducts.length) {
            console.log("No items in the cart.");
            return 0;
        }

        console.log("Selected products:", selectedProducts);
        const result = selectedProducts.reduce((total: any, item: any) => {
            return total + (item.price || 0) * (item.quantity || 1);
        }, 0);
        console.log("Total Price Checked:", result);
        return result;
    }, [selectedProducts]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        console.log("Payment Method:", paymentMethod); // Thêm dòng này để kiểm tra giá trị paymentMethod

        if (listchecked.length === 0) {
            // toast.error("No items in the cart.");
            return;
        }

        const orderData = {
            userId: user.userId,
            items: selectedProducts.map((item: any) => ({
                productId: item.productId,
                quantity: item.quantity,
            })),
            totalPrice: totalPriceChecked,
            customerInfo: {
                fullName: user.fullName,
                address: user.address,
                city: user.city,
                phone: user.phone,
                email: user.email,
            },
            paymentMethod,
        };

        console.log(orderData);

        try {
            const response = await instance.post("orders", orderData);

            toast.success(`Đặt Hàng Thành Công`, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            console.log(response?.data);
            for (const item of listchecked) {
                await removeItem.mutateAsync({
                    userId: user.userId,
                    productIds: item.productId,
                });
            }
            setTimeout(() => {
                navigate("/order-success", {
                    state: {
                        orderNumber: response.data.orderNumber,
                        products: listchecked,
                        totalPrice: totalPriceChecked,
                    },
                });
            }, 3000);

            console.log(response.data.orderNumber);
        } catch (error) {
            console.error("Đặt hàng thất bại:", error);

            toast.error("Failed to create order.", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    const onSuccessPaypal = async (details: any, data: any) => {
        if (selectedProducts.length === 0) {
            return;
        }

        const orderData = {
            userId: user.userId,
            items: selectedProducts.map((item: any) => ({
                productId: item.productId,
                quantity: item.quantity,
            })),
            totalPrice: totalPriceChecked,
            customerInfo: {
                fullName: userPaypal?.fullName,
                address: userPaypal?.address,
                city: userPaypal?.city,
                phone: userPaypal?.phone,
                email: user.email,
            },
            paymentMethod: "bank transfer",
        };

        try {
            const response = await instance.post("orders", orderData);
            navigate("/order-success", {
                state: {
                    orderNumber: response.data.orderNumber,
                    products: selectedProducts, // Only selected products
                    totalPrice: totalPriceChecked,
                },
            });

            for (const item of selectedProducts) {
                await removeItem.mutateAsync({
                    userId: user.userId,
                    productIds: item.productId,
                });
            }
        } catch (error) {
            console.error("Order failed:", error);
        }
    };

    const addPaypalScript = async () => {
        try {
            const { data } = await getConfig();
            const script = document.createElement("script");
            script.type = "text/javascript";
            script.src = `https://www.paypal.com/sdk/js?client-id=${data}`;
            script.async = true;
            script.onload = () => {
                // setSdkReady(true);
            };
            document.body.appendChild(script);
        } catch (err) {
            console.error("Failed to load PayPal script:", err);
        }
    };

    useEffect(() => {
        addPaypalScript();
    }, []);
    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
            const userInfo = JSON.parse(user);
            setUser((prevFormData) => ({
                ...prevFormData,
                userId: userInfo._id,
                fullName: userInfo.fullName || prevFormData.fullName,
                email: userInfo.email || prevFormData.email,
            }));
        }

        // Đọc danh sách sản phẩm đã chọn từ localStorage
        const products = JSON.parse(
            localStorage.getItem("selectedProducts") || "[]",
        );
        setSelectedProducts(products);
    }, []);
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
    if (isError)
        return (
            <Alert message="Lỗi" description={isError} type="error" showIcon />
        );
    return (
        <div className="pt-[40px]">
            <ToastContainer />
            <div className="px-[20px]">
                <div className="px-[10px]">
                    <div className="text-center">
                        <h1 className="text-[#424242] text-[38px] md:text-[60px]">
                            ĐẶT HÀNG
                        </h1>
                        <div className="lg:flex lg:justify-center my-[10px] lg:my-[20px]">
                            <p className="font-semibold text-[#424242] lg:mx-[10px]">
                                <FaUserCircle className="inline mr-[10px]" />
                                Bạn đã có tài khoản ?
                            </p>
                            <Link to={"/login"}>
                                <p className="text-[#d82253] font-semibold text-[14px] mt-[3px] lg:mx-[10px]">
                                    ẤN VÀO ĐÂY ĐỂ ĐĂNG NHẬP
                                </p>
                            </Link>
                        </div>
                        <div className="lg:flex lg:justify-center my-[10px] lg:my-[20px]">
                            <p className="font-semibold text-[#424242] lg:mx-[10px]">
                                <AiFillContainer className="inline mr-[10px]" />
                                Bạn có mã ưu đãi ?
                            </p>
                            <Link to={"/discount"}>
                                <p className="text-[#d82253] font-semibold text-[14px] mt-[3px] lg:mx-[10px]">
                                    ẤN VÀO ĐÂY ĐỂ NHẬP MÃ ƯU ĐÃI
                                </p>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            {/* Thông tin */}{" "}
            <form onSubmit={handleSubmit}>
                <div className="lg:flex max-w-[1275px] mx-auto">
                    <div className="basis-3/5 px-[30px] lg:pr-[90px]">
                        <div>
                            {/* thông tin địa chỉ */}
                            <h1 className="text-[#424242] text-[16px] mt-[32px] mb-[24px] md:text-[23px]">
                                Thông tin thanh toán
                            </h1>
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <label
                                        htmlFor="firstName"
                                        className="text-[#424242] text-[14px] font-semibold"
                                    >
                                        HỌ TÊN
                                    </label>
                                    <input
                                        type="text"
                                        id="fullname"
                                        className="w-full py-[10px] px-[15px] mt-[5px] mb-[15px] border border-[#e5e5e5] rounded-md"
                                        placeholder="Nhập Họ & Tên"
                                        value={user.fullName}
                                        onChange={(e) =>
                                            setUser({
                                                ...user,
                                                fullName: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="country"
                                    className="text-[#424242] text-[14px] font-semibold"
                                >
                                    QUỐC GIA*
                                    <p className="py-[10px] mb-[15px]">
                                        VIỆT NAM
                                    </p>
                                </label>
                            </div>
                            <div>
                                <label
                                    htmlFor="address"
                                    className="text-[#424242] text-[14px] font-semibold"
                                >
                                    TỈNH/THÀNH - QUẬN/HUYỆN
                                </label>
                                <input
                                    type="text"
                                    id="city"
                                    className="w-full py-[10px] px-[15px] mt-[5px] mb-[15px] border border-[#e5e5e5] rounded-md"
                                    placeholder="Ví dụ Bắc Giang - Yên Dũng"
                                    value={user.city}
                                    onChange={(e) =>
                                        setUser({
                                            ...user,
                                            city: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="streetAddress"
                                    className="text-[#424242] text-[14px] font-semibold"
                                >
                                    ĐỊA CHỈ
                                </label>
                                <input
                                    type="text"
                                    id="address"
                                    className="w-full py-[10px] px-[15px] mt-[5px] mb-[15px] border border-[#e5e5e5] rounded-md"
                                    placeholder="Ví dụ: Thôn Mỹ Tượng, xã Lãng Sơn"
                                    value={user.address}
                                    onChange={(e) =>
                                        setUser({
                                            ...user,
                                            address: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="phone"
                                    className="text-[#424242] text-[14px] font-semibold"
                                >
                                    SỐ ĐIỆN THOẠI
                                </label>
                                <input
                                    type="text"
                                    id="postalCode"
                                    className="w-full py-[10px] px-[15px] mt-[5px] mb-[15px] border border-[#e5e5e5] rounded-md"
                                    placeholder="Nhập Số điện thoại..."
                                    value={user.phone}
                                    onChange={(e) =>
                                        setUser({
                                            ...user,
                                            phone: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="email"
                                    className="text-[#424242] text-[14px] font-semibold"
                                >
                                    EMAIL
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    className="w-full py-[10px] px-[15px] mt-[5px] mb-[15px] border border-[#e5e5e5] rounded-md"
                                    value={user.email}
                                    onChange={(e) =>
                                        setUser({
                                            ...user,
                                            email: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>

                            <div className="mt-[20px]">
                                <label
                                    htmlFor="orderNote"
                                    className="text-[#424242] text-[14px] font-semibold"
                                >
                                    GHI CHÚ ĐƠN HÀNG (TÙY CHỌN)
                                </label>
                                <textarea
                                    id="orderNote"
                                    className="w-full py-[10px] px-[15px] mt-[5px] mb-[15px] border border-[#e5e5e5] rounded-md h-[100px]"
                                    placeholder="Ghi chú cho đơn hàng ví dụ về màu sắc, size, ..."
                                />
                            </div>
                        </div>
                    </div>
                    <div className="basis-2/5 max-h-[700px] px-[38px] pb-[30px] pt-[20px] mt-[40px] lg:px-[40px] bg-[#f1f1f1] *:font-medium *:text-[14px]">
                        {/* List checked products */}
                        <div className="flex justify-between py-[15px] border-b border-[#afafaf] *:text-[#424242]">
                            <h3>SẢM PHẨM</h3>
                            <h3>TẠM TÍNH</h3>
                        </div>
                        {selectedProducts.length > 0 ? (
                            selectedProducts.map((item: any, index: number) => (
                                <div
                                    key={index}
                                    className="flex justify-between py-[15px] border-b border-[#afafaf] *:text-[#424242]"
                                >
                                    <h3 className="text-[#000] font-normal capitalize">
                                        {item.name} x {item.quantity}
                                    </h3>
                                    <h3>
                                        {(
                                            item.price * (item.quantity || 1)
                                        ).toLocaleString("vi-VN")}{" "}
                                        đ
                                    </h3>
                                </div>
                            ))
                        ) : (
                            <div className="flex justify-center py-[15px]">
                                <h3>
                                    Không có sản phẩm nào được chọn để thanh
                                    toán
                                </h3>
                            </div>
                        )}

                        {/* Summary */}
                        <div className="grid grid-cols-2 pt-[40px] pb-[10px] *:text-[#424242]">
                            <div>
                                <h3>TẠM TÍNH</h3>
                            </div>
                            <div>
                                <h3>
                                    {totalPriceChecked.toLocaleString("vi-VN")}đ
                                </h3>
                            </div>
                        </div>

                        {/* <div className="grid grid-cols-2 py-[10px] *:text-[#424242]">
                            <div>
                                <h3>THUẾ VAT 8%</h3>
                            </div>
                            <div>
                                <h3>
                                    {(totalPriceChecked * 0.08).toLocaleString(
                                        "vi-VN",
                                    )}
                                    đ
                                </h3>
                            </div>
                        </div> */}
                        <div className="grid grid-cols-2 py-[10px] *:text-[#424242]">
                            <div>
                                <h3>TỔNG</h3>
                            </div>
                            <div>
                                <h3 className="text-[25px] font-semibold">
                                    {totalPriceChecked.toLocaleString("vi-VN")}đ
                                </h3>
                            </div>
                        </div>

                        {/* Payment methods */}
                        {/* <div className="flex justify-between py-[15px] border-b border-[#afafaf] *:text-[#424242]">
                            <h3>
                                <input type="checkbox" className="mr-[10px]" />
                                VÍ ZALO PAY
                            </h3>
                            <h3></h3>
                        </div>
                        <div className="flex justify-between py-[15px] border-b border-[#afafaf] *:text-[#424242]">
                            <h3>
                                <input type="checkbox" className="mr-[10px]" />
                                THANH TOÁN KHI NHẬN HÀNG
                            </h3>
                            <h3></h3>
                        </div> */}
                        <div>
                            <h3 className="text-[#424242] text-[14px] font-semibold mt-4">
                                PHƯƠNG THỨC THANH TOÁN
                            </h3>
                            <div className="flex items-center mt-2">
                                <input
                                    type="radio"
                                    id="bankTransfer"
                                    name="paymentMethod"
                                    value="bank transfer"
                                    checked={paymentMethod === "bank transfer"}
                                    onChange={(e) =>
                                        setPaymentMethod(e.target.value)
                                    }
                                    className="mr-2"
                                />
                                <label htmlFor="bankTransfer">
                                    Chuyển khoản ngân hàng
                                </label>
                            </div>
                            <div className="flex items-center mt-2">
                                <input
                                    type="radio"
                                    id="cashOnDelivery"
                                    name="paymentMethod"
                                    value="cash on delivery"
                                    checked={
                                        paymentMethod === "cash on delivery"
                                    }
                                    onChange={(e) =>
                                        setPaymentMethod(e.target.value)
                                    }
                                    className="mr-2"
                                />
                                <label htmlFor="cashOnDelivery">
                                    Thanh toán khi nhận hàng
                                </label>
                            </div>
                        </div>

                        <div className="pt-[30px]">
                            <p className="text-[12px] text-[#424242]">
                                Dữ liệu cá nhân của bạn sẽ được sử dụng để xử lý
                                đơn đặt hàng của bạn, hỗ trợ trải nghiệm của bạn
                                trên trang web này, và cho các mục đích khác
                                được mô tả trong chính sách riêng tư của chúng
                                tôi.
                            </p>
                            {paymentMethod === "bank transfer" ? (
                                <>
                                    <PayPalScriptProvider
                                        options={initialOptions}
                                    >
                                        <PayPalButtons
                                            createOrder={(data, actions) => {
                                                return actions.order.create({
                                                    purchase_units: [
                                                        {
                                                            amount: {
                                                                value: (
                                                                    totalPriceChecked *
                                                                    1.08
                                                                ).toFixed(2),
                                                            },
                                                        },
                                                    ],
                                                });
                                            }}
                                            onApprove={(data, actions: any) => {
                                                return actions.order
                                                    .capture()
                                                    .then((details: any) => {
                                                        onSuccessPaypal(
                                                            details,
                                                            data,
                                                        );
                                                    });
                                            }}
                                            onError={(err) => {
                                                alert(
                                                    "Thanh toán thất bại. Vui lòng thử lại.",
                                                );
                                                console.error(
                                                    "Lỗi thanh toán:",
                                                    err,
                                                );
                                            }}
                                        />
                                    </PayPalScriptProvider>
                                </>
                            ) : (
                                <>
                                    <button
                                        style={{
                                            backgroundColor: "rgb(216, 34, 83)",
                                        }}
                                        className="mt-[10px] w-full text-[#fff] pt-[18px] pb-[15px] px-[16px]"
                                    >
                                        ĐẶT HÀNG
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CheckoutPage;
