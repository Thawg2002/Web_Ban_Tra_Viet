"use client";

import React from "react";
import SidebarItem from "./SidebarItem";
import { FaBox, FaChartBar, FaImage, FaUser, FaFile, FaNewspaper } from "react-icons/fa6"; // Ensure the icons are imported correctly
import { MdInventory } from "react-icons/md";
import { List } from "lucide-react";

interface SidebarItemProps {
    icon: React.ElementType; // Allows passing any React component
    label: string;
    href: string;
}

// Define routes as an array of objects
const routes = [
    {
        icon: FaChartBar,
        label: "Thống kê",
        href: "/admin",
    },
    {
        icon: MdInventory,
        label: "Sản phẩm",
        href: "/admin/products",
    },
    {
        icon: List,
        label: "Danh mục",
        href: "/admin/category",
    },
    {
        icon: FaUser,
        label: "Tài khoản",
        href: "/admin/user",
    },
    {
        icon: FaBox,
        label: "Đơn hàng",
        href: "/admin/order",
    },
    {
        icon: FaFile,
        label: "Bài viết",
        href: "/admin/blog",
    },
    {
        icon: FaImage,
        label: "Banner",
        href: "/admin/banner",
    },
    {
        icon: FaNewspaper,
        label: "Tin tức",
        href: "/admin/post",
    },
];

// SidebarRoutes functional component
const SidebarRoutes: React.FC = () => {
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
