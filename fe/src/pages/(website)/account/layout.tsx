import React from 'react'
import { Outlet } from 'react-router-dom'

const LayoutAccount = () => {
    return (
        <>
            <div className="padding ">
                <div className="px-10 py-10 flex gap-10">
                    <div className="w-[300px] ">
                        <h3 className="bg-gray-100 h-[1000px]">Nguyễn Tuấn Đức</h3>
                    </div>
                    <div className="w-full flex-1">
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    )
}

export default LayoutAccount