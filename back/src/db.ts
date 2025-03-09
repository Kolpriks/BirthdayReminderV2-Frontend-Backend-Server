import postgres from "postgres";
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

export const sql = postgres({
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    database: process.env.POSTGRES_DB,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
})
