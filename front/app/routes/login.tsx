import { MetaFunction } from "@remix-run/node"
import { Form, redirect } from "@remix-run/react"
import { tokenCookie } from "../cookies.server"


export const meta: MetaFunction = () => {
	return [
		{ title: "Birthday Reminder - Login Page"},
		{ name: "Page, where you can login into your account", content: "BirthdayReminder site"},
	]
}

export const action = async ({request}: {request: Request}) => {
	const formData = await request.formData()
	const email = formData.get("email") as string
	const password = formData.get("password") as string

	if (!email || !password ) {
		return Response.json(
			{ error: "All fields are required"},
			{ status: 400 }
		)
	}

	try {
		const response = await fetch("http://back:3000/v1/auth/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" }, 
			body: JSON.stringify({ email, password }),
		})
	
		if (!response.ok) {
			const error = await response.json()
			return Response.json({ error: error.message }, { status: 401 })
		}
	
		const { token } = await response.json()
		
		const headers = new Headers()
		headers.append("Set-Cookie", await tokenCookie.serialize(token))

		return redirect("/profile", {headers})
	} catch (error) {
		return Response.json(
			{ error: `Connection error: ${error}` },
			{ status: 500 }
		)
	}
}


export default function Login() {
	return (
        <div>
            <div>
                <h2>Login to your account</h2>
                <Form method="post">	
					<div>
						<label htmlFor="email">Enter your email</label>
						<input type="email" name="email" id="email" placeholder="youremail@gmail.com"/>
					</div>
					<div>
						<label htmlFor="password">Enter your password</label>
						<input type="password" name="password" id="password" placeholder="password"/>
					</div>
					<button type="submit">Login</button>
				</Form>
            </div>
        </div>
    )
}
