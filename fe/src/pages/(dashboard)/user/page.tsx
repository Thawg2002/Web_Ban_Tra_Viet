import React, { useEffect, useState } from "react";
import { Table, Spin, Alert, Select, Button, message, Input } from "antd";
import axios from "axios";
import instance from "@/configs/axios";

const { Option } = Select;
const { Search } = Input;

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [roleFilter, setRoleFilter] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await instance.get("/auth/users");
                setUsers(response.data.users);
                setFilteredUsers(response.data.users);
            } catch (error) {
                setError("Error fetching users");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        const filtered = users.filter(
            (user) =>
                (user.name.toLowerCase().includes(searchText.toLowerCase()) ||
                    user.email
                        .toLowerCase()
                        .includes(searchText.toLowerCase())) &&
                (roleFilter ? user.role === roleFilter : true),
        );
        setFilteredUsers(filtered);
    }, [searchText, roleFilter, users]);

    const handleRoleChange = async (userId, newRole) => {
        try {
            await instance.put(`/auth/users/${userId}`, { role: newRole });
            // Update local state with the new role
            setUsers(
                users.map((user) =>
                    user._id === userId ? { ...user, role: newRole } : user,
                ),
            );
            message.success("Role updated successfully");
        } catch (error) {
            message.error("Failed to update role");
        }
    };

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            filterDropdown: () => (
                <div style={{ padding: 8 }}>
                    <Search
                        placeholder="Search name"
                        onSearch={(value) => setSearchText(value)}
                        style={{
                            width: 188,
                            marginBottom: 8,
                            display: "block",
                        }}
                    />
                </div>
            ),
            onFilter: (value, record) =>
                record.name.toLowerCase().includes(value.toLowerCase()),
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            filterDropdown: () => (
                <div style={{ padding: 8 }}>
                    <Search
                        placeholder="Search email"
                        onSearch={(value) => setSearchText(value)}
                        style={{
                            width: 188,
                            marginBottom: 8,
                            display: "block",
                        }}
                    />
                </div>
            ),
            onFilter: (value, record) =>
                record.email.toLowerCase().includes(value.toLowerCase()),
        },
        {
            title: "Role",
            dataIndex: "role",
            key: "role",
            filters: [
                { text: "Admin", value: "admin" },
                { text: "User", value: "user" },
                // Add other roles as needed
            ],
            onFilter: (value, record) => record.role === value,
            render: (text, record) => (
                <Select
                    className="w-[100px]"
                    defaultValue={text}
                    onChange={(value) => handleRoleChange(record._id, value)}
                >
                    <Option value="admin">Admin</Option>
                    <Option value="user">User</Option>
                    {/* Add other roles as needed */}
                </Select>
            ),
        },
    ];

    if (loading) return <Spin tip="Đang tải dữ liệu..." />;

    if (error)
        return (
            <Alert message="Lỗi" description={error} type="error" showIcon />
        );

    return (
        <div>
            <h2 className="font-medium text-[18px] my-3">
                Danh sách tài khoản
            </h2>
            <Table
                className="mt-5"
                dataSource={filteredUsers}
                columns={columns}
                rowKey={(record) => record._id} // Ensure each row has a unique key
            />
        </div>
    );
};

export default UserList;
