import { LoaderFunctionArgs, MetaFunction, redirect } from "@remix-run/node"
import { tokenCookie } from "../cookies.server"
import { Form, useLoaderData } from "@remix-run/react"

interface Profile {
	email: string;
	firstName: string;
	secondName: string;
}

export const meta: MetaFunction = () => {
	return [
		{ title: "Birthday Reminder - Login/Registration Page"},
		{ name: "Page, where you can login into your account or registrate new one", content: "BirthdayReminder site"},
	]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const cookieHeader = request.headers.get("Cookie")
	const token = await tokenCookie.parse(cookieHeader)
  
	if (!token) {
		return redirect("/login")
	}
  
	const response = await fetch("http://back:3000/v1/auth/user", {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})
  
	if (!response.ok) {
		return redirect("/login", {
			headers: {
			"Set-Cookie": await tokenCookie.serialize(null, { maxAge: 0 }),
			},
		})
	}
  
	const userData = await response.json();
	return userData as Profile;
}

export const action = async () => {
	return redirect("/login", {
		headers: {
			"Set-Cookie": await tokenCookie.serialize(null, {
				expires: new Date(0),
				maxAge: 0 
			})
		}
	})
}

export default function Profile() {
	const user = useLoaderData<typeof loader>();
	return (
		<div>
			<h1>Welcome home, {user.firstName} {user.secondName}</h1>
			<h1>Here is your email: {user.email}</h1>
			<div>
				<Form method="post" action="/profile">
					<button type="submit">Logout</button>
				</Form>
			</div>
		</div>
	)
}
