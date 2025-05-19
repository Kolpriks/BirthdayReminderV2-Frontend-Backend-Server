import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import "./styles.css"
const __app_env_development__ = process.env.NODE_ENV
export const BASE_URL = __app_env_development__ ? "http://localhost:3000" : "http://back:3000"

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

const routes = [
  {
    id: 1,
    name: "Home",
    route: "/"
  },
  {
    id: 2,
    name: "Profile",
    route: "/profile"
  },
  {
    id: 3,
    name: "Add Birthday",
    route: "/add-birthday"
  }
]

export function Layout({ children }: { children: React.ReactNode }) {

	return (
		<html lang="en">
		<head>
			<meta charSet="utf-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<Meta />
			<Links />
		</head>
		<body>
			<header>
			<nav className="nav" style={{backgroundColor: 'lime'}}>
				<h1>Birthday-Reminder</h1>
				<ul className="nav-ul">
				{routes.map(({ id, name, route }) => (
					<li key={id}>
					<Link to={route}>{name}</Link>
					</li>
				))}
				</ul>
			</nav>
			</header>
				{children}
			<ScrollRestoration />
			<Scripts />
		</body>
		</html>
	);
}

export default function App() {
  return <Outlet />;
}
