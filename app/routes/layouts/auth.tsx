// import type { FC } from "react";
import {
	// Form,
	// Link,
	type LoaderFunctionArgs,
	Outlet,
	redirect,
	useLocation,
	useMatches,
} from "react-router";
import { useMergeHanlde } from "~/hooks/use-merge-handle";
import { authenticator } from "~/services/auth/$.server";
import {
	commitMessageSession,
	getMessageSession,
} from "~/services/sessions/message.server";

export interface AuthLayoutHandleProps {
	title: string;
}

// type LoginOAuthProps = {
// 	title: string;
// 	provider: string;
// 	image: string;
// };

// const LoginOAuth: FC<LoginOAuthProps> = ({ title, provider, image }) => {
// 	return (
// 		<Form action={`/auth/${provider}`} method="post" className="w-full">
// 			<button
// 				type="submit"
// 				className="flex items-center w-full justify-center gap-x-2 bg-gray-200 p-2.5 cursor-pointer transition-all duration-150 hover:bg-gray-300"
// 			>
// 				<img alt={title} src={image} className="size-4 sm:size-8" />
// 				<div>{title}</div>
// 			</button>
// 		</Form>
// 	);
// };

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const credentials = await authenticator.isAuthenticated(request);
	const messageSession = await getMessageSession(request.headers.get("Cookie"));

	if (credentials) {
		messageSession.flash("toast", {
			title: "Success!",
			message: "You are already logged in!",
			type: "success",
		});

		return redirect("/", {
			headers: { "Set-Cookie": await commitMessageSession(messageSession) },
		});
	}

	return null;
};

const pathnames = ["/login", "/register"];

export default function AuthLayout() {
	const matches = useMatches();
	const handle: AuthLayoutHandleProps = useMergeHanlde({
		matches,
		options: { title: "PyCon 2026" },
	});

	const { pathname } = useLocation();

	return (
		<section className="h-screen font-sans">
			<div className="grid w-full max-w-[88rem] mx-auto h-full content-center px-5 md:px-8 lg:px-0 lg:grid-cols-2">
				<div className="hidden lg:block overflow-hidden">
					<img
						alt="PyCon 2026 abstract graphic"
						src="/images/bg-auth-2026.png"
						className="w-full h-full object-cover"
					/>
				</div>
				<div className="bg-background py-5 px-10 relative overflow-hidden">
					<div className="size-full flex flex-col items-center justify-center">
						<div className="mb-6">
							<img
								alt="PyCon ID dark logo"
								src="/svg/logo/2026/logo-black.svg"
								className="h-14 w-auto lg:h-16"
							/>
						</div>

						<Outlet />

						{pathnames.includes(pathname) && (
							<>
								{/* <div className="flex items-center w-full h-7 my-8">
									<div className="flex-grow border-t border-neutral-200"></div>
									<span className="px-4 text-neutral-400">or</span>
									<div className="flex-grow border-t border-neutral-200"></div>
								</div> */}

								<div className="w-full grid grid-cols-2 gap-4">
									{/* <LoginOAuth
											title="Continue with Google"
											image="/svg/google-logo.svg"
											provider="google"
										/>
										<LoginOAuth
											title="Continue with Github"
											image="/svg/github-logo.svg"
											provider="github"
										/> */}

									{/* <p className="col-span-full w-max mx-auto">
										{pathname === "/login" ? (
											<>
												Belum memiliki akun?{" "}
												<Link
													to="/register"
													className="underline text-secondary"
												>
													Register
												</Link>
											</>
										) : (
											<>
												Sudah memiliki akun?{" "}
												<Link to="/login" className="underline text-secondary">
													Login
												</Link>
											</>
										)}
									</p> */}
								</div>

								<div className="text-sm mt-12 text-center font-medium">
									<p className="text-center">
										By creating this account you agree to our
									</p>
									<a
										href="/code-of-conduct"
										target="_blank"
										rel="noreferrer noopener"
										className="underline text-surface"
									>
										Code of Conduct
									</a>
								</div>
							</>
						)}
					</div>

					<div className="absolute top-0 right-0 bg-surface text-white px-10 py-4 text-xl font-bold md:px-14">
						{handle.title}
					</div>
				</div>
			</div>
		</section>
	);
}
