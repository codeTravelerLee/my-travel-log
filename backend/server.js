import express from "express";
import connectMongoDB from "./db/connectMongo.js";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); //json형태 데이터 주고받기
app.use(express.urlencoded({ extended: true })); //x-www-url-encoded형태로 데이터 송수신 가능
app.use(cookieParser());

//routing
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}`);
  //DB연결
  connectMongoDB();
});
