import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { MdEdit } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { motion, Variants } from "framer-motion";
import { useMediaQuery } from "usehooks-ts";
import { cn } from "@/common/lib/utils";
import sidebarAccount from "@/configs/sidebarConfig";


const itemVariants: Variants = {
    open: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 300, damping: 24 },
    },
    closed: { opacity: 0, y: 20, transition: { duration: 0.2 } },
};

const AccountLayout = () => {
    const [isOpen, setIsOpen] = useState(true);
    const isMobile = useMediaQuery("(max-width: 1024px)");
    const router = useNavigate()

    useEffect(() => {
        if (isMobile) {
            setIsOpen(false);
        } else {
            setIsOpen(true);
        }
    }, [isMobile]);

    const location = window.location.pathname;
    return (
        <>
            <div className="padding max-md:px-0 min-h-[calc(100vh-60px)] ">
                <div className="flex flex-col  lg:flex-row w-full gap-2 lg:gap-8 py-2 lg:py-12 px-0 relative">
                    <div className="block w-full lg:w-[250px]">
                        <div>
                            <motion.nav
                                initial={false}
                                animate={isOpen ? "open" : "closed"}
                                className="relative"
                            >
                                <motion.button className="w-full border-b flex items-center border-blue-400 px-2 ">
                                    <div className="p-2 sm:pb-4 w-full flex gap-2 items-center flex-1">
                                        <div className="size-8 sm:size-12 rounded-full border overflow-hidden">
                                            <img src="/avatar_25.jpg" className="w-full h-full " />
                                        </div>
                                        <div className="">
                                            <p className="font-semibold">Đỗ Hữu Trung</p>
                                            <p className="md:flex items-center text-sm text-gray-400 cursor-pointer font-medium hidden">
                                                <MdEdit className=" mr-1" size={16} /> Sửa hồ sơ
                                            </p>
                                        </div>
                                    </div>
                                    <motion.div
                                        variants={{
                                            open: { rotate: 180 },
                                            closed: { rotate: 0 },
                                        }}
                                        onClick={() => setIsOpen(!isOpen)}
                                        transition={{ duration: 0.2 }}
                                        style={{ originY: 0.55 }}
                                        className="p-2 rounded-full hover:bg-gray-50/50 text-blue-500 lg:hidden "
                                    >
                                        <svg
                                            width="15"
                                            height="15"
                                            viewBox="0 0 20 20"
                                            color="#3b82f6"
                                        >
                                            <path d="M0 7 L 20 7 L 10 16" />
                                        </svg>
                                    </motion.div>
                                </motion.button>
                                <motion.ul
                                    variants={{
                                        open: {
                                            clipPath: "inset(0% 0% 0% 0% round 10px)",
                                            transition: {
                                                type: "spring",
                                                bounce: 0,
                                                duration: 0.7,
                                                delayChildren: 0.3,
                                                staggerChildren: 0.05,
                                            },
                                            height: "auto",
                                        },
                                        closed: {
                                            clipPath: "inset(10% 50% 90% 50% round 10px)",
                                            transition: {
                                                type: "spring",
                                                bounce: 0,
                                                duration: 0.3,
                                            },
                                            height: 0,
                                        },
                                    }}
                                    className={cn(
                                        "hidden mt-2 absolute z-10 max-lg:backdrop-blur-lg bg-blue-500/10 lg:bg-transparent w-full",
                                        isOpen && "block",
                                    )}
                                >
                                    {sidebarAccount?.map((item) => {
                                        const isCheck = location.includes(item.path);
                                        return (
                                            <motion.li
                                                variants={itemVariants}
                                                className={cn(
                                                    "w-full px-2 py-1 h-10 hover:bg-slate-50/40 cursor-pointer lg:rounded-md flex items-center hover:text-blue-500",
                                                    isCheck && "text-blue-500 bg-slate-50/40",
                                                )}
                                                onClick={() => {
                                                    if (isMobile) {
                                                        setIsOpen(false)
                                                    }
                                                    router(item.path)
                                                }}
                                            >
                                                {<item.icon size={20} className="mr-4" />}{" "}
                                                <span>{item.name}</span>
                                            </motion.li>
                                        );
                                    })}
                                </motion.ul>
                            </motion.nav>
                        </div>
                    </div>
                    <div className="flex-1 w-full border-l">
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    );
};

export default AccountLayout;
