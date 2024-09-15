import { useState } from "react";

import Signin from "./_components/signin";
import Signup from "./_components/signup";

const LoginPage = () => {
    return (
        <div className="mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-10">
                <Signin /> 
                <Signup />
            </div>
        </div>
    );
};

export default LoginPage;
