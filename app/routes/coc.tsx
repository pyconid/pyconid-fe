// routes/coc.tsx
import { redirect } from "react-router";

export function loader() {
	return redirect("/code-of-conduct");
}

export default function CocRedirect() {
	return null;
}
