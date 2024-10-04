import mongoose from "mongoose";

// Tạo schema cho các mục trong đơn hàng
const itemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true },
});

// Tạo schema cho đơn hàng
const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [itemSchema],
    totalPrice: {
      type: Number,
      required: true,
    },
    customerInfo: {
      fullName: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
    },
    paymentMethod: {
      type: String,
      enum: ["bank transfer", "cash on delivery"],
    },
    status: {
      type: String,
      enum: [
        "Chờ xác nhận",
        "Đã xác nhận",
        "Chờ lấy hàng",
        "Đang giao hàng",
        "Đã giao",
        "Đã hủy",
      ],
      default: "Chờ xác nhận",
    },
    paymentId: String,
  },
  { timestamps: true, versionKey: false }
);

// Cập nhật thời gian cập nhật mỗi khi tài liệu được lưu
orderSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
