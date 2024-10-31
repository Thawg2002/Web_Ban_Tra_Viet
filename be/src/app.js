import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import { connectDB } from "./config/db";
import router from "./routers";
import authRouter from "./routers/auth";
import cartRouter from "./routers/cart";
import orderRouter from "./routers/order";
import blogRouter from "./routers/blog";
import categoryRouter from "./routers/category";
import productRouter from "./routers/product";
// import logingoogle from "./routers/logingoogle";
import PaymentRouter from "./routers/PaymentRouter";
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(cors());
console.log("client-url", process.env.CLIENT_URL);
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3030",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(morgan("tiny"));

// connect db\
connectDB(process.env.DB_URI);

// routers
app.use("/api/v1", productRouter);
app.use("/api/v1", authRouter);
app.use("/api/v1", categoryRouter);
app.use("/api/v1", cartRouter);
app.use("/api/v1", orderRouter);
app.use("/api", PaymentRouter);
app.use("/api/v1", blogRouter);
// app.use("/api/v1", logingoogle);

// app.use("/api/v1", router);

export const viteNodeApp = app;
