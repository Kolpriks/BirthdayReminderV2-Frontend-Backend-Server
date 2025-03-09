import { Express, Request, Response } from "express"
import { Sql } from "postgres"
import jwt from "jsonwebtoken"

export const user = (app: Express, sql: Sql) => {
	app.get("/v1/auth/user", async (req: Request, res: Response) => {
		const authHeader = req.headers.authorization
		if (!authHeader) {
			res.status(401).json({ error: "Authorization header missing" })
			return
		}
  
		try {
			const token = authHeader.split(" ")[1]
			const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };
		
			const [user] = await sql`
				select first_name, second_name, email 
				from users 
				where id = ${decoded.id}
			`
  
			if (!user) {
				res.status(404).json({ error: "User not found" })
			}
  
			res.json({
				firstName: user.first_name,
				secondName: user.second_name,
				email: user.email
			})
		} catch (error) {
			console.error(error)
			res.status(401).json({ error: "Invalid token" })
		}
	})
}
