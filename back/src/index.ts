import express from 'express'
import cors from "cors"
import dotenv from 'dotenv'
import { sql } from './db'
import { login } from './api/auth/login'
import { register } from './api/auth/register'
import { user } from './api/auth'
import { addBirthday, getBirthdays } from './api/birthdays'

dotenv.config({ path: '../.env' })


const app = express()
const PORT = process.env.BACKEND_PORT || 8080

app.use(cors())
app.use(express.json())

register(app, sql)
login(app, sql)
user(app, sql)
addBirthday(app, sql)
getBirthdays(app, sql)

app.listen(PORT, () => {
    console.log(`Server is running on PORT:${PORT}`)
})
