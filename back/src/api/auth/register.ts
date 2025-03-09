import { Express, Request, Response } from "express"
import { Sql } from "postgres"
import bcrypt from "bcrypt"

interface RegistrationUserData {
	first_name: string;
	second_name: string;
	email: string;
	password: string; 
}

const SALTROUNDS = 10; 

export const register = (app: Express, sql: Sql) => {
    app.post("/v1/auth/register", async (req: Request, res: Response) => {
		const userData = req.body as RegistrationUserData
		try {
			const hashedPassword = await bcrypt.hash(userData.password, SALTROUNDS)
			const ifUserExists = await sql`
				select * from users where email=${userData.email}`
			if (ifUserExists.length > 0){
				res.status(400).json({message: "User already exists!", data: ifUserExists})
				return
			}
			const result = await sql`
				insert into users (first_name, second_name, email, password)
				values (${userData.first_name}, ${userData.second_name}, ${userData.email}, ${hashedPassword})
				returning *
			`
			res.status(201).json({ message: "User succesfully registrated", data: result })
		} catch (error) {
			console.error(error)
			res.status(500).json({ message: `Internal server error ${error}` })
		}
	})
}
