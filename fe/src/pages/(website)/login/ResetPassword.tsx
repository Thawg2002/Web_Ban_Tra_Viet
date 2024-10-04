import React, { useState } from "react";

import { useParams } from "react-router-dom";
import instance from "@/configs/axios";

const ResetPassword = () => {
    const { token } = useParams();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await instance.post(`/auth/reset-password/${token}`, {
                password,
                confirmPassword,
            });
            setMessage(res.data.message);
        } catch (err) {
            setMessage("Có lỗi xảy ra");
        }
    };

    return (
        <div>
            <h2>Đặt Lại Mật Khẩu</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder="Nhập mật khẩu mới"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Xác nhận mật khẩu"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <button type="submit">Đặt lại mật khẩu</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ResetPassword;
