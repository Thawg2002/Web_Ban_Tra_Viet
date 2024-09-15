import {
    dinh_ngoc_dung,
    gioi_thieu_tra1,
    gioi_thieu_tra2,
    mong_kieu,
    phu_bw,
    thanh_huyen,
} from "@/assets/img";
import React from "react";

const AboutPage = () => {
    return (
        <div className="bg-white text-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                    Dẫn đầu thị trường trà quà tặng cao cấp
                </h1>
                <div className="mt-4 text-red-500 uppercase tracking-wide font-semibold">
                    Về chúng tôi, Trà Việt
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6 text-gray-700">
                    <div>
                        <p>
                            Ngày chúng tôi bắt đầu, những năm 2000, trà vốn chỉ
                            là sản phẩm tiêu dùng không thiết yếu, đơn điệu về
                            chủng loại và không đầu tư về chất lượng. Trà vốn là
                            sản phẩm truyền thống rất được yêu quý, nhưng người
                            ta lại không thể tìm kiếm được một sản phẩm hoàn hảo
                            từ chất lượng đến mẫu mã.
                        </p>
                        <p className="mt-4">
                            Trà Việt ra đời để giải quyết bài toán đó bằng 3 thế
                            mạnh của mình: Chuyên gia trà (Tea master), Thiết kế
                            xuất sắc (Packaging design) và Thiết lập chuỗi cung
                            ứng. Tea master của chúng tôi khai thác các vùng trà
                            rộng khắp từ Bảo Lộc, Thái Nguyên đến vùng trà hiếm
                            shan tuyết cổ thụ Tây Bắc. Hàng chục loại trà mới
                            lần lượt ra đời. Đội ngũ thiết kế xuất sắc thiết kế
                            ra các mẫu hộp quà dần định hình nên thị trường với
                            vẻ đẹp chuẩn mực và trang trọng. Hệ thống showroom
                            có mặt đầy đủ 3 vùng TP. HCM, Hà Nội, Hội An – Đà
                            Nẵng tạo nên trải nghiệm khách hàng tuyệt vời nhất.
                        </p>
                    </div>
                    <div>
                        <p>
                            Từng bước, không chỉ người yêu trà, các doanh nghiệp
                            cũng đặt niềm tin cho những đơn hàng quà tặng, đặc
                            biệt là quà tết và quà trung thu. Với cột mốc chinh
                            phục hàng trăm thương hiệu nổi tiếng, đã xác lập vị
                            trí số 1 của Trà Việt trên thị trường. Những tên
                            tuổi đình đám như Pfizer, Samsung, Mobifone, MB
                            Bank, Toyota, Canon, PwC, Metropole Hotel Hanoi,
                            Bosch, FPT, Techcombank, Boehringer, ANZ, Yola,
                            Viettel …
                        </p>
                        <p className="mt-4">
                            Chúng tôi cho rằng kinh tế Việt Nam đang chuyển mình
                            mạnh mẽ, trong đó, những ngành nghề truyền thống cần
                            thay đổi bằng cách sáng tạo mô hình kinh doanh mới
                            mẻ, và thị trường toàn cầu là những chuyển phiêu lưu
                            đầy thú vị, đáng thử thách. Trà Việt đang từng ngày
                            trên con đường này.
                        </p>
                    </div>
                </div>
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-8">
                    <img
                        src={phu_bw}
                        alt="Chairman"
                        className="rounded-full w-24 h-24 sm:w-12 sm:h-12"
                    />
                    <div>
                        <p className="text-gray-900 font-semibold">
                            Đinh Minh Phú –{" "}
                            <span className="font-normal">
                                Founder, Chairman
                            </span>
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex flex-col md:flex-row justify-center items-center gap-10">
                <img
                    className="w-full md:w-[700px] md:h-[430px] object-cover"
                    src={gioi_thieu_tra1}
                    alt=""
                />
                <img
                    className="w-full md:w-[700px] object-cover"
                    src={gioi_thieu_tra2}
                    alt=""
                />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-red-500 uppercase tracking-wide font-semibold">
                    Cam kết sứ mệnh
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4">
                    Trà ngon và quà đẹp
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 text-gray-700">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Trà ngon phát triển vì giác người yêu trà
                        </h2>
                        <p className="mt-4">
                            Chúng ta có một nền văn hoá trà lâu đời, nhưng trước
                            đây, người Việt Nam chúng ta đa phần chỉ còn uống
                            trà móc câu Thái Nguyên và trà hương Bảo Lộc.
                        </p>
                        <p className="mt-4">
                            Chúng tôi muốn mang đến những loại trà ngon hơn,
                            phong phú về hương vị và chủng loại.
                        </p>
                        <p className="mt-4">
                            Chúng tôi làm điều đó bằng cách phát triển các vùng
                            nguyên liệu quý giá khắp Việt Nam, cùng với những
                            quy trình chế biến tinh tế hơn.
                        </p>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Món quà trang trọng – Kết nối những mối quan hệ tử
                            tế qua nghệ thuật thưởng trà
                        </h2>
                        <p className="mt-4">
                            Tìm kiếm, phát triển và thắt chặt các mối quan hệ
                            chất lượng là công việc phải có trong mọi hành trình
                            đi đến thành công và hạnh phúc trên đời.
                        </p>
                        <p className="mt-4">
                            Với vai trò “kết nối” sẵn có của nghệ thuật thưởng
                            trà, chúng tôi biết mình phải làm được nhiều hơn
                            bằng những món quà chỉnh chu, trang trọng, và đầy tự
                            hào với thương hiệu của khách hàng. Bởi khi món quà
                            được trao đi, chúng tôi phải làm cho thương hiệu của
                            khách hàng rạng rỡ hơn.
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-red-500 uppercase tracking-wide font-semibold">
                    Bản lĩnh
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4">
                    Tại sao chúng tôi làm được
                </h1>
                <p className="text-lg text-gray-700 mt-4">
                    Để tạo nên những sản phẩm trà với hương vị sành sỏi trong
                    những hộp quà tặng đẹp đẽ nhất, chúng tôi phải phát triển
                    cho mình những bản lĩnh tiên phong và vượt trội
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-12 text-gray-700">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Đội ngũ Tea Master
                        </h2>
                        <p className="mt-4">
                            Những đầu bếp giỏi phải giữ vai trò dẫn dắt vị giác
                            của thực khách, và chúng tôi cũng tin chỉ những Tea
                            Master thực sự mới dẫn dắt được trải nghiệm của
                            người sành trà. Chúng tôi phát triển đội ngũ chuyên
                            biệt và đam mê ngay từ ngày đầu cho đến tận bây giờ.
                            Vai trò của họ là định hướng cho toàn bộ các loại
                            trà của Trà Việt.
                        </p>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Đội ngũ Thiết kế đẳng cấp
                        </h2>
                        <p className="mt-4">
                            Vẻ đẹp bên ngoài luôn là dấu ấn đầu tiên của Quà
                            Tặng. Chúng ta phải chinh phục người nhận quà ngay
                            từ cái nhìn đầu tiên. Không chỉ phát triển một đội
                            ngũ thiết kế đẳng cấp, chúng tôi còn xây dựng những
                            nguyên tắc về thiết kế, nguyên tắc về chất liệu và
                            nguyên tắc về chế tác. Đảm bảo món quà đầy ấn tượng
                            với người nhận.
                        </p>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Chuỗi cung ứng toàn quốc
                        </h2>
                        <p className="mt-4">
                            Chuỗi cung ứng rộng, co giãn và đáng tin cậy để phục
                            vụ những khách hàng quà tặng doanh nghiệp. Chúng tôi
                            hiểu rằng ngoài việc tạo ra những món quà ấn tượng,
                            chúng tôi còn phải làm nhẹ gánh cho bộ phận
                            marketing và mua sắm quà tặng của những khách hàng
                            doanh nghiệp. Chúng tôi xây dựng hệ thống cung ứng
                            mạnh đủ đảm bảo làm tốt hơn điều khách hàng của
                            chúng tôi có thể mong đợi: bộ quà tặng hoàn thiện,
                            đồng tiến độ, giao nhận tận nơi.
                        </p>
                    </div>
                </div>
            </div>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-red-500 uppercase tracking-wide font-semibold">
                    Our Team
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mt-4">
                    Phía sau Trà Việt
                </h1>
                <div className="flex flex-wrap justify-center gap-10 mt-10">
                    <div className="text-center max-w-xs">
                        <img
                            src={phu_bw}
                            alt="Đinh Minh Phú"
                            className="w-32 h-32 mx-auto rounded-full object-cover mb-4 sm:w-40 sm:h-40 lg:w-48 lg:h-48"
                        />
                        <h3 className="text-xl font-semibold text-gray-800">
                            Đinh Minh Phú
                        </h3>
                        <p className="text-gray-500 mb-2">Founder, CEO</p>
                        <p className="text-gray-600 italic">
                            “Sự ngưỡng mộ của thế giới bắt đầu từ lòng tự hào
                            của chúng ta”
                        </p>
                    </div>
                    <div className="text-center max-w-xs">
                        <img
                            src={mong_kieu}
                            alt="Trần Thị Mộng Kiều"
                            className="w-32 h-32 mx-auto rounded-full object-cover mb-4 sm:w-40 sm:h-40 lg:w-48 lg:h-48"
                        />
                        <h3 className="text-xl font-semibold text-pink-600">
                            Trần Thị Mộng Kiều
                        </h3>
                        <p className="text-gray-500 mb-2">
                            Co-Founder, Tea Master
                        </p>
                        <p className="text-gray-600 italic">
                            “Trong trà có cả sự trải nghiệm của Khổng Tử, cái
                            ung dung của Lão Tử và cả tính minh triết của đức
                            Thích Ca”
                        </p>
                    </div>
                    <div className="text-center max-w-xs">
                        <img
                            src={dinh_ngoc_dung}
                            alt="Đinh Ngọc Dũng"
                            className="w-32 h-32 mx-auto rounded-full object-cover mb-4 sm:w-40 sm:h-40 lg:w-48 lg:h-48"
                        />
                        <h3 className="text-xl font-semibold text-gray-800">
                            Đinh Ngọc Dũng
                        </h3>
                        <p className="text-gray-500 mb-2">
                            Co-Founder, Chief Designer
                        </p>
                        <p className="text-gray-600 italic">
                            “Vẻ quyến rũ kinh điển bắt đầu từ bố cục và cảm xúc
                            chất liệu”
                        </p>
                    </div>
                    <div className="text-center max-w-xs">
                        <img
                            src={thanh_huyen}
                            alt="Đinh Nguyễn Thanh Huyền"
                            className="w-32 h-32 mx-auto rounded-full object-cover mb-4 sm:w-40 sm:h-40 lg:w-48 lg:h-48"
                        />
                        <h3 className="text-xl font-semibold text-gray-800">
                            Đinh Nguyễn Thanh Huyền
                        </h3>
                        <p className="text-gray-500 mb-2">Tea-Trainer</p>
                        <p className="text-gray-600 italic">
                            “Tôi muốn 'nhìn' thấy hương vị trà trong vòm họng
                            của mình”
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
