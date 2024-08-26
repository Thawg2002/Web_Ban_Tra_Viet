import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

import {
    banner_am_chen,
    banner_banh_trung_thu_4,
    banner_qua_tang_doanh_nghiep,
} from "@/assets/img";
import { Link } from "react-router-dom";
const Banner = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        autoplay: true,
        autoplaySpeed: 3000,
        slidesToShow: 1,
        slidesToScroll: 1,
    };
    return (
        <div className="slider-container lg:-mt-[160px] ">
            <Slider {...settings}>
                <div className="relative">
                    <img src={`${banner_am_chen}`} alt="" />
                    <div className="absolute left-0 top-0 bottom-0 flex flex-col  px-[15px] lg:justify-center ">
                        <h2 className="text-white text-[73px] mx-auto font-normall mt-0 mr-[10%] mb-[25px] ml-[15%] ">
                            Trà của những bậc thầy
                        </h2>
                        <div className="mt-0 mr-[10%] mb-[25px] ml-[15%] ">
                            <p className="text-white mb-[25px] ">
                                Được chọn lựa bởi Champion of Tea Master Cup
                                Vietnam
                            </p>
                        </div>
                        <div className="mt-0 mr-[10%] mb-[25px] ml-[15%] ">
                            <Link to={""}>
                                <button className="bg-[#d82253] text-white py-[18px] px-[16px]  ">
                                    KHÁM PHÁ TRÀ
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="relative">
                    <img src={`${banner_banh_trung_thu_4}`} alt="" />
                    <div className="absolute right-0 top-0 bottom-0 flex flex-col px-[15px] lg:justify-center lg:items-end">
                        <h2 className="text-[#000] text-[73px] mx-auto font-normall mt-0 mr-[10%] mb-[25px] ml-[15%] md:text-end">
                            Bánh Trung Thu 2024
                        </h2>
                        <div className="mt-0 mr-[10%] mb-[25px] ml-[15%] ">
                            <p className="text-[#000] mb-[25px] ">
                                In logo thương hiệu , đăng ký miễn phí
                            </p>
                        </div>
                        <div className="mt-0 mr-[10%] mb-[25px] ml-[15%] ">
                            <Link to={""}>
                                <button className="bg-[#d82253] text-white py-[18px] px-[16px]  ">
                                    HIỂU THÊM
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </Slider>
        </div>
    );
};

export default Banner;
