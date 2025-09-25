import express from "express";
import connectMongoDB from "./db/connectMongo.js";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import notificationRoutes from "./routes/notification.route.js";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URI,
    credentials: true, //프론트로 쿠키 전달 가능
  })
);
app.use(express.json({ limit: "5mb" })); //json형태 데이터 주고받기
app.use(express.urlencoded({ extended: true })); //x-www-url-encoded형태로 데이터 송수신 가능
app.use(cookieParser()); //req.cookies로 쿠키값 받아오기 위함

//routing
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notification", notificationRoutes);

app.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}`);
  //DB연결
  connectMongoDB();
});
