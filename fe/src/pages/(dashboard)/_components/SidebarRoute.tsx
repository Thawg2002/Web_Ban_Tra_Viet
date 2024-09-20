"use client";

import { BarChart, List, User } from "lucide-react";
import SidebarItem from "./SidebarItem";
import { FaBox } from "react-icons/fa6";

const routes = [
    {
        icon: BarChart,
        label: "Thống kê",
        href: "/admin",
    },
    {
        icon: List,
        label: "Sản phẩm",
        href: "/admin/products",
    },
    {
        icon: List,
        label: "Danh mục",
        href: "/admin/category",
    },
    {
        icon: User,
        label: "Tài khoản",
        href: "/admin/user",
    },
    {
        icon: FaBox,
        label: "Đơn hàng",
        href: "/admin/order",
    },
];

const SidebarRoutes = () => {
    return (
        <div className="flex flex-col w-full">
            {routes.map((route) => (
                <SidebarItem
                    key={route.href}
                    
                    icon={route.icon}
                    label={route.label}
                    href={route.href}
                />
            ))}
        </div>
    );
};

export default SidebarRoutes;
