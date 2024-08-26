import {
    kinh_doanh_tra_viet,
    logo_amazon,
    logo_bo_cong_thuong,
    logo_lazada,
    logo_shoppe,
    zalo_image
} from "@/assets/img";
const Footer = () => {
    return (
        <footer className="bg-[#efefef] pt-[80px] pb-[30px] text-[#868686] mt-[20px]">
            <div className="px-[50px] lg:grid lg:grid-cols-4 *:mt-[50px] *:lg:mt-[0px]">
                <div className="px-[10px] ">
                    <h1 className="mb-[10px]">Hotline đặt hàng</h1>
                    <p className="mb-[10px] text-[30px]">0987-6666-8888</p>
                    <img
                        src={zalo_image}
                        alt=""
                        className="max-w-[150px] mb-[30px]"
                    />
                    <img
                        src={kinh_doanh_tra_viet}
                        alt=""
                        className="max-w-[250px]"
                    />
                </div>
                <div className="px-[10px] ">
                    <h1 className="text-[18px] mb-[20px]">
                        Hệ thống cửa hàng :
                    </h1>
                    <div>
                        <h2 className="font-semibold text-[18px] mb-[20px]">
                            TP.HỒ CHÍ MINH
                        </h2>
                        <p className="mb-[20px] text-[15px]">
                            19 Hải Triều, Bến Tre, quận 1 <br />
                            ĐT: 0987-6666-8888 <br />
                            giờ mở cửa : 9:00 - 21:00 <br />
                        </p>
                    </div>
                    <div>
                        <h2 className="font-semibold text-[18px] mb-[20px]">
                            HÀ NỘI
                        </h2>
                        <p className="mb-[20px] text-[15px]">
                            19 Hải Triều, Bến Tre, quận 1 <br />
                            ĐT: 0987-6666-8888 <br />
                            giờ mở cửa : 9:00 - 21:00 <br />
                        </p>
                    </div>
                    <div>
                        <h2 className="font-semibold text-[18px] mb-[20px]">
                            ĐÀ NẴNG
                        </h2>
                        <p className="mb-[20px] text-[15px]">
                            19 Hải Triều, Bến Tre, quận 1 <br />
                            ĐT: 0987-6666-8888 <br />
                            giờ mở cửa : 9:00 - 21:00 <br />
                        </p>
                    </div>
                </div>
                <div className="px-[10px] ">
                    <h1 className="text-[18px] mb-[20px]">
                        Có trên các sàn TMĐT
                    </h1>
                    <img src={logo_amazon} alt="" className="max-w-[150px]" />
                    <img src={logo_lazada} alt="" className="max-w-[150px]" />
                    <img src={logo_shoppe} alt="" className="max-w-[150px]" />
                    <img
                        src={logo_bo_cong_thuong}
                        alt=""
                        className="max-w-[150px]"
                    />
                </div>
                <div className="px-[10px] *:font-semibold *:mb-[10px]  ">
                    <p>Trà Việt Rewards</p>
                    <p>Giao hàng đổi trả </p>
                    <p>Điều khoản chung</p>
                    <p>Chính sách bảo mật</p>
                    <p>Tuyển dụng</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
