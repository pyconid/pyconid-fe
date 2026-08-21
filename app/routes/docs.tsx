// routes/coc.tsx
import { redirect } from "react-router";

export function loader() {
	return redirect(
		"https://drive.google.com/drive/folders/1finCXZUu4fTc97I1ZUUbCqbS7XczbxaK?usp=sharing",
	);
}

export default function CocRedirect() {
	return null;
}
