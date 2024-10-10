import React, { useEffect, useState } from "react";
import { Table, Spin, Alert, Select, Button, message, Modal } from "antd";
import instance from "@/configs/axios"; // axios config từ dự án của bạn
import OrderFilter from "./component_/OrderFilter";
import TextArea from "antd/es/input/TextArea";

const { Option } = Select;

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [searchName, setSearchName] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [cancellationReason, setCancellationReason] = useState("");
    const [cancelModalVisible, setCancelModalVisible] = useState(false);
    const [orderToCancel, setOrderToCancel] = useState(null);

    const [visibleColumns, setVisibleColumns] = useState({
        orderNumber: true,
        customerName: true,
        totalPrice: true,
        paymentMethod: true, // Add this line to ensure payment method is visible
        status: true,
        actions: true,
    });

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await instance.get("/orders");
                setOrders(data);
            } catch (error) {
                setError("Lỗi khi lấy danh sách đơn hàng");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleColumnVisibilityChange = (column) => {
        setVisibleColumns((prev) => ({
            ...prev,
            [column]: !prev[column],
        }));
    };

    const showOrderDetails = (order) => {
        setSelectedOrder(order);
    };

    const handleModalClose = () => {
        setSelectedOrder(null);
    };

    const handleStatusChange = async (orderId, newStatus) => {
        if (!orderId) {
            message.error("Order ID is undefined");
            return;
        }

        if (newStatus === "đã hủy") {
            // Nếu chọn trạng thái "đã hủy", mở modal nhập lý do
            setOrderToCancel(orders.find((order) => order._id === orderId));
            setCancelModalVisible(true);
            return; // Dừng quá trình cập nhật trạng thái ở đây để chờ xác nhận từ modal
        }

        try {
            await instance.put(`/orders/${orderId}/status`, {
                status: newStatus,
            });
            setOrders(
                orders.map((order) =>
                    order._id === orderId
                        ? { ...order, status: newStatus }
                        : order,
                ),
            );
            message.success("Cập nhật trạng thái đơn hàng thành công");
        } catch (error) {
            console.error("Error updating order status:", error);
            message.error("Cập nhật trạng thái đơn hàng thất bại");
        }
    };

    const handleCancelOrder = (order: any) => {
        if (!order || typeof order.status !== "string") {
            message.error("Trạng thái đơn hàng không hợp lệ.");
            return;
        }

        const nonCancelableStatuses = ["Đang giao hàng", "Đã giao", "Đã hủy"];

        if (nonCancelableStatuses.includes(order.status)) {
            message.error("Đơn hàng này không thể hủy.");
            return;
        }

        setOrderToCancel(order); // Set toàn bộ đối tượng đơn hàng
        setCancelModalVisible(true);
    };

    const confirmCancelOrder = async () => {
        if (!orderToCancel || !orderToCancel._id) {
            message.error("Không thể xác định đơn hàng cần hủy");
            return;
        }

        try {
            await instance.put(`/orders/${orderToCancel._id}/status`, {
                status: "Đã hủy",
                cancellationReason,
            });
            setOrders(
                orders.map((order) =>
                    order._id === orderToCancel._id
                        ? { ...order, status: "Đã hủy", cancellationReason }
                        : order,
                ),
            );
            message.success("Hủy đơn hàng thành công");
            setCancelModalVisible(false);
            setOrderToCancel(null);
            setCancellationReason("");
        } catch (error) {
            console.error("Error cancelling order:", error);
            message.error("Hủy đơn hàng thất bại");
        }
    };

    const columns = [
        {
            title: "Số đơn hàng",
            dataIndex: "orderNumber",
            key: "orderNumber",
            visible: visibleColumns.orderNumber,
        },
        {
            title: "Tên khách hàng",
            dataIndex: ["customerInfo", "fullName"],
            key: "customerName",
            visible: visibleColumns.customerName,
        },
        {
            title: "Tổng giá (VND)",
            dataIndex: "totalPrice",
            key: "totalPrice",
            render: (text: any) =>
                `${new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                }).format(text)}`,
            visible: visibleColumns.totalPrice,
        },
        {
            title: "Phương thức thanh toán", // This is your payment method column
            dataIndex: "paymentMethod",
            key: "paymentMethod",
            visible: visibleColumns.paymentMethod, // Ensure this is visible
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (text: string, record: any) => (
                <Select
                    className="w-[150px]"
                    defaultValue={text}
                    onChange={(value) => handleStatusChange(record._id, value)}
                    disabled={
                        record.status === "Đã giao" ||
                        record.status === "Đã hủy"
                    }
                >
                    <Option
                        value="Chờ xử lý"
                        disabled={record.status === "Đang giao hàng"}
                    >
                        Chờ xử lý
                    </Option>
                    <Option
                        value="Đã xác nhận"
                        disabled={record.status === "Đang giao hàng"}
                    >
                        Đã xác nhận
                    </Option>
                    <Option value="Đang giao hàng">Đang giao</Option>
                    <Option value="Đã giao">Đã giao</Option>
                    <Option
                        value="Đã hủy"
                        disabled={record.status === "Đang giao hàng"}
                    >
                        Đã hủy
                    </Option>
                </Select>
            ),
            visible: visibleColumns.status,
        },
        {
            title: "Thao tác",
            key: "actions",
            render: (_: any, record: any) => (
                <div>
                    <Button
                        type="link"
                        onClick={() => showOrderDetails(record)}
                    >
                        Xem chi tiết
                    </Button>

                    {record.status !== "Đã hủy" && (
                        <Button onClick={() => handleCancelOrder(record)}>
                            Hủy
                        </Button>
                    )}
                </div>
            ),
            visible: visibleColumns.actions,
        },
    ];

    const filteredOrders = orders
        .filter((order) =>
            order.customerInfo.fullName
                .toLowerCase()
                .includes(searchName.toLowerCase()),
        )
        .filter((order) => !statusFilter || order.status === statusFilter);

    const filteredColumns = columns.filter((column) => column.visible);

    if (loading) return <Spin tip="Đang tải đơn hàng..." />;

    if (error)
        return (
            <Alert message="Lỗi" description={error} type="error" showIcon />
        );

    return (
        <div>
            <h2 className="font-medium text-[18px] my-3">Danh sách đơn hàng</h2>

            {/* Thêm Select để lọc trạng thái đơn hàng */}
            <OrderFilter
                searchName={searchName}
                setSearchName={setSearchName}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
            />

            <div className="mt-5 column-visibility-controls w-[220px] p-2 bg-gray-50 rounded-lg shadow-md">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-[200px] text-left font-semibold text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition duration-200"
                >
                    Chỉnh sửa cột
                    <span className="float-right">{isOpen ? "▲" : "▼"}</span>
                </button>

                {/* Kiểm tra nếu trạng thái mở thì hiện nội dung */}
                {isOpen && (
                    <div className="mt-4 space-y-4">
                        {columns.map((column) => (
                            <div
                                key={column.key}
                                className="flex items-center space-x-2"
                            >
                                <input
                                    type="checkbox"
                                    checked={visibleColumns[column.key]}
                                    onChange={() =>
                                        handleColumnVisibilityChange(column.key)
                                    }
                                    className="form-checkbox h-4 w-4 text-blue-600"
                                />
                                <span className="text-gray-700 font-medium">
                                    {column.title}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Table
                className="mt-5"
                dataSource={filteredOrders}
                columns={filteredColumns}
                rowKey={(record) => record._id}
            />

            {/* Modal hiển thị chi tiết đơn hàng */}
            {selectedOrder && (
                <Modal
                    title={`Chi tiết đơn hàng - ${selectedOrder.orderNumber}`}
                    visible={!!selectedOrder}
                    onCancel={handleModalClose}
                    footer={null}
                >
                    <p>
                        <strong>Tên khách hàng:</strong>{" "}
                        {selectedOrder.customerInfo.fullName}
                    </p>
                    <p>
                        <strong>Địa chỉ:</strong>{" "}
                        {selectedOrder.customerInfo.address},{" "}
                        {selectedOrder.customerInfo.city},{" "}
                        {selectedOrder.customerInfo.postalCode}
                    </p>
                    <p>
                        <strong>Email:</strong>{" "}
                        {selectedOrder.customerInfo.email}
                    </p>
                    <p>
                        <strong className="mr-3">Tổng giá:</strong>
                        {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                        }).format(selectedOrder.totalPrice)}
                    </p>
                    <p>
                        <strong className="font-semibold text-gray-800">
                            Trạng thái:
                        </strong>{" "}
                        {selectedOrder.status}
                        {selectedOrder.status === "Đã hủy" && (
                            <span className="ml-2 text-red-600 font-medium">
                                (Đơn hàng đã bị hủy) - Lý do:{" "}
                                {selectedOrder.cancellationReason
                                    ? selectedOrder.cancellationReason
                                    : "Không có lý do"}
                            </span>
                        )}
                    </p>

                    <h3 className="font-medium">Sản phẩm</h3>
                    <ul className="mt-3">
                        {selectedOrder.items.map((item: any) => (
                            <li
                                key={item._id}
                                className="flex items-center mb-4"
                            >
                                <img
                                    src={item.productId.image}
                                    alt={item.productId.name}
                                    style={{
                                        width: "80px",
                                        marginRight: "20px",
                                    }}
                                />
                                <div>
                                    <p>
                                        <strong>Tên sản phẩm:</strong>{" "}
                                        <span className="capitalize">
                                            {item.productId.name}
                                        </span>{" "}
                                    </p>
                                    <p>
                                        <strong>Số lượng:</strong>{" "}
                                        {item.quantity}
                                    </p>
                                    <p>
                                        <strong>Giá:</strong>{" "}
                                        {new Intl.NumberFormat("vi-VN", {
                                            style: "currency",
                                            currency: "VND",
                                        }).format(
                                            item.productId.regular_price *
                                                (1 -
                                                    item.productId.discount /
                                                        100),
                                        )}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </Modal>
            )}
            {cancelModalVisible && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-auto">
                        <h2 className="text-xl font-semibold mb-4">
                            Hủy đơn hàng
                        </h2>
                        <p className="mb-4">
                            Vui lòng nhập lý do hủy đơn hàng:
                        </p>
                        <textarea
                            rows={4}
                            value={cancellationReason}
                            onChange={(e) =>
                                setCancellationReason(e.target.value)
                            }
                            placeholder="Nhập lý do hủy đơn hàng"
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        ></textarea>
                        <div className="flex justify-end mt-4 space-x-2">
                            <button
                                onClick={() => {
                                    setCancelModalVisible(false);
                                    setOrderToCancel(null);
                                    setCancellationReason("");
                                }}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                            >
                                Đóng
                            </button>
                            <button
                                onClick={() => {
                                    if (cancellationReason.trim() === "") {
                                        alert(
                                            "Vui lòng nhập lý do hủy đơn hàng!",
                                        );
                                        return;
                                    }
                                    confirmCancelOrder();
                                }}
                                className={`px-4 py-2 rounded-md text-white ${cancellationReason.trim() ? "bg-red-500 hover:bg-red-600" : "bg-red-300 cursor-not-allowed"}`}
                                disabled={!cancellationReason.trim()}
                            >
                                Xác nhận hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderList;
