import express from "express";
import BannerController from "../controllers/banner";

const bannerRouter = express.Router();

const bannerController = new BannerController();
bannerRouter.get("/banners", bannerController.getBanners);
bannerRouter.get("/banners/:id", bannerController.getBannerDetail);
bannerRouter.post("/banners/", bannerController.createBanner);
bannerRouter.put("/banners/:id", bannerController.updateBanner);
bannerRouter.delete("/banners/:id/delete", bannerController.hardDeleteBanner);

export default bannerRouter;
