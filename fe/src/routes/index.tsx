import CategoryAdd from "@/pages/(dashboard)/category/add/page";
import CategoryEdit from "@/pages/(dashboard)/category/edit/page";
import CategoryList from "@/pages/(dashboard)/category/page";
import LayoutAdmin from "@/pages/(dashboard)/layout";
import OrderList from "@/pages/(dashboard)/order/page";

import ProductAddPage from "@/pages/(dashboard)/product/add/page";
import ProductEditPage from "@/pages/(dashboard)/product/edit/page";
import ProductManagement from "@/pages/(dashboard)/product/page";
import UserList from "@/pages/(dashboard)/user/page";
import NotFound from "@/pages/(website)/404/page";
import AboutPage from "@/pages/(website)/about/page";
import AccountIndex from "@/pages/(website)/account/AccountIndex";
import LayoutAccount from "@/pages/(website)/account/layout";
import PurchaseIndex from "@/pages/(website)/account/purchase/PurchaseIndex";
import ShoppingCart from "@/pages/(website)/cart/page";

import HomePage from "@/pages/(website)/home/page";
import LayoutWebsite from "@/pages/(website)/layout";
import ForgotPassword from "@/pages/(website)/login/ForgotPassword";
import ResetPassword from "@/pages/(website)/login/ResetPassword";

import LoginPage from "@/pages/(website)/login/page";
import OrderSuccess from "@/pages/(website)/order-success/page";

import CheckoutPage from "@/pages/(website)/order/page";
// import CheckoutPage from "@/pages/(website)/order/page";
import NewBlog from "@/pages/(dashboard)/blog/NewBlog";
import ProductCategory from "@/pages/(website)/product/category/page";
import ProductDetail from "@/pages/(website)/product/id/page";
import PrivateRouter from "@/pages/PrivateRouter";
import { Route, Routes } from "react-router-dom";
import ProtectedRouter from "./ProtectedRouter";
import BlogList from "@/pages/(dashboard)/blog/BlogList";
import BlogEdit from "@/pages/(dashboard)/blog/BlogEdit";
import BlogDetail from "@/pages/(dashboard)/blog/BlogDetail";

const Router = () => {
    return (
        <>
            <Routes>
                <Route element={<PrivateRouter />}>
                    <Route path="admin" element={<LayoutAdmin />}>
                        <Route
                            path="products"
                            element={<ProductManagement />}
                        />
                        <Route
                            path="products/add"
                            element={<ProductAddPage />}
                        />
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
                        <Route path="user" element={<UserList />} />
                        <Route path="order" element={<OrderList />} />
                        <Route path="blog" element={<BlogList />} />
                        <Route path="blog/add" element={<NewBlog />} />
                        <Route path="blog/edit/:id" element={<BlogEdit />} />
                        <Route path="blog/:id" element={<BlogDetail />} />
                    </Route>
                </Route>

                <Route path="/" element={<LayoutWebsite />}>
                    <Route index element={<HomePage />} />
                    <Route path="products" element={<ProductCategory />} />
                    <Route path="products/:id" element={<ProductDetail />} />
                    <Route path="about" element={<AboutPage />} />
                    <Route path="login" element={<LoginPage />} />
                    <Route
                        path="cart"
                        element={
                            <ProtectedRouter>
                                <ShoppingCart />
                            </ProtectedRouter>
                        }
                    />
                    <Route path="order-success" element={<OrderSuccess />} />

                    <Route path="checkout" element={<CheckoutPage />} />
                    <Route
                        path="account"
                        element={
                            <ProtectedRouter>
                                <LayoutAccount />
                            </ProtectedRouter>
                        }
                    >
                        <Route path="profile" element={<AccountIndex />} />
                        <Route path="purchase" element={<PurchaseIndex />} />
                    </Route>
                    <Route
                        path="forgot-password"
                        element={<ForgotPassword />}
                    />
                    <Route
                        path="reset-password/:token"
                        element={<ResetPassword />}
                    />
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
};

export default Router;
