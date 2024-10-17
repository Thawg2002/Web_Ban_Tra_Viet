import { Spin } from "antd";
import React from "react";

const LoadingComponent = () => {
    return (
        <div className="w-full min-h-screen flex justify-center items-center">
            <Spin />
        </div>
    );
};

export default LoadingComponent;
