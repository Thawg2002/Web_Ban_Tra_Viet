import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useEffect,
    useState,
} from "react";

avatar: "../upload/default-avatar.jpeg";
createdAt: "2024-09-12T09:03:59.975Z";
email: "tuanduc@gmail.com";
name: "Tuấn Đức";
role: "user";
updatedAt: "2024-09-12T09:03:59.975Z";
_id: "66e2ae7fb1fdcb7cdc271f61";
export interface IUser {
    _id: string;
    name: string;
    email: string;
    role?: string;
    avatar?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
interface AuthContextType {
    authUser?: IUser | undefined; // thông tin người dùng
    setAuthUser?: Dispatch<SetStateAction<IUser | undefined>>; // set thông tin người dùng
    isLoggedIn?: boolean; // trạng thái đăng nhập
    setIsLoggedIn?: Dispatch<SetStateAction<boolean>>; // set trạng thái đăng nhập
}
const AuthContext = createContext<AuthContextType>({});
interface AuthProviderProps {
    children: ReactNode;
}
const AuthProvider = ({ children }: AuthProviderProps) => {
    const [authUser, setAuthUser] = useState<IUser | undefined>(undefined);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    console.log("authUser", authUser);
    console.log("isLoggedIn", isLoggedIn);
    const value = { authUser, setAuthUser, isLoggedIn, setIsLoggedIn };
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        console.log("User stored", storedUser);
        if (storedUser) {
            setAuthUser(JSON.parse(storedUser));
            setIsLoggedIn(true);
        }
    }, []);
    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
export { AuthContext, AuthProvider };
