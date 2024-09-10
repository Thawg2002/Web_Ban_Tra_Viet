import { StatusCodes } from "http-status-codes";
import UserModel from "../models/user"
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dontev from "dotenv";
import RefreshToken from "../models/RefreshToken";
import { loginFormValidation, registerFormValidation } from "../validations/auth";

dontev.config();

export const generateAccessToken = async (payload) => {
    return jwt.sign(payload, process.env.SECRET_ACCESS_TOKEN, { expiresIn: "1h" });
}
export const generateRefreshToken = async (payload) => {
    return jwt.sign(payload, process.env.SECRET_REFRESH_TOKEN, { expiresIn: "60d" })
}
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { error } = loginFormValidation.validate(req.body);
        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: error.details[0].message,
            })
        }
        const user = await UserModel.findOne({ email: email });
        if (!user) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Email không tồn tại",
            })
        }
        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Mật khẩu không đúng",
            })
        }
        const accessToken = await generateAccessToken({
            id: user._id,
            email: user.email,
            is_admin: user.is_admin,
        });
        const refreshToken = await generateRefreshToken({
            id: user._id,
            email: user.email,
            is_admin: user.is_admin,
        });
        const ref = await new RefreshToken({ token: refreshToken, userId: user._id }).save()
        res.cookie("token", refreshToken, {
            maxAge: 1000 * 60 * 24 * 60 * 60,
            httpOnly: true,
            path: "/",
        });
        // console.log(ref)
        delete user._doc.password;
        return res.status(StatusCodes.OK).json({
            message: "Đăng nhập thành công",
            accessToken: accessToken,
            refreshToken: refreshToken,
        })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message,
        })
    }
}

export const register = async (req, res) => {
    try {
        const { email, password, confirmPassword, username } = req.body;
        const { error } = registerFormValidation.validate(req.body);
        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: error.details[0].message,
            })
        }
        const existUser = await UserModel.findOne({ email });
        if (existUser) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Email/password không hợp lệ",
            })
        }
        if (password !== confirmPassword) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Mật khẩu không trùng khớp",
            })
        }
        const hashedPassword = await bcryptjs.hash(password, 10);
        const user = await UserModel.create({ username, email, password: hashedPassword, confirmPassword })
        return res.status(StatusCodes.OK).json({
            message: "Đăng ký thành công", user
        })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message
        })
    }
}
export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.token;
        if (!refreshToken) {
            return res.status(StatusCodes.AUTHENTICATOR).json({
                message: "Bạn chưa đăng nhập ",
            });
        }
        jwt.verify(refreshToken, process.env.SECRET_REFRESH_TOKEN, async (err, user) => {
            if (err) {
                return res.status(StatusCodes.AUTHENTICATOR).json({
                    message: "Token đã hết hạn mời bạn đăng nhập lại",
                });
            }
            if (!user) {
                return;
            }
            const payload = {
                id: user.id,
                email: user.email,
                is_admin: user.is_admin,
            }
            const NewAccessToken = await generateAccessToken(payload);
            const NewRefreshToken = await generateRefreshToken(payload);
            res.cookie("token", NewRefreshToken, {
                maxAge: 24 * 60 * 60 * 1000 * 60,
                httpOnly: true,
                path: "/",
                sameSite: "none",
                secure: true,
            });
            return res.status(StatusCodes.OK).json({
                message: "Tạo token thành công",
                accessToken: NewAccessToken,
            });
        })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message,
        })
    }
}
export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies;
        if (!refreshToken) {
            return res.status(StatusCodes.AUTHENTICATOR).json({
                message: "Bạn chưa đăng nhập ",
            });
        }
        jwt.verify(refreshToken, process.env.SECRET_REFRESH_TOKEN, async (err, data) => {
            if (err) {
                res.cookie("token", "", {
                    maxAge: 0,
                });
                return res.status(STATUS.OK).json({
                    message: "Đăng xuất thành công",
                });
            }
            res.cookie("token", " ", {
                maxAge: 0
            });
            return res.status(StatusCodes.OK).json({
                message: "Đăng xuất thành công",
            });
        })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message,
        })
    }
}