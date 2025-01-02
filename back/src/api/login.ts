import { Express, Request, Response } from "express"
import { Sql } from "postgres"
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken';
interface User {
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
}

export const login = (app: Express, sql: Sql) => {
    app.get("/v1/login", async (req: Request, res: Response) => {
        const { email, password } = req.body
        if (!email || !password) {
            res.status(400).json({ error: 'All fields are required' });
        }
        try {

            const user = await sql<User[]>`
                select * from users where email = ${email}`
            if (user.length === 0) {
                res.status(404).json({ error: "User not found" })
            }
            const isMatch = await bcrypt.compare(password, user[0].password);
            if (!isMatch) {
                res.status(400).json({ error: 'Invalid credentials' });
            }
            const token = jwt.sign({ id: user[0].id, email: user[0].email }, process.env.JWT_SECRET as string, {
                expiresIn: '1d',
            });

            res.json({ token });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    })
}
