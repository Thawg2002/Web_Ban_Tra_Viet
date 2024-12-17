import { toast } from "@/components/ui/use-toast";
import { deleteCategories, getAllCategories } from "@/services/categories";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { TableProps } from "antd";
import { Button, Popconfirm, Table, Input, Spin } from "antd";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useState } from "react";

const { Search } = Input;

interface DataType {
    _id: string;
    key: string;
    name: string;
    slug: string;
}

const CategoryList = () => {
    const queryClient = useQueryClient();
    const [filterName, setFilterName] = useState<string>("");
    const [filterSlug, setFilterSlug] = useState<string>("");

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["category"],
        queryFn: async () => {
            try {
                return await getAllCategories();
            } catch (error) {
                throw new Error("Error");
            }
        },
    });

    const dataNewKey = data?.categories?.map((item: any) => ({
        key: item._id,
        ...item,
    }));

    const {
        mutate,
        isPending,
        isError: isErrorDelete,
        error: errorDelete,
    } = useMutation({
        mutationFn: async (category: any) => {
            try {
                return await deleteCategories(category._id);
            } catch (error) {
                throw new Error("Error");
            }
        },
        onSuccess: () => {
            toast({
                title: "Xóa danh mục thành công",
                typeof: "success",
            });
            queryClient.invalidateQueries({
                queryKey: ["category"],
            });
        },
        onError: () => {
            toast({
                title: "Xóa danh mục thất bại",
                typeof: "error",
            });
        },
    });

    const handleSearch = (value: string, type: "name" | "slug") => {
        if (type === "name") {
            setFilterName(value);
        } else {
            setFilterSlug(value);
        }
    };

    const columns: TableProps<DataType>["columns"] = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            filteredValue: [filterName],
            filterDropdown: () => (
                <div style={{ padding: 8 }}>
                    <Search
                        placeholder="Search name"
                        onSearch={(value) => handleSearch(value, "name")}
                        style={{
                            width: 188,
                            marginBottom: 8,
                            display: "block",
                        }}
                    />
                </div>
            ),
            onFilter: (value, record) =>
                record.name.toLowerCase().includes(value.toLowerCase()) ||
                !filterName,
            render: (text) => <a>{text}</a>,
        },
        {
            title: "Slug",
            dataIndex: "slug",
            key: "slug",
            filteredValue: [filterSlug],
            filterDropdown: () => (
                <div style={{ padding: 8 }}>
                    <Search
                        placeholder="Search slug"
                        onSearch={(value) => handleSearch(value, "slug")}
                        style={{
                            width: 188,
                            marginBottom: 8,
                            display: "block",
                        }}
                    />
                </div>
            ),
            onFilter: (value, record) =>
                record.slug.toLowerCase().includes(value.toLowerCase()) ||
                !filterSlug,
        },
        {
            title: "Action",
            key: "action",
            render: (_, category) => (
                <>
                    <Link to={`/admin/category/${category._id}/edit`}>
                        <Button className="mx-2">Sửa</Button>
                    </Link>
                    <Popconfirm
                        title="Xóa danh mục !"
                        description="Bạn chắc chắn muốn xóa danh mục này ?"
                        onConfirm={() => mutate(category)}
                        okText="Yes"
                        cancelText="No"
                    >
                        {isPending ? (
                            <AiOutlineLoading3Quarters />
                        ) : (
                            <Button danger>Xóa</Button>
                        )}
                    </Popconfirm>
                </>
            ),
        },
    ];

    if (isLoading) return <Spin tip="Đang tải danh mục..." />;
    if (isError) return <div>{error.message}</div>;
    if (isErrorDelete) return <div>{errorDelete.message}</div>;

    return (
        <>
            <h2 className="font-medium text-[18px] my-3">Danh sách Danh mục</h2>
            <div className="mb-3">
                <Link to="/admin/category/add">
                    <Button>Thêm danh mục</Button>
                </Link>
            </div>
            <Table columns={columns} dataSource={dataNewKey} />
        </>
    );
};

export default CategoryList;
