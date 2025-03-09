import { createCookie } from "@remix-run/node"

export const tokenCookie = createCookie("token", {
	httpOnly: true,
	sameSite: "lax",
	path: "/",
	maxAge: 60 * 60 * 5,
})
