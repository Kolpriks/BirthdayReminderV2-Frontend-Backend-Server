import express, { Request, Response } from 'express';
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from 'dotenv';
import { sql } from './db'
import { login } from './api';
import { auth } from './middlewares/auth';

dotenv.config()

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors())
// app.use(cookieParser())

app.use(auth)

login(app, sql)

app.listen(PORT, () => {
    console.log(`Server is running on PORT:${PORT}`);
});
