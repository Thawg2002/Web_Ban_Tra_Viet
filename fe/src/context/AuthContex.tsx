import { IUser } from "@/interfaces/user";
import { createContext, Dispatch, SetStateAction, useState } from "react";
import LoadingComponent from "@/components/LoadingComponent";
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
    const value = { authUser, setAuthUser, isLoggedIn, setIsLoggedIn };
    if (isLoading) {
        return <LoadingComponent />;
    }
    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
export { AuthContext, AuthProvider };
