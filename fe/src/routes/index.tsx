import CategoryAdd from "@/pages/(dashboard)/category/add/page";
import CategoryEdit from "@/pages/(dashboard)/category/edit/page";
import CategoryList from "@/pages/(dashboard)/category/page";
import LayoutAdmin from "@/pages/(dashboard)/layout";
import ProductAddPage from "@/pages/(dashboard)/product/add/page";
import ProductEditPage from "@/pages/(dashboard)/product/edit/page";
import ProductManagement from "@/pages/(dashboard)/product/page";
import NotFound from "@/pages/(website)/404/page";
import AboutPage from "@/pages/(website)/about/page";
import HomePage from "@/pages/(website)/home/page";
import LayoutWebsite from "@/pages/(website)/layout";
import LoginPage from "@/pages/(website)/login/page";
import OrderSuccess from "@/pages/(website)/order-success/page";
import CheckoutPage from "@/pages/(website)/order/page";
import ProductCategory from "@/pages/(website)/product/category/page";
import ProductDetail from "@/pages/(website)/product/id/page";
import { Route, Routes } from "react-router-dom";

const Router = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<LayoutWebsite />}>
                    <Route index element={<HomePage />} />
                    <Route path="products" element={<ProductCategory />} />
                    <Route path="products/:id" element={<ProductDetail />} />
                    <Route path="about" element={<AboutPage />} />
                    <Route path="login" element={<LoginPage />} />
                    <Route path="order-success" element={<OrderSuccess />} />
                    <Route path="checkout" element={<CheckoutPage />} />
                </Route>
                <Route path="admin" element={<LayoutAdmin />}>
                    <Route path="products" element={<ProductManagement />} />
                    <Route path="products/add" element={<ProductAddPage />} />
                    <Route
                        path="products/:id/edit"
                        element={<ProductEditPage />}
                    />
                    <Route path="category" element={<CategoryList />} />
                    <Route path="category/add" element={<CategoryAdd />} />
                    <Route
                        path="category/:id/edit"
                        element={<CategoryEdit />}
                    />
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
};

export default Router;
