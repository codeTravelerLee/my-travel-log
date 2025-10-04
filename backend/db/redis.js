//upstash redis연동 with ioredis
import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

export const redis = new Redis(`${process.env.UPSTASH_REDIS_URL}`);

// redis.set("key1", "val1");
