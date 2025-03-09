import { Express, Request, Response } from "express"
import { Sql } from "postgres"
import jwt from "jsonwebtoken"

interface Birthday {
	user_id: number;
	first_name: string;
	second_name: string;
	date: string;
}

//TODO: Добавить пагинацию запроса (не отдавать все данные за раз)

export const getBirthdays = (app: Express, sql: Sql) => {
	app.get("/v1/birthdays/get-birthdays", async (req: Request, res: Response) => {
		const authHeader = req.headers.authorization

		if (!authHeader) {
			res.status(401).json({ error: "Authorization header missing" })
			return
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

			const birthdays = await sql<Birthday[]>`
				select * from birthdays where user_id=${user.id}
			`
			
			res.status(200).json(birthdays)
		} catch (error) {
			console.error(error)
			res.status(500).json({ error: `Server error: ${error}` })
		}
	})
}
