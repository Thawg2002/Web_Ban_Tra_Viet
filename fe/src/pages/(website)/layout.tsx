import { Outlet } from "react-router-dom";

import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import Header from "./_components/Header";
import Footer from "./_components/Footer";

const LayoutWebsite = () => {
    return (
        <>
            <Header />

            <Outlet />
            <Footer/>
        </>
    );
};

export default LayoutWebsite;
