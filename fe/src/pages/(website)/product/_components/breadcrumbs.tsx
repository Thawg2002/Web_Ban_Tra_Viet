import React from "react";
import { useLocation, Link } from "react-router-dom";

// Định nghĩa ánh xạ cho các đường dẫn
const pathLabels = {
    products: "Trà Xanh",
    // Thêm các ánh xạ khác nếu cần
};

const Breadcrumbs = () => {
    const location = useLocation();
    const pathnames = location.pathname.split("/").filter((x) => x);

    const breadcrumbs = pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        // Lấy nhãn từ ánh xạ hoặc sử dụng giá trị gốc
        const label = pathLabels[value] || value;
        return { to, label };
    });

    return (
        <div className="flex-grow">
            <nav className="text-gray-500 text-xs">
                {breadcrumbs.length > 0 ? (
                    <>
                        <Link to="/" className="hover:text-gray-700">
                            TRANG CHỦ / CỬA HÀNG
                        </Link>
                        {breadcrumbs.map((breadcrumb, index) => (
                            <React.Fragment key={breadcrumb.to}>
                                {" /"}
                                <Link
                                    to={breadcrumb.to}
                                    className="mx-1 hover:text-gray-700"
                                >
                                    {breadcrumb.label.toUpperCase()}
                                </Link>
                            </React.Fragment>
                        ))}
                    </>
                ) : (
                    <span>TRANG CHỦ</span>
                )}
            </nav>
        </div>
    );
};

export default Breadcrumbs;
