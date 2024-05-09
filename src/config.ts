import dotenv from "dotenv";
dotenv.config();

export const MONGO_URL = process.env.DATABASE || "";
export const REDIS_URL = process.env.REDIS || "";
export const PORT = process.env.PORT || 3000;
export const TOKEN_SECRET = 'secretToken'
