import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

import { Link } from "react-router-dom";
import instance from "@/configs/axios";
import { useQuery } from "@tanstack/react-query";
import { Alert, Spin } from "antd";
interface Banner {
    imageBanner: string;
    title: string;
    description: string;
}
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

    const {
        data: banners,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["banners"],
        queryFn: async () => {
            try {
                const response = await instance.get("banners", {});
                return response.data;
            } catch (error) {
                throw new Error("Lỗi khi tải danh sách banner");
            }
        },
    });

    if (isLoading) {
        return (
            <div style={{ textAlign: "center", padding: "20px" }}>
                <Spin size="large" tip="Đang tải dữ liệu..." />
            </div>
        );
    }

    if (isError) {
        return (
            <div style={{ margin: "20px 0" }}>
                <Alert
                    message="Lỗi khi tải danh sách banner"
                    type="error"
                    showIcon
                />
            </div>
        );
    }

    return (
        <div className="slider-container lg:-mt-[160px]">
            <Slider {...settings}>
                {banners?.data?.map((banner: Banner, index: number) => (
                    <div key={index} className="relative">
                        <img
                            src={banner.imageBanner}
                            alt={banner.title}
                            className="w-full h-auto"
                        />
                        <div className="absolute left-0 top-0 bottom-0 flex flex-col px-[15px] lg:justify-center">
                            <h2 className="text-white text-[73px] mx-auto font-normal mt-0 mr-[10%] mb-[25px] ml-[15%]">
                                {banner.title}
                            </h2>
                            <div className="mt-0 mr-[10%] mb-[25px] ml-[15%]">
                                <p className="text-white mb-[25px]">
                                    {banner.description}
                                </p>
                            </div>
                            <div className="mt-0 mr-[10%] mb-[25px] ml-[15%]">
                                <Link to={"/"}>
                                    <button className="bg-[#d82253] text-white py-[18px] px-[16px]">
                                        KHÁM PHÁ NGAY
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default Banner;
