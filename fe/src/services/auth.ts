import instance from "@/configs/axios";

export const SigninUser = async (user: any) => {
    try {
        const response = await instance.post(`/auth/signin`, user);
        return response;
    } catch (error: any) {
        if (error.response) {
            // Trường hợp API trả về lỗi từ phía máy chủ (ví dụ: 401, 403)
            throw new Error(error.response.data.message || "Đăng nhập thất bại");
        } else if (error.request) {
            // Trường hợp không nhận được phản hồi từ phía máy chủ
            throw new Error("Không thể kết nối đến máy chủ");
        } else {
            // Các lỗi khác
            throw new Error("Có lỗi xảy ra, vui lòng thử lại");
        }
    }
};

export const SignupUser = async (user: any) => {
    try {
        const response = await instance.post(`/auth/signup`, user);
        return response;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.message || "Đăng ký thất bại");
        } else if (error.request) {
            throw new Error("Không thể kết nối đến máy chủ");
        } else {
            throw new Error("Có lỗi xảy ra, vui lòng thử lại");
        }
    }
};
