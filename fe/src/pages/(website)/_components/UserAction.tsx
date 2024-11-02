import { useAuth } from "@/common/hooks/useAuth";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, MenuProps, Space } from "antd";
import { FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
const UserAction = () => {
    const { authUser } = useAuth();
    const items: MenuProps["items"] = [
        {
            label: <Link to="">Tài khoản của tôi</Link>,
            key: "0",
        },
        {
            label: <Link to="">Đăng xuất</Link>,
            key: "0",
        },
    ];
    return (
        <>
            <Dropdown menu={{ items }} trigger={["click"]}>
                <a onClick={(e) => e.preventDefault()}>
                    <Space>
                        {authUser?.avatar === "" ? (
                            <img
                                src={"/avatar.png"}
                                width={50}
                                className=""
                                alt=""
                            />
                        ) : (
                            <img src={authUser?.avatar} alt="" />
                        )}
                        đa
                    </Space>
                </a>
            </Dropdown>
        </>
    );
};

export default UserAction;
