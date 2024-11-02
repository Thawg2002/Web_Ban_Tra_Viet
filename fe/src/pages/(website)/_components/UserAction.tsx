import { useAuth } from "@/common/hooks/useAuth";
import instance from "@/configs/axios";
import { Dropdown, MenuProps, message, Space } from "antd";
import { Link } from "react-router-dom";
const UserAction = () => {
    const { authUser, setAuthUser, setIsLoggedIn } = useAuth();
    const [messageApi, contextHolder] = message.useMessage();
    const accessToken = localStorage.getItem("accessToken");
    // console.log("accessToken: ", accessToken);
    const handleLogout = async () => {
        try {
            await instance.post(
                `/auth/logout`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                },
            );
            setAuthUser?.(undefined);
            setIsLoggedIn?.(false);
            window.localStorage.removeItem("user");
            window.location.reload();
            messageApi.success("Đăng xuất thành công");
        } catch (error) {
            console.log(error);
        }
    };
    const items: MenuProps["items"] = [
        {
            label: <Link to="/account/profile">Tài khoản của tôi</Link>,
            key: "0",
        },
        {
            label: <button onClick={() => handleLogout()}>Đăng xuất</button>,
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
