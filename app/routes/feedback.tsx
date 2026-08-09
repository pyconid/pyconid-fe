// routes/coc.tsx
import { redirect } from "react-router";

export function loader() {
	return redirect(
		"https://docs.google.com/forms/d/e/1FAIpQLSe-NK85w0exiI9yPDD8oLBl5UXGLx6uqensPJn0uUUkUdqfgw/viewform",
	);
}

export default function CocRedirect() {
	return null;
}
