import React, { useEffect, useState } from "react";
import { Table, Spin, Alert, Select, Button, message, Modal } from "antd";
import instance from "@/configs/axios"; // axios config từ dự án của bạn
import OrderFilter from "./component_/OrderFilter";

const { Option } = Select;

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [searchName, setSearchName] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const [visibleColumns, setVisibleColumns] = useState({
        orderNumber: true,
        customerName: true,
        totalPrice: true,
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
    const handleStatusChange = async (orderId, newStatus) => {
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
            message.error("Cập nhật trạng thái đơn hàng thất bại");
        }
    };

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

    const handleCancelOrder = async (orderId) => {
        const orderToCancel = orders.find((order) => order._id === orderId);

        if (
            !orderToCancel ||
            ["đã giao", "đã hủy"].includes(orderToCancel.status)
        ) {
            message.error("Đơn hàng này không thể hủy.");
            return;
        }

        Modal.confirm({
            title: "Xác nhận hủy đơn hàng",
            content: "Bạn có chắc chắn muốn hủy đơn hàng này không?",
            okText: "Đồng ý",
            cancelText: "Hủy bỏ",
            okButtonProps: {
                style: {
                    backgroundColor: "#ff4d4f",
                    borderColor: "#ff4d4f",
                    color: "white",
                },
            },
            cancelButtonProps: {
                style: {
                    backgroundColor: "#f0f0f0",
                    borderColor: "#d9d9d9",
                    color: "#595959",
                },
            },
            onOk: async () => {
                try {
                    await instance.put(`/orders/${orderId}/status`, {
                        status: "đã hủy",
                    });
                    setOrders(
                        orders.map((order) =>
                            order._id === orderId
                                ? { ...order, status: "đã hủy" }
                                : order,
                        ),
                    );
                    message.success("Hủy đơn hàng thành công");
                } catch (error) {
                    message.error("Hủy đơn hàng thất bại");
                }
            },
        });
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
            render: (text) =>
                `${new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                }).format(text)}`,
            visible: visibleColumns.totalPrice,
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (text, record) => (
                <Select
                    className="w-[150px]"
                    defaultValue={text}
                    onChange={(value) => handleStatusChange(record._id, value)}
                >
                    <Option value="chờ xử lý">Chờ xử lý</Option>
                    <Option value="đã xác nhận">Đã xác nhận</Option>
                    <Option value="đang giao">Đang giao</Option>
                    <Option value="đã giao">Đã giao</Option>
                    <Option value="đã hủy">Đã hủy</Option>
                </Select>
            ),
            visible: visibleColumns.status,
        },
        {
            title: "Thao tác",
            key: "actions",
            render: (_, record) => (
                <div>
                    <Button
                        type="link"
                        onClick={() => showOrderDetails(record)}
                    >
                        Xem chi tiết
                    </Button>

                    {record.status !== "đã hủy" && (
                        <Button onClick={() => handleCancelOrder(record._id)}>
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
                        <strong>Trạng thái:</strong> {selectedOrder.status}
                        {selectedOrder.status === "đã hủy" && (
                            <span style={{ color: "red" }}>
                                {" "}
                                (Đơn hàng đã bị hủy)
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
                                        }).format(item.productId.regular_price)}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </Modal>
            )}
        </div>
    );
};

export default OrderList;
