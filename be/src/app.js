import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import { connectDB } from "./config/db";
import cookieParser from "cookie-parser";
import router from "./routers";

const app = express();
dotenv.config();
// middleware
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));

// connect db\
connectDB(process.env.DB_URI);
app.use(cookieParser());
app.use("/api/v1", router)

export const viteNodeApp = app;
