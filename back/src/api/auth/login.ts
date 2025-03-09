import { Express, Request, Response } from "express"
import { Sql } from "postgres"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

interface UserCredentials {
	email: string;
	password: string;
}

export const login = (app: Express, sql: Sql) => {
    app.post("/v1/auth/login", async (req: Request, res: Response) => {
        const { email, password } = req.body as UserCredentials
        if (!email || !password) {
            res.status(400).json({ error: 'All fields are required' });
		}
        try {
			const result = await sql`
				select * from users where email=${email}`
			if (result.length === 0) {
				res.status(400).json({ message: "User not found" })
				return
			}
			const user = result[0]
			const isPasswordMatch = await bcrypt.compare(password, user.password)
			if (!isPasswordMatch) {
				res.status(401).json({ message: "Invalid credentials" })
				return
			}
			const userData = {
				firstName: user.first_name,
				secondName: user.second_name,
				email: user.email,
			}
			const token = jwt.sign(
				{ id: user.id, email: user.email },
				process.env.JWT_SECRET as string,
				{ expiresIn: "5h" }
			)			
			
			res.status(200).json({ message: "Authorized successfully", token, userData: userData });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: `Server error ${error}` });
        }
    })
}
