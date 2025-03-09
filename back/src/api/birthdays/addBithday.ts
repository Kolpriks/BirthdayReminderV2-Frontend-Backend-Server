import { Express, Request, Response } from "express"
import { Sql } from "postgres"
import jwt from "jsonwebtoken"

interface DbError extends Error {
    code?: string
}

export const addBirthday = (app: Express, sql: Sql) => {
	app.post("/v1/birthdays/add-birthday", async (req: Request, res: Response) => {
		const authHeader = req.headers.authorization
		const {firstName, secondName, date} = req.body

		if (!authHeader) {
			res.status(401).json({ error: "Authorization header missing" })
			return
		}
		
		if(!firstName || !secondName || !date) {
			res.status(400).json({ error: "All fileds are required!" })
		}

		try {
			const token = authHeader.split(" ")[1]
			const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };
				
			const [user] = await sql`
				select *
				from users 
				where id = ${decoded.id}
			`
	
			if (!user) {
				res.status(404).json({ error: "User not found" })
			}
			
			const [result] = await sql`
				insert into birthdays (user_id, first_name, second_name, date)
				values (${user.id}, ${firstName}, ${secondName}, ${date})
				returning *
			`
			res.status(201).json({ message: "Birthday successfully added!", data: result })
		} catch (error) {
			console.error(error)
			if ((error as DbError).code === '23505') {
                res.status(409).json({ 
                    error: "This birthday already exists in your list" 
                })
            }
			res.status(500).json({ error: `Server error: ${error}` })
		}
	})
}
