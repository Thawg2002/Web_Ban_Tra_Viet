import { AuthContext } from "@/context/authContex";
import { useContext } from "react";

export const useAuth = () => {
    return useContext(AuthContext);
};
