// OrderFilter.tsx
import React from "react";
import { Input, Select } from "antd";

const { Option } = Select;

interface OrderFilterProps {
    searchName: string;
    setSearchName: (name: string) => void;
    statusFilter: string;
    setStatusFilter: (status: string) => void;
}

const OrderFilter: React.FC<OrderFilterProps> = ({
    searchName,
    setSearchName,
    statusFilter,
    setStatusFilter,
}) => {
    return (
        <div className="order-filter mb-4 flex space-x-4">
            <Input
                placeholder="Tìm kiếm theo tên khách hàng"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="w-1/5"
                size="large"
            />
            <Select
                placeholder="Chọn trạng thái"
                value={statusFilter}
                onChange={(value) => setStatusFilter(value)}
                className="w-1/4"
                size="large"
            >
                <Option value="">Tất cả</Option>
                <Option value="chờ xử lý">Chờ xử lý</Option>
                <Option value="đã xác nhận">Đã xác nhận</Option>
                <Option value="đang giao">Đang giao</Option>
                <Option value="đã giao">Đã giao</Option>
                <Option value="đã hủy">Đã hủy</Option>
            </Select>
        </div>
    );
};

export default OrderFilter;
