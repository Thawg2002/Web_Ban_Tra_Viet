import { IUser } from "@/interfaces/user";
import {
    createContext,
    Dispatch,
    SetStateAction,
    useEffect,
    useState,
} from "react";
import LoadingComponent from "@/components/LoadingComponent";
import instance from "@/configs/axios";
type AuthContextType = {
    authUser?: IUser | undefined;
    setAuthUser?: Dispatch<SetStateAction<IUser | undefined>>;
    isLoggedIn?: boolean;
    setIsloggedIn?: Dispatch<SetStateAction<boolean>>;
};

const AuthContext = createContext<AuthContextType>({});

type AuthProviderProp = {
    children: React.ReactNode;
};

const AuthProvider = ({ children }: AuthProviderProp) => {
    const [authUser, setAuthUser] = useState<IUser | undefined>(undefined);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    console.log("authUser", authUser);
    console.log("isLoggedIn", isLoggedIn);
    const value = { authUser, setAuthUser, isLoggedIn, setIsLoggedIn };

    useEffect(() => {
        (async () => {
            try {
                const { data } = await instance.get(`/auth/current`);
                setAuthUser(data?.data);
                setIsLoggedIn(true);
            } catch (error) {
                setAuthUser(undefined);
                setIsLoggedIn(false);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);
    if (isLoading) {
        return <LoadingComponent />;
    }
    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
export { AuthContext, AuthProvider };
