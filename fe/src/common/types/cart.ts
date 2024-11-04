


export interface CartItem {
    productId: string;
    image?: string;
    quantity: number;
    price: number;
    discount: number;
    finalPrice: number;
}

// Type representing the entire cart
export interface Cart {
    userId: string;
    products: CartItem[];
    totalQuantity: number;
    totalPrice: number;
    totalDiscount: number;
    finalTotalPrice: number;
    createdAt?: Date;
    updatedAt?: Date;
}
