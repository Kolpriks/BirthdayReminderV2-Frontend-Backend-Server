import type { MetaFunction } from "@remix-run/node";
import "../styles.css"

export const meta: MetaFunction = () => {
  return [
    { title: "Birthday Reminder" },
    { name: "description", content: "Don't forget your friend's birthday!" },
  ];
};

export default function Index() {
  return (
    <div>
      main page
    </div>
  );
}

