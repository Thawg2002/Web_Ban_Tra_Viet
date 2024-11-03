import { useAuth } from "@/common/hooks/useAuth";
import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
type PrivateRouterType = {
    children: ReactNode;
};
const ProtectedRouter = ({ children }: PrivateRouterType) => {
    const { isLoggedIn } = useAuth();
    if (!isLoggedIn) {
        return <Navigate to="/login" />;
    }
    return isLoggedIn && children;
};

export default ProtectedRouter;
