import { CgMenuBoxed } from "react-icons/cg";
import { FaRegUser } from "react-icons/fa6";
import { GrLocation } from "react-icons/gr";
import { IoNotificationsOutline } from "react-icons/io5";
import { RiLockPasswordLine, RiSecurePaymentFill } from "react-icons/ri";


const sidebarAccount = [
    {
        name: "Hồ sơ",
        path: "/account/profile",
        icon: FaRegUser
    },
    {
        name: "Đổi mật khẩu",
        path: "/account/password",
        icon: RiLockPasswordLine
    },
    {
        name: "Địa chỉ",
        path: "/account/address",
        icon: GrLocation
    },
    {
        name: "Đơn hàng",
        path: "/account/purchase",
        icon: CgMenuBoxed
    },
    {
        name: "Thông báo",
        path: "/account/notification",
        icon: IoNotificationsOutline
    },
    {
        name: "Giao dịch",
        path: "/account/payment",
        icon: RiSecurePaymentFill
    },
]
export default sidebarAccount