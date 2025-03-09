import { MetaFunction } from "@remix-run/node"
import { Form, redirect } from "@remix-run/react"

export const meta: MetaFunction = () => {
	return [
		{ title: "Birthday Reminder - Registration Page"},
		{ name: "Page, where you can registrate your account", content: "BirthdayReminder site"},
	]
}

export const action = async ({request}: {request: Request}) => {
	const formData = await request.formData()
	const firstName = formData.get("firstName") as string
	const secondName = formData.get("secondName") as string
	const email = formData.get("email") as string
	const password = formData.get("password") as string
	const confirmPassword = formData.get("confirmPassword") as string

	if (!firstName || !secondName || !email || !password || !confirmPassword) {
		return Response.json(
			{ error: "All fields are required"},
			{ status: 400 }
		)
	}

	if (password !== confirmPassword){
		return Response.json(
			{ error: "Passwords do not match" },
			{ status: 400 }
		)
	}

	const data = {
		first_name: firstName,
		second_name: secondName,
		email: email,
		password: password,
	}

	const response = await fetch("http://localhost:3000/v1/auth/register", {
		method: "POST",
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify(data),
	})

	if (!response.ok) {
		const error = await response.json()
		return { error: error.message }
	}

	return redirect('/login')
}


export default function Registration() {
	return (
        <div>
          <div>
                <h2>Registrate your account</h2>
                <Form method="post">	
					<div>
						<label htmlFor="email">Enter your first name</label>
						<input type="name" name="firstName" id="firstName" placeholder="Your second Name" required/>
					</div>
					<div>
						<label htmlFor="secondName">Enter your second name</label>
						<input type="name" name="secondName" id="secondName" placeholder="Your second Name" required/>
					</div>
					<div>
						<label htmlFor="email">Enter your email</label>
						<input type="email" name="email" id="email" placeholder="youremail@gmail.com" required/>
					</div>
					<div>
						<label htmlFor="password">Enter your password</label>
						<input type="password" name="password" id="password" placeholder="password" required/>
					</div>
					<div>
						<label htmlFor="password">Repeet your password</label>
						<input type="password" name="confirmPassword" id="confirmPassword" placeholder="password" required/>
					</div>
					<button type="submit">Registrate</button>
				</Form>
            </div>
        </div>
    )
}

