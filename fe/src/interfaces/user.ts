export interface IUser {
    _id: string;
    email: string;
    password: string;
    name?: string;
    role?: "user" | "admin";
    resetPasswordToken?: string;
    resetPasswordExpiry?: Date;
    avatar?: string;
}
