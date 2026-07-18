import { useMemo, useRef, useState } from "react";
import { Form, Link, Outlet, redirect, useLocation } from "react-router";
import { twMerge } from "tailwind-merge";
import { getMe, signOut } from "~/api/endpoint/.server/auth";
import { meSchema } from "~/api/schema/auth";
import { useOutsideAlerter } from "~/hooks/useOutsideAlerter";
// import { useOutsideAlerter } from "~/hooks/useOutsideAlerter";
import { authenticator } from "~/services/auth/$.server";
import {
	commitMessageSession,
	getMessageSession,
} from "~/services/sessions/message.server";
import type { Route } from "./+types/cms";

export const loader = async ({ request }: Route.LoaderArgs) => {
	const credentials = await authenticator.isAuthenticated(request);
	if (!credentials) {
		return redirect("/login");
	}
	const res = await getMe({ request });
	if (res.status === 401) {
		await signOut(request);
		const sessionMessage = await getMessageSession(
			request.headers.get("Cookie"),
		);
		sessionMessage.flash("toast", {
			message: "Token expired, please login again.",
			variant: "default",
			title: "Logout success!",
		});
		return await authenticator.logout(request, {
			redirectTo: "/",
			headers: {
				"Set-Cookie": await commitMessageSession(sessionMessage),
			},
		});
	}
	if (res.status !== 200) {
		console.error("Failed to fetch user data", res.status, await res.text());
		throw new Response("Failed to fetch user data", { status: res.status });
	}
	const jsonRes = meSchema.parse(await res.json());
	if (jsonRes.participant_type !== "Management") {
		return redirect("/");
	}
	return null;
};

export default function CMSHomePage() {
	const location = useLocation();
	const [isSideOpen, setIsSideOpen] = useState(false);

	const hamburgerRef = useRef(null);
	const sidebarRef = useRef(null);
	useOutsideAlerter([hamburgerRef, sidebarRef], () => {
		if (window.innerWidth <= 1000) {
			setIsSideOpen(false);
		}
	});

	const path = useMemo(() => {
		return location.pathname.split("/").at(-1);
	}, [location]);

	return (
		<main className="relative w-full">
			<nav className="sticky z-20 top-0 bg-white w-full flex justify-between items-center p-4 border border-gray-500">
				<div className="flex items-center">
					<button
						className="p-2"
						aria-label="Open menu"
						type="button"
						onClick={() => setIsSideOpen(!isSideOpen)}
						ref={hamburgerRef}
					>
						<svg
							aria-label="hamburger"
							width="24"
							height="24"
							fill="#000000"
							viewBox="0 0 24 24"
						>
							<title>Hamburger</title>
							<rect x="4" y="6" width="16" height="2" rx="1" fill="#000000" />
							<rect x="4" y="11" width="16" height="2" rx="1" fill="#000000" />
							<rect x="4" y="16" width="16" height="2" rx="1" fill="#000000" />
						</svg>
					</button>
					<Link to="/">
						<img
							src="/svg/logo/2026/logo-black.svg"
							alt="PyconID 2026"
							className="h-6 lg:h-12"
						/>
					</Link>
				</div>
				<Form action="/auth/logout" method="post">
					<button
						type="submit"
						className="bg-secondary text-background text-sm px-5 py-2.5 font-bold rounded-xl cursor-pointer lg:text-base"
					>
						Logout
					</button>
				</Form>
			</nav>
			<aside
				ref={sidebarRef}
				className={twMerge(
					"top-20 z-10 border-r border-gray-500 p-4 w-60 min-h-full bg-white",
					isSideOpen ? "fixed" : "hidden",
				)}
			>
				<ul className="sticky flex flex-col gap-4">
					<li
						className={twMerge(
							"underline",
							path === "voucher" ? "font-bold" : "",
						)}
					>
						<Link to="/cms/voucher">Voucher</Link>
					</li>
					<li
						className={twMerge(
							"underline",
							path === "organizer" ? "font-bold" : "",
						)}
					>
						<Link to="/cms/organizer">Organizer</Link>
					</li>
					<li
						className={twMerge(
							"underline",
							path === "speaker" ? "font-bold" : "",
						)}
					>
						<Link to="/cms/speaker">Speaker</Link>
					</li>
					<li
						className={twMerge(
							"underline",
							path === "volunteer" ? "font-bold" : "",
						)}
					>
						<Link to="/cms/volunteer">Volunteer</Link>
					</li>
					<li
						className={twMerge("underline", path === "user" ? "font-bold" : "")}
					>
						<Link to="/cms/user">User QR</Link>
					</li>
					<li
						className={twMerge(
							"underline",
							path === "schedule" ? "font-bold" : "",
						)}
					>
						<Link to="/cms/schedule">Schedule</Link>
					</li>
					<li
    					className={twMerge(
        					"underline",
        					path === "analytics" ? "font-bold" : "",
    					)}
					>
    					<Link to="/cms/home">Analytics</Link>
					</li>
				</ul>
			</aside>
			<div
				className={twMerge(
					"py-4 pr-4 pl-4 min-w-full max-w-full",
					isSideOpen ? "lg:pl-64" : "",
				)}
			>
				<Outlet />
			</div>
		</main>
	);
}
