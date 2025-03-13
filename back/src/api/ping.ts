import { Express, Request, Response } from "express"

export const ping = (app: Express) => {
	app.get("/v1/ping", async (req: Request, res: Response) => {
		const log = process.env.POSTGRES_USER
		res.status(200).json(`pong ${log}`)
	})
}
