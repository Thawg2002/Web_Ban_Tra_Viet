import React from "react";
import { AiFillContainer } from "react-icons/ai";
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const CheckoutPage = () => {
    return (
        <div className="pt-[40px]">
            <div className="px-[20px]">
                <div className="px-[10px]">
                    <div className="text-center">
                        <h1 className="text-[#424242] text-[38px] md:text-[60px]">
                            ĐẶT HÀNG
                        </h1>
                        <div className="lg:flex lg:justify-center my-[10px] lg:my-[20px]">
                            <p className="font-semibold  text-[#424242] lg:mx-[10px]">
                                <FaUserCircle className="inline mr-[10px]" />
                                Bạn đã có tài khoản ?
                            </p>{" "}
                            <Link to={""}>
                                <p className="text-[#d82253] font-semibold  text-[14px] mt-[3px] lg:mx-[10px] ">
                                    ẤN VÀO ĐÂY ĐỂ ĐĂNG NHẬP
                                </p>
                            </Link>
                        </div>
                        <div className="lg:flex lg:justify-center  my-[10px] lg:my-[20px] ">
                            <p className="font-semibold  text-[#424242] lg:mx-[10px]">
                                <AiFillContainer className="inline mr-[10px]" />
                                Bạn có mã ưu đãi ?
                            </p>{" "}
                            <Link to={""}>
                                <p className="text-[#d82253] font-semibold  text-[14px] mt-[3px] lg:mx-[10px] ">
                                    ẤN VÀO ĐÂY ĐỂ NHẬP MÃ ƯU ĐÃI
                                </p>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            {/* Thông tin */}
            <div className="lg:flex max-w-[1275px] mx-auto ">
                <div className="basis-3/5 px-[30px] lg:pr-[90px]">
                    <div className="">
                        {/* thông tin địa chỉ */}
                        <h1 className="text-[#424242] text-[16px] mt-[32px] mb-[24px] md:text-[23px] ">
                            Thông tin thanh toán
                        </h1>
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <label
                                    htmlFor="name"
                                    className="text-[#424242] text-[14px] font-semibold"
                                >
                                    TÊN
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    className="w-full py-[10px] px-[15px] mt-[5px] mb-[15px] border border-[#e5e5e5] rounded-md"
                                    placeholder="Tên đệm + Tên"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="name"
                                    className="text-[#424242] text-[14px] font-semibold"
                                >
                                    HỌ
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    className="w-full py-[10px] px-[15px] mt-[5px] mb-[15px] border border-[#e5e5e5] rounded-md"
                                    placeholder="Họ"
                                />
                            </div>
                        </div>
                        <div>
                            <label
                                htmlFor="name"
                                className="text-[#424242] text-[14px] font-semibold"
                            >
                                TÊN CÔNG TY (TÙY CHỌN)
                            </label>
                            <input
                                type="text"
                                id="name"
                                className="w-full py-[10px] px-[15px] mt-[5px] mb-[15px] border border-[#e5e5e5] rounded-md"
                                placeholder="Nếu bạn mua cho công ty "
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="name"
                                className="text-[#424242] text-[14px] font-semibold"
                            >
                                QUỐC GIA*
                                <p className="py-[10px]   mb-[15px]">
                                    VIỆT NAM
                                </p>
                            </label>
                        </div>
                        <div>
                            <label
                                htmlFor="name"
                                className="text-[#424242] text-[14px] font-semibold"
                            >
                                TỈNH/THÀNH -QUẬN/HUYỆN
                            </label>
                            <input
                                type="text"
                                id="name"
                                className="w-full py-[10px] px-[15px] mt-[5px] mb-[15px] border border-[#e5e5e5] rounded-md"
                                placeholder="Ví dụ Hà Nội - Cầu Giấy"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="name"
                                className="text-[#424242] text-[14px] font-semibold"
                            >
                                ĐỊA CHỈ
                            </label>
                            <input
                                type="text"
                                id="name"
                                className="w-full py-[10px] px-[15px] mt-[5px] mb-[15px] border border-[#e5e5e5] rounded-md"
                                placeholder="Ví dụ : Số 1, ngõ 1, phố 1"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="name"
                                className="text-[#424242] text-[14px] font-semibold"
                            >
                                SỐ ĐIỆN THOẠI
                            </label>
                            <input
                                type="text"
                                id="name"
                                className="w-full py-[10px] px-[15px] mt-[5px] mb-[15px] border border-[#e5e5e5] rounded-md"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="name"
                                className="text-[#424242] text-[14px] font-semibold"
                            >
                                EMAIL
                            </label>
                            <input
                                type="text"
                                id="name"
                                className="w-full py-[10px] px-[15px] mt-[5px] mb-[15px] border border-[#e5e5e5] rounded-md"
                            />
                        </div>{" "}
                        <div>
                            <input
                                type="checkbox"
                                id="name"
                                className="text-[20px] py-[10px] px-[15px] mt-[10px] mb-[15px] mr-[10px] border border-[#e5e5e5] rounded-md"
                            />
                            <label
                                htmlFor="name"
                                className="text-[#424242] text-[14px] font-semibold"
                            >
                                TẠO TÀI KHOẢN MỚI?
                            </label>
                        </div>{" "}
                        <div>
                            <input
                                type="checkbox"
                                id="name"
                                className="text-[20px] py-[10px] px-[15px] mt-[10px] mb-[15px] mr-[10px] border border-[#e5e5e5] rounded-md"
                            />
                            <label
                                htmlFor="name"
                                className="text-[#424242] text-[14px] font-semibold"
                            >
                                GIAO HÀNG TỚI ĐỊA CHỈ KHÁC?
                            </label>
                        </div>
                        <div className="mt-[20px]">
                            <label
                                htmlFor="name"
                                className="text-[#424242] text-[14px] font-semibold"
                            >
                                GHI CHÚ ĐƠN HÀNG(TÙY CHỌN)
                            </label>
                            <textarea
                                id="name"
                                className="w-full py-[10px] px-[15px] mt-[5px] mb-[15px] border border-[#e5e5e5] rounded-md h-[100px]"
                                placeholder="Ghi chú cho đơn hàng ví dụ về màu sắc, size, ..."
                            />
                        </div>{" "}
                    </div>
                </div>
                <div className="basis-2/5 max-h-[700px] px-[38px] pb-[30px] pt-[20px] mt-[40px] lg:px-[40px]  bg-[#f1f1f1] *:font-medium *:text-[14px] ">
                    {/* giá tiền */}
                    <div className="flex justify-between py-[15px] border-b border-[#afafaf] *:text-[#424242]">
                        <h3>SẢM PHẨM</h3>
                        <h3>TẠM TÍNH</h3>
                    </div>
                    <div className="flex justify-between py-[15px] border-b border-[#afafaf] *:text-[#424242] ">
                        <h3 className="text-[#000] font-normal">
                            Bộ bách trà niên <strong>x1</strong>
                        </h3>
                        <h3>645.000đ</h3>
                    </div>
                    <div className="grid grid-cols-2 pt-[40px] pb-[10px] *:text-[#424242]">
                        <div>
                            <h3>TẠM TÍNH</h3>
                        </div>
                        <div>
                            <h3>645.000đ</h3>
                        </div>
                    </div>
                    <div className="grid grid-cols-2  py-[10px] *:text-[#424242]">
                        <div>
                            <h3>THUẾ VAT 8%</h3>
                        </div>
                        <div>
                            <h3>51.000đ</h3>
                        </div>
                    </div>
                    <div className="grid grid-cols-2  py-[10px] *:text-[#424242]">
                        <div>
                            <h3>TỔNG</h3>
                        </div>
                        <div>
                            <h3 className="text-[25px] font-semibold">
                                51332.000đ
                            </h3>
                        </div>
                    </div>
                    <div className="flex justify-between py-[15px] border-b border-[#afafaf] *:text-[#424242]">
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
                    </div>
                    <div className="pt-[30px]">
                        <p className="text-[12px] text-[#424242]">
                            Dữ liệu cá nhân của bạn sẽ được sử dụng để xử lý đơn
                            đặt hàng của bạn, hỗ trợ trải nghiệm của bạn trên
                            trang web này, và cho các mục đích khác được mô tả
                            trong chính sách riêng tư của chúng tôi.
                        </p>
                        <button
                            style={{ backgroundColor: "rgb(216, 34, 83)" }}
                            className="mt-[10px] w-full text-[#fff] pt-[18px] pb-[15px] px-[16px]"
                        >
                            ĐẶT HÀNG
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
