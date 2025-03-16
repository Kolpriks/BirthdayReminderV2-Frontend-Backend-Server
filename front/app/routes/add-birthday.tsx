import { Form , useActionData, useLoaderData } from "@remix-run/react"
import "../styles.css"
import { LoaderFunctionArgs, MetaFunction, redirect } from "@remix-run/node"
import { tokenCookie } from "../cookies.server"
import { BASE_URL } from "../root"

interface Birthday {
	user_id: number;
	first_name: string;
	second_name: string;
	date: string;
}
  
export const meta: MetaFunction = () => {
	return [
		{ title: "Birthday Reminder - Add Birthday Page"},
		{ 
			name: "Page, where you can add someone birthday to stay remember it and get notified when it comes", 
			content: "BirthdayReminder site"
		},
	]
}

export const action = async ({request}: {request: Request}) => {
	const cookieHeader = request.headers.get("Cookie")
	const token = await tokenCookie.parse(cookieHeader)
	if (!token) {
		return redirect("/login")
	}

	const formData = await request.formData()
	const firstName = formData.get("firstName") as string
	const secondName = formData.get("secondName") as string
	const date = formData.get("date") as string

	if (!firstName || !secondName || !date) {
		return Response.json(
			{ error: "All fields are required"},
			{ status: 400 }
		)
	}

	try {
		const response = await fetch(`${BASE_URL}/v1/birthdays/add-birthday`, {
			method: "POST",
			headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, },
			body: JSON.stringify({ firstName, secondName, date }),
		})
	
		if (!response.ok) {
			const error = await response.json()
			return Response.json({ error: error.error }, { status: response.status })
		}
		
		const result = response.json()

		// return redirect("/birthdays", {result}) //TODO: Сделать отдельную страницу для отображения дней рождений
		return result
	} catch (error) {
		return Response.json(
			{ error: `Something happend ${error}` },
			{ status: 500 }
		)
	}
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const token = await tokenCookie.parse(request.headers.get("Cookie"))
	if (!token) return redirect("/login")

	try {
		const response = await fetch("http://back:3000/v1/birthdays/get-birthdays", {
			method: "GET",
			headers: { Authorization: `Bearer ${token}`, }
		})

		if (!response.ok) {
            return Response.json(
                { error: `HTTP error! status: ${response.status}` },
                { status: response.status }
            )
        }

		const birthdays: Birthday[] = await response.json()
		return birthdays
	} catch (error) {
		console.error("Loader error:", error);
        return Response.json(
            { error: "Failed to load birthdays" },
            { status: 500 }
        )
	}


}

export default function AddBirthday() {
	const actionData = useActionData<typeof action>()
    const birthdays = useLoaderData<typeof loader>();


    return (
        <div>
			{birthdays?.error && (
				<div className="error-alert">
					Error loading birthdays: {birthdays.error}
				</div>
			)}
			
			{actionData?.error && (
                <div className={actionData.status === 409 ? 'warning' : 'error'}>
                    {actionData.error}
                </div>
            )}
			
			<div >
                {birthdays.length > 0 ? (
                    birthdays.map((birthday: Birthday) => (
                        <div key={`${birthday.first_name}-${birthday.second_name}-${birthday.date}`}>
                            <h3>{birthday.first_name} {birthday.second_name}</h3>
                            <p>Date: {new Date(birthday.date).toLocaleDateString()}</p>
                        </div>
                    ))
                ) : (
                    <div className="empty-state">No birthdays found</div>
                )}
            </div>

			<Form method="post">
				<div>
					<label htmlFor="name">Enter firstName</label>
					<input type="name" name="firstName" id="firstname" placeholder="Name" required/>
				</div>
				<div>
					<label htmlFor="name">Enter secondName</label>
					<input type="name" name="secondName" id="secondName" placeholder="Surname" required/>
				</div>
				<div>
					<label htmlFor="date">Enter date</label>
					<input type="date" name="date" id="firstname" placeholder="Name" required/>
				</div>
				<button type="submit">Add Birthday</button>
			</Form>
        </div>
    )
}
