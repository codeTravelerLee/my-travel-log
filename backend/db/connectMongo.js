import mongoose from "mongoose";

const connectMongoDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`mongoDB connected: ${conn.connection.port}`);
  } catch (error) {
    console.error(`failed to connect to MongoDB... : ${error.message}`);
    process.exit(1); //종료
  }
};

export default connectMongoDB;
