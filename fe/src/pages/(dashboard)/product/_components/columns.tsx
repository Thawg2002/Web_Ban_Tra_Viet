import { IProduct } from "@/common/types/product";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import { removeProduct } from "@/services/product";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Modal, notification } from "antd";
import { MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
const showSuccessNotification = (message: string) => {
    notification.success({
        message: "Thành công",
        description: message,
        placement: "topRight",
        duration: 3,
        style: {
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        },
    });
};
const useDeleteProduct = () => {
    const queryClient = useQueryClient();

    const handleDelete = async (row: any) => {
        Modal.confirm({
            title: "Bạn có chắc chắn muốn xóa sản phẩm này?",
            content: "Hành động này không thể hoàn tác.",
            okText: "Xóa",
            okType: "danger",
            cancelText: "Hủy",
            onOk: async () => {
                try {
                    await removeProduct(row.original._id);
                    showSuccessNotification("Xóa sản phẩm thành công");
                    queryClient.invalidateQueries({ queryKey: ["products"] });
                } catch (error) {
                    console.log(error);
                }
            },
        });
    };

    return handleDelete;
};
export const columns: ColumnDef<IProduct>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },

    {
        accessorKey: "name",
        header: "Tên sản phẩm",
    },
    {
        accessorKey: "featured_image",
        header: "Ảnh sản phẩm",
        cell: ({ row }) => {
            const { image } = row.original;
            return <img src={image} alt="image" width={50} />;
        },
    },
    // {
    //     accessorKey: "category",
    //     header: "Danh mục",
    //     cell: ({ row }: { row: any }) => {
    //         // Log dữ liệu của hàng để kiểm tra
    //         // console.log("row.original", row.original);

    //         // Giả sử row.original.category là một mảng các ID danh mục
    //         const NameCategory = row.original.category
    //             .map((item: any) => {
    //                 return item.name;
    //             })
    //             .join(", ");
    //         // console.log("NameCategory", NameCategory);
    //         // const x = NameCategory.join(", ");
    //         // console.log("x", x);
    //         // // Hiển thị các tên danh mục trong ô
    //         return <span>{NameCategory}</span>;
    //     },
    // },
    {
        accessorKey: "regular_price",
        header: "Giá sản phẩm",
    },

    {
        accessorKey: "countInStock",
        header: "Số lượng",
    },
    // {
    //     accessorKey: "description",
    //     header: "Mô tả",
    // },
    {
        accessorKey: "discount",
        header: "Giảm giá",
        cell: ({ row }) => <span>{row.original.discount}%</span>,
    },
    {
        accessorKey: "featured",
        header: "Sản phẩm nổi bật",
        cell: ({ row }) => {
            const { featured } = row.original;
            return (
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                        featured
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                    }`}
                >
                    {featured ? "Yes" : "No"}
                </span>
            );
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const onhandleDelete = useDeleteProduct();
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        {/* <DropdownMenuItem>Copy payment ID</DropdownMenuItem>
                        <DropdownMenuSeparator /> */}
                        <DropdownMenuItem>
                            <Link
                                to={`/admin/products/${row.original._id}/edit`}
                            >
                                Cập nhật
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <button onClick={() => onhandleDelete(row)}>
                                Xóa
                            </button>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
