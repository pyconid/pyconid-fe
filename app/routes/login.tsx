import { Form, useNavigation } from "react-router";
import { PasswordInput } from "~/components/shared/password-input/password-input";
import { StrategyOptions } from "~/services/auth/strategy";
import type { Route } from "./+types/login";
import type { AuthLayoutHandleProps } from "./layouts/auth";

export const handle: AuthLayoutHandleProps = { title: "Login" };

export function meta() {
	return [
		{ title: "PyCon ID 2026 Login" },
		{ name: "PyCon ID 2026 Login Page", content: "Login page" },
	];
}

export const loader = async ({ request }: Route.LoaderArgs) => {
	const url = new URL(request.url);
	const redirectTo = url.searchParams.get("redirectTo");
	return {
		redirectTo,
	};
};

export default function Login(componentProps: Route.ComponentProps) {
	const navigation = useNavigation();
	const isSubmitting = navigation.state === "submitting";
	const { redirectTo } = componentProps.loaderData;

	return (
		<main className="w-full">
			<Form
				action={`/auth/${StrategyOptions.SIGNIN_FORM}${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`}
				method="post"
				className="space-y-4 w-full"
			>
				<div className="flex flex-col w-full">
					<label
						htmlFor="email"
						className="text-xs font-bold mb-1.5 text-gray-800"
					>
						Email
					</label>
					<input
						id="email"
						name="email"
						placeholder="yourmail@example.com"
						type="email"
						className="border border-neutral-200 bg-neutral-50/50 w-full h-12 text-gray-800 px-4 focus:outline-none focus:border-surface focus:ring-1 focus:ring-surface transition-all"
					/>
				</div>
				<PasswordInput id="password" name="password" label="Password" />
				<button
					type="submit"
					className="bg-surface w-full h-12 text-white font-bold mt-2 cursor-pointer transition-all duration-150 hover:bg-surface/90 disabled:bg-surface/50 disabled:cursor-not-allowed"
					disabled={isSubmitting}
				>
					{isSubmitting ? "Loading..." : "Login to Your Account"}
				</button>

				<p className="text-center">
					{/* Lupa password?{" "}
					<Link to="/forgot-password" className="underline text-secondary">
						Reset Password
					</Link> */}
					Forgot Password? please contact pycon@python.or.id
				</p>
			</Form>
		</main>
	);
}
