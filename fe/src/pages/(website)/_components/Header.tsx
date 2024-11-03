import { logo_traviet, logo_traviet_main, tra_o_long } from "@/assets/img";
import { useAuth } from "@/common/hooks/useAuth";
import useCart from "@/common/hooks/useCart";
import { Dropdown, MenuProps } from "antd";
import { Space } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
    AiFillCaretDown,
    AiFillCaretUp,
    AiOutlineUserDelete,
} from "react-icons/ai";
import { CiMenuBurger, CiSearch } from "react-icons/ci";
import { FaRegUserCircle, FaUser } from "react-icons/fa";
import { IoCartOutline, IoCloseCircleSharp } from "react-icons/io5";
import { useMediaQuery } from "react-responsive";
import { Link, useLocation, useNavigate } from "react-router-dom";
import UserAction from "./UserAction";

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [menuMoblie, setMenuMoblie] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { isLoggedIn } = useAuth();
    // Hiệu ứng giỏ hàng
    const [isCartOpen, setIsCartOpen] = useState(false); // Ví dụ
    const [isVisible, setIsVisible] = useState(false); // Ví dụ
    const location = useLocation();
    const navigate = useNavigate();

    const handleCartClick = () => {
        if (window.innerWidth <= 768) {
            // Giả sử 768px là breakpoint cho responsive
            navigate("/cart");
        } else {
            toggleCart();
        }
    };

    useEffect(() => {
        if (isCartOpen) {
            setTimeout(() => setIsVisible(true), 10);
        } else {
            setIsVisible(false);
        }
    }, [isCartOpen]);

    useEffect(() => {
        // Đóng dropdown khi chuyển trang
        setIsCartOpen(false);
    }, [location]);

    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
    };
    //
    const isLargeScreen = useMediaQuery({ query: "(min-width: 1024px)" });
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);
    const logoToShow =
        isLargeScreen && !isScrolled ? logo_traviet : logo_traviet_main;
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : {};
    // Menu properties

    const handleLogout = () => {
        // Xóa thông tin người dùng khỏi localStorage
        localStorage.removeItem("user");

        // Điều hướng về trang đăng nhập và tải lại trang
        navigate("/login");
        window.location.reload(); // Tự động tải lại trang
    };

    const items: MenuProps["items"] = [
        {
            key: "1",
            label: (
                <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.antgroup.com"
                >
                    User information
                </a>
            ),
        },
        ...(user?.role == "admin"
            ? [
                  {
                      key: "2",
                      label: (
                          <Link to="/admin" rel="noopener noreferrer">
                              Quản trị Admin
                          </Link>
                      ),
                  },
              ]
            : []),
        {
            key: "4",
            danger: true,
            label: "Đăng xuất",
            onClick: handleLogout,
        },
        {
            key: "5",
            label: (
                <Link to="account/purchase" rel="noopener noreferrer">
                    Theo dõi đơn hàng
                </Link>
            ),
        },
    ];
    const { cart } = useCart(user?._id);
    const listchecked = cart?.cart?.cartData?.products || [];
    const totalPriceChecked = useMemo(() => {
        const result = listchecked?.reduce((total: any, item: any) => {
            return total + (item.price || 0) * (item.quantity || 1);
        }, 0);
        return result;
    }, [listchecked]);

    return (
        <header
            className={` ${isScrolled ? "bg-[#f6f6f6]" : "bg-transparent"} transition-colors duration-300`}
        >
            <div className="padding py-[10px]">
                <div className=" flex justify-between ">
                    <div className="flex">
                        {/* logo */}
                        <div className="">
                            <Link to={""}>
                                <img
                                    src={logoToShow}
                                    alt=""
                                    className={`${
                                        isLargeScreen && !isScrolled
                                            ? "lg:w-[80px] lg:h-[140px]"
                                            : "lg:w-[150px] lg:h-[40px]"
                                    } w-[117px] h-[30px] md:w-[150px] md:h-[40px]`}
                                />
                            </Link>
                        </div>
                        {/* menu */}
                        <div className="hidden lg:flex  items-center ml-4">
                            <ul className="flex lg:text-[14px] xl:text-[14px] font-semibold cursor-pointer">
                                <Link to={""}>
                                    <li className="mx-2 ">TRANG CHỦ</li>
                                </Link>
                                <Link to={""}>
                                    <li className="mx-2 relative group">
                                        CỬA HÀNG
                                        <ul className="absolute w-[250px] bg-white shadow-lg hidden group-hover:block p-3 text-[14px]">
                                            <li className=" px-4 py-2 hover:bg-gray-100 relative group/item">
                                                <Link to={"/tra"}>TRÀ</Link>
                                                <ul className="absolute left-full top-0 w-[250px] bg-white shadow-lg hidden group-hover/item:block font-normal ">
                                                    <li className="px-4 py-2 hover:bg-gray-100">
                                                        <Link to={"/products"}>
                                                            Trà xanh
                                                        </Link>
                                                    </li>
                                                    <li className="px-4 py-2 hover:bg-gray-100">
                                                        <Link
                                                            to={"/tra-thao-moc"}
                                                        >
                                                            Trà thảo mộc
                                                        </Link>
                                                    </li>
                                                </ul>
                                            </li>
                                            <li className="px-4 py-2 hover:bg-gray-100">
                                                <Link to={"/am-tra"}>
                                                    ẤM TRÀ
                                                </Link>
                                            </li>
                                            <li className="px-4 py-2 hover:bg-gray-100">
                                                <Link to={"/qua-tang"}>
                                                    QUÀ TẶNG
                                                </Link>
                                            </li>
                                        </ul>
                                    </li>
                                </Link>

                                <Link to={"/about"}>
                                    <li className="mx-2">GIỚI THIỆU</li>
                                </Link>
                                <Link to={""}>
                                    <li className="mx-2">TIN TỨC</li>
                                </Link>
                                <Link to={""}>
                                    <li className="mx-2">LIÊN HỆ</li>
                                </Link>
                            </ul>
                        </div>
                    </div>
                    {/* icon header */}
                    <div className="flex items-center gap-3 lg:gap-5">
                        <div className="relative">
                            <input
                                className="hidden lg:block border rounded-xl font-serif text-[16px] w-[200px] h-[40px] p-2 mr-2"
                                type="text"
                                placeholder="Tìm kiếm..."
                            />
                            <CiSearch className="hidden text-[24px] lg:block absolute top-0 right-0 mr-5 mt-2" />
                        </div>
                        <div className="relative">
                            <IoCartOutline
                                size={24}
                                className=" cursor-pointer"
                                onClick={handleCartClick}
                            />
                            {/* Cart Dropdown */}
                            {isCartOpen && (
                                <div
                                    className={`absolute right-0 mt-2 w-80 bg-pink-600 text-white rounded-xl shadow-xl p-4 transition-transform duration-500 ease-in-out transform ${
                                        isVisible
                                            ? "opacity-100 scale-x-100 scale-y-100"
                                            : "opacity-0 scale-x-0 scale-y-0"
                                    }`}
                                >
                                    {/* Hiển thị danh sách sản phẩm trong giỏ hàng */}
                                    {listchecked.length > 0 ? (
                                        listchecked.map((product: any) => (
                                            <div
                                                key={product._id}
                                                className="mb-4 flex items-center"
                                            >
                                                <img
                                                    src={
                                                        product.image ||
                                                        "default-image.png"
                                                    } // Thay đổi 'default-image.png' nếu cần
                                                    alt={product.name}
                                                    className="w-16 h-16 rounded-lg mr-4 object-cover"
                                                />
                                                <div>
                                                    <h2 className="font-normal text-xs leading-tight capitalize">
                                                        {product.name}
                                                    </h2>
                                                    <p className="mt-2 text-xs text-gray-200">
                                                        {product.quantity} x{" "}
                                                        {Number(
                                                            product.price,
                                                        ).toLocaleString()}{" "}
                                                        đ
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-center text-sm text-gray-200">
                                            Giỏ hàng của bạn trống.
                                        </p>
                                    )}

                                    <div className="border-t border-red-300 pt-4">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="font-bold text-base">
                                                Tổng số phụ:
                                            </span>
                                            <span className="font-bold text-base">
                                                {totalPriceChecked.toLocaleString()}{" "}
                                                đ
                                            </span>
                                        </div>

                                        {/* <Link to={`/checkout`}>
                                            <button className="w-full mt-3 bg-white text-red-600 font-medium text-sm py-2 px-4 rounded-lg transition duration-300 ease-in-out hover:bg-red-50">
                                                Thanh Toán
                                            </button>
                                        </Link> */}
                                        <Link to={`/cart`}>
                                            <button className="w-full mt-2 text-white font-medium text-base py-2 px-4 rounded-lg transition duration-300 ease-in-out hover:bg-red-500">
                                                Xem Giỏ Hàng
                                            </button>
                                        </Link>
                                    </div>
                                    <div className="mt-4 text-center text-sm text-red-100">
                                        Miễn phí giao hàng cho đơn trên
                                        1.000.000 đ
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Dropdown end  */}

                        <div className="">
                            {user?._id ? (
                                <>
                                    <UserAction />
                                </>
                            ) : (
                                <Link to={"/login"}>
                                    <span className=" cursor-pointer">
                                        <AiOutlineUserDelete size={24} />
                                    </span>{" "}
                                </Link>
                            )}
                        </div>

                        <CiMenuBurger
                            size={24}
                            className=" font-bold lg:hidden"
                            onClick={toggleMenu}
                        />
                    </div>
                </div>
                {/* màn hình phủ mờ khi bật menu moblie */}
                {menuOpen && (
                    <div
                        className="fixed inset-0 bg-gray-800  bg-opacity-50 z-40"
                        onClick={toggleMenu}
                    ></div>
                )}
                {/* menu moblie */}
                <div
                    className={`fixed top-0 right-0 h-full w-64 bg-white z-50 transform ${
                        menuOpen ? "translate-x-0" : "translate-x-full"
                    } transition-transform duration-400 ease-in-out`}
                >
                    <div className="flex justify-end">
                        <IoCloseCircleSharp
                            onClick={toggleMenu}
                            className="text-[25px] mr-[20px] mt-[20px] cursor-pointer"
                        />
                    </div>
                    <ul className="p-4 flex flex-col space-y-4 font-semibold text-[16px] cursor-pointer">
                        <Link to={""}>
                            <li>TRANG CHỦ</li>
                        </Link>
                        <Link to={""} className="flex justify-between">
                            <li>
                                CỬA HÀNG
                                {menuMoblie ? (
                                    <ul className="text-[13px]  cursor-pointer ml-2 *:mt-5">
                                        <li>
                                            <Link to={"/tra"}>TRÀ</Link>
                                            <ul className=" *:mt-2 font-normal">
                                                <li>
                                                    <Link to={"/products"}>
                                                        Trà xanh
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to={"/tra-thao-moc"}>
                                                        Trà thảo mộc
                                                    </Link>
                                                </li>
                                            </ul>
                                        </li>
                                        <li>
                                            <Link to={"/am-tra"}>ẤM TRÀ</Link>
                                        </li>
                                        <li>
                                            <Link to={"/qua-tang"}>
                                                QUÀ TẶNG
                                            </Link>
                                        </li>
                                    </ul>
                                ) : (
                                    ""
                                )}
                            </li>
                            <div>
                                {menuMoblie ? (
                                    <AiFillCaretUp
                                        onClick={() =>
                                            setMenuMoblie(!menuMoblie)
                                        }
                                    />
                                ) : (
                                    <AiFillCaretDown
                                        onClick={() =>
                                            setMenuMoblie(!menuMoblie)
                                        }
                                    />
                                )}
                            </div>
                        </Link>
                        <Link to={`/about`}>
                            <li>GIỚI THIỆU</li>
                        </Link>
                        <Link to={""}>
                            <li>TIN TỨC</li>
                        </Link>
                        <Link to={""}>
                            <li>LIÊN HỆ</li>
                        </Link>
                    </ul>
                </div>
            </div>
        </header>
    );
};

export default Header;
