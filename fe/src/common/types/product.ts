export interface IProduct {
    _id?: number | string;
    name: string;
    // category?: Array<string>;
    category: string[];
    createdAt: string;
    rating?: number;
    regular_price: number;
    price: number;
    quantity: number;
    image: string;
    gallery?: Array<string>;
    description: string;
    discount: number;
    featured: boolean;
    countInStock: number;
    attributes?: Array<string>;
    seller?: number;
}
export interface IData {
    products: IProduct[];
}
