import React, { useEffect, useState } from "react";
import { Table, Card, Row, Col, Statistic, Typography, Select } from "antd";
import {
    ShoppingCartOutlined,
    DollarOutlined,
    RiseOutlined,
    CheckCircleOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Column } from "@ant-design/charts";
import instance from "@/configs/axios";

const { Title } = Typography;
// Định nghĩa các kiểu dữ liệu
interface MonthlyRevenueItem {
    _id: {
        year: number;
        month: number;
    };
    totalRevenue: number;
    orderCount: number;
}

interface TotalSoldData {
    totalRevenue: number;
    totalOrders: number;
    totalQuantity: number;
}

interface RevenueStats {
    orderStats: Array<{
        _id: string;
        count: number;
    }>;
}

interface TopUser {
    userName: string;
    userEmail: string;
    orderCount: number;
}

interface TopSellingProduct {
    _id: string;
    name: string;
    totalQuantity: number;
    totalRevenue: number;
}
const MonthlyRevenueChart: React.FC<{
    monthlyRevenue: MonthlyRevenueItem[];
}> = ({ monthlyRevenue }) => {
    const [displayData, setDisplayData] = useState<
        Array<{
            month: string;
            revenue: number;
            orders: number;
        }>
    >([]);
    const [selectedYear, setSelectedYear] = useState<number | null>(null);

    // Xử lý dữ liệu
    useEffect(() => {
        if (monthlyRevenue.length > 0) {
            // Lấy các năm duy nhất
            const years = [
                ...new Set(monthlyRevenue.map((item) => item._id.year)),
            ];

            // Mặc định chọn năm mới nhất
            const latestYear = Math.max(...years);
            setSelectedYear(latestYear);

            // Lọc dữ liệu theo năm
            const filteredData = monthlyRevenue
                .filter((item) => item._id.year === latestYear)
                .map((item) => ({
                    month: `Tháng ${item._id.month}`,
                    revenue: item.totalRevenue,
                    orders: item.orderCount,
                }))
                .sort((a, b) => {
                    return (
                        parseInt(a.month.replace("Tháng ", "")) -
                        parseInt(b.month.replace("Tháng ", ""))
                    );
                });

            setDisplayData(filteredData);
        }
    }, [monthlyRevenue]);

    // Tính toán các chỉ số tổng quan
    const calculateOverallStats = () => {
        if (displayData.length === 0) return {};

        const totalRevenue = displayData.reduce(
            (sum, item) => sum + item.revenue,
            0,
        );
        const averageRevenue = totalRevenue / displayData.length;
        const maxRevenueMonth = displayData.reduce((prev, current) =>
            prev.revenue > current.revenue ? prev : current,
        );

        return {
            totalRevenue,
            averageRevenue,
            maxRevenueMonth,
        };
    };

    const overallStats = calculateOverallStats();

    // Cấu hình biểu đồ nâng cao
    const chartConfig = {
        data: displayData,
        xField: "month",
        yField: "revenue",
        label: {
            position: "top",
            formatter: (v) => `${(v.revenue / 1000000).toFixed(1)}M`,
            style: {
                fontSize: 12,
                fontWeight: "bold",
                fill: "#595959",
            },
        },
        tooltip: {
            formatter: (data: any) => ({
                name: "Doanh thu",
                value: `${data.revenue.toLocaleString("vi-VN")} VNĐ`,
            }),
        },
        columnStyle: {
            radius: [8, 8, 0, 0], // Bo tròn góc trên
        },
        color: (data: any) => {
            const baseColor = "#1890ff";
            const intensity =
                data.revenue / Math.max(...displayData.map((d) => d.revenue));
            return `rgba(24, 144, 255, ${0.3 + intensity * 0.7})`;
        },
        interactions: [{ type: "element-active" }],
        animate: {
            enter: {
                animation: "wave-in",
                duration: 500,
            },
        },
    };

    return (
        <Card
            className="mt-8"
            title="Doanh Thu Theo Tháng"
            extra={
                <Select
                    style={{ width: 120 }}
                    value={selectedYear}
                    onChange={setSelectedYear}
                >
                    {[
                        ...new Set(monthlyRevenue.map((item) => item._id.year)),
                    ].map((year) => (
                        <Select.Option key={year} value={year}>
                            Năm {year}
                        </Select.Option>
                    ))}
                </Select>
            }
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 ">
                <Statistic
                    title="Tổng Doanh Thu"
                    value={overallStats.totalRevenue}
                    precision={0}
                    prefix="VNĐ"
                    valueStyle={{ color: "#3f8600" }}
                />
                <Statistic
                    title="Doanh Thu Trung Bình"
                    value={overallStats.averageRevenue}
                    precision={0}
                    prefix="VNĐ"
                    valueStyle={{ color: "#1890ff" }}
                />
                <Statistic
                    title="Tháng Cao Nhất"
                    value={overallStats.maxRevenueMonth?.month}
                    suffix={`- ${overallStats.maxRevenueMonth?.revenue?.toLocaleString()} VNĐ`}
                    valueStyle={{ color: "#cf1322" }}
                />
            </div>
            <Column {...chartConfig} />
        </Card>
    );
};
const StatisticsDashboard = () => {
    const [monthlyRevenue, setMonthlyRevenue] = useState([]);
    const [topSelling, setTopSelling] = useState([]);
    const [totalSold, setTotalSold] = useState(null);
    const [revenueStats, setRevenueStats] = useState(null);
    const [topUser, setTopUser] = useState(null);

    const fetchAllStatistics = async () => {
        try {
            const monthlyRes = await instance.get(
                "/statistics?statType=monthly-revenue",
            );
            setMonthlyRevenue(monthlyRes.data.data);

            const topSellingRes = await instance.get(
                "/statistics?statType=top-selling",
            );
            setTopSelling(topSellingRes.data.data);

            const totalSoldRes = await instance.get(
                "/statistics?statType=total-sold",
            );
            setTotalSold(totalSoldRes.data.data);

            const revenueStatsRes = await instance.get(
                "/statistics?statType=revenue-stats",
            );
            const topUserRes = await instance.get(
                "/statistics?statType=top-user",
            );
            setTopUser(topUserRes.data.data);
            setRevenueStats(revenueStatsRes.data.data);
        } catch (error) {
            console.error("Error fetching statistics:", error);
        }
    };

    useEffect(() => {
        fetchAllStatistics();
    }, []);

    const monthlyChartData = monthlyRevenue.map((item: MonthlyRevenueItem) => ({
        month: `${item._id.month}/${item._id.year}`,
        revenue: item.totalRevenue,
        orders: item.orderCount,
    }));

    const revenueChartConfig = {
        data: monthlyChartData,
        xField: "month",
        yField: "revenue",
        label: {
            position: "top",
            formatter: (v: any) => `${(v.revenue / 1000000).toFixed(1)}M`,
        },
        tooltip: {
            formatter: (data: any) => ({
                name: "Doanh thu",
                value: `${data.revenue.toLocaleString("vi-VN")} VNĐ`,
            }),
        },
    };

    const topSellingColumns = [
        {
            title: "Sản phẩm",
            dataIndex: "name",
            key: "name",
            className: "font-semibold text-gray-700 capitalize",
        },
        {
            title: "Số lượng đã bán",
            dataIndex: "totalQuantity",
            key: "totalQuantity",
            render: (value: number) => value.toLocaleString(),
            className: "text-right",
        },
        {
            title: "Doanh thu",
            dataIndex: "totalRevenue",
            key: "totalRevenue",
            render: (value: number) => `${value.toLocaleString("vi-VN")} VNĐ`,
            className: "text-right text-green-600 font-semibold",
        },
    ];

    return (
        <div className="container mx-auto px-4 py-6 bg-gray-50 min-h-screen">
            <div className="bg-white shadow-xl rounded-lg p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">
                    Thống Kê Tổng Quan
                </h1>

                {/* Thống kê tổng quan */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {[
                        {
                            title: "Tổng doanh thu",
                            value: totalSold?.totalRevenue,
                            icon: <DollarOutlined className="text-green-500" />,
                            formatter: (value) =>
                                `${(value / 1000000).toFixed(1)}M VNĐ`,
                        },
                        {
                            title: "Tổng đơn hàng",
                            value: totalSold?.totalOrders,
                            icon: (
                                <ShoppingCartOutlined className="text-blue-500" />
                            ),
                        },
                        {
                            title: "Số lượng đã bán",
                            value: totalSold?.totalQuantity,
                            icon: <RiseOutlined className="text-purple-500" />,
                        },
                        {
                            title: "Đơn hàng thành công",
                            value:
                                revenueStats?.orderStats?.find(
                                    (stat) => stat._id === "đã giao",
                                )?.count || 0,
                            icon: (
                                <CheckCircleOutlined className="text-emerald-500" />
                            ),
                        },
                    ].map((stat, index) => (
                        <div
                            key={index}
                            className="bg-white border border-gray-200 rounded-lg shadow-md p-5 hover:shadow-lg transition-all duration-300"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 font-medium mb-2">
                                        {stat.title}
                                    </p>
                                    <p className="text-2xl font-bold text-gray-800">
                                        {stat.formatter
                                            ? stat.formatter(stat.value)
                                            : stat.value?.toLocaleString() || 0}
                                    </p>
                                </div>
                                <div className="text-3xl opacity-70">
                                    {stat.icon}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {/* Thêm phần thống kê người mua hàng nhiều nhất */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 mt-8">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        Khách Hàng Mua Hàng Nhiều Nhất
                    </h2>
                    {topUser ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                        <UserOutlined className="text-3xl text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Tên Khách Hàng
                                        </p>
                                        <p className="text-lg font-bold text-gray-800">
                                            {topUser.userName}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-500">
                                        Email
                                    </p>
                                    <p className="text-md font-semibold text-gray-700">
                                        {topUser.userEmail}
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-500">
                                        Số Đơn Hàng
                                    </p>
                                    <p className="text-lg font-bold text-green-600">
                                        {topUser.orderCount}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-500">
                            Không có dữ liệu người dùng
                        </div>
                    )}
                </div>

                {/* Thay thế phần cũ bằng component mới */}
                <MonthlyRevenueChart monthlyRevenue={monthlyRevenue} />

                {/* Bảng sản phẩm bán chạy */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 mt-8">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        Top Sản Phẩm Bán Chạy
                    </h2>
                    <Table
                        columns={topSellingColumns}
                        dataSource={topSelling}
                        rowKey="_id"
                        pagination={{
                            pageSize: 5,
                            className: "flex justify-end mt-4",
                        }}
                        className="w-full"
                    />
                </div>
            </div>
        </div>
    );
};

export default StatisticsDashboard;
