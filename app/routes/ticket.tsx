import { redirect } from "react-router";
import {
	createPayment,
	getPayment,
	getPaymentVoucherValidate,
} from "~/api/endpoint/.server/payment";
import { ticket as ticketApi } from "~/api/endpoint/.server/ticket";
import {
	createPaymentSuccessSchema,
	getPaymentVoucherValidateSchema,
	paymentResponseSchema,
} from "~/api/schema/payment";
import { TicketsResponseSchema } from "~/api/schema/ticket";
import { Footer } from "~/components/layouts/navigation/footer";
import { Header } from "~/components/layouts/navigation/header";
import { Ticket } from "~/components/sections/ticket/ticket";
import { authenticator } from "~/services/auth/$.server";
import type { Route } from "./+types/ticket";

export function meta() {
	return [
		{ title: "PyCon ID 2026 Ticket" },
		{ name: "PyCon ID 2026 Ticket Page", content: "Ticket page" },
	];
}

export const loader = async ({ request }: Route.LoaderArgs) => {
	const ticketData = await ticketApi();
	if (!ticketData.ok) {
		throw new Response("Failed to fetch tickets", { status: 500 });
	}
	const ticketJson = await ticketData.json();
	const tickets = TicketsResponseSchema.parse(ticketJson);

	// Check auth + existing payments
	const user = await authenticator.isAuthenticated(request);
	let userTicketStatus: "none" | "paid" | "unpaid" = "none";
	if (user) {
		const paymentData = await getPayment({ request });
		if (paymentData.ok) {
			const paymentJson = await paymentData.json();
			const payments = paymentResponseSchema.parse(paymentJson);
			const now = new Date();
			const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

			const paidPayment = payments.results.find((p) => p.status === "paid");
			const unpaidWithin24h = payments.results.find((p) => {
				if (p.status !== "unpaid") return false;
				const createdAt = new Date(p.created_at);
				// Only block if the unpaid payment was created within the last 24 hours
				return createdAt > twentyFourHoursAgo;
			});

			if (paidPayment) {
				userTicketStatus = "paid";
			} else if (unpaidWithin24h) {
				userTicketStatus = "unpaid";
			}
		}
	}

	return { tickets: tickets.results, user, userTicketStatus };
};

export const action = async ({ request }: Route.ActionArgs) => {
	const formData = await request.formData();
	const intent = formData.get("intent");

	// Check authentication for protected actions
	if (intent === "buy-ticket" || intent === "apply-voucher") {
		const credentials = await authenticator.isAuthenticated(request);
		if (!credentials) {
			return {
				buy_ticket: {
					success: false,
					clientError: "Please login to continue",
					serverError: null,
				},
				apply_voucher: null,
			};
		}
	}

	if (intent === "buy-ticket") {
		const ticket_id = formData.get("ticket_id") as string;
		const voucher_code = formData.get("voucher_code") as string;

		if (typeof ticket_id !== "string" || ticket_id.trim() === "") {
			return {
				buy_ticket: {
					success: false,
					clientError: "Invalid ticket ID",
					serverError: null,
				},
				apply_voucher: null,
			};
		}

		const res = await createPayment({
			body: {
				ticket_id,
				voucher_code: voucher_code.trim() === "" ? null : voucher_code.trim(),
			},
			request,
		});

		if (res.status >= 400 && res.status < 500) {
			const errorData = await res.json();
			return {
				buy_ticket: {
					success: false,
					clientError: errorData.message || "Client error occurred",
					serverError: null,
				},
				apply_voucher: null,
			};
		}

		if (res.status >= 500) {
			console.error("Server error:", await res.text());
			return {
				buy_ticket: {
					success: false,
					clientError: null,
					serverError: "Server error occurred. Please try again later.",
				},
				apply_voucher: null,
			};
		}

		const data = createPaymentSuccessSchema.parse(await res.json());
		if (!data.payment_link) {
			return redirect("/auth/payment");
		}
		return redirect(data.payment_link);
	}

	if (intent === "apply-voucher") {
		const voucher_code = formData.get("voucher_code") as string;
		const ticket_id = formData.get("ticket_id") as string;
		const res = await getPaymentVoucherValidate({
			code: voucher_code,
			ticket_id: ticket_id ?? "",
			request,
		});

		if (res.status >= 400 && res.status < 500) {
			const errorData = await res.json();
			return {
				buy_ticket: null,
				apply_voucher: {
					success: null,
					clientError: errorData.message || "Client error occurred",
					serverError: null,
				},
			};
		}

		if (!res.ok) {
			const errorData = await res.text();
			console.error("error when validate voucher:", errorData);
			return {
				buy_ticket: null,
				apply_voucher: {
					success: null,
					clientError: null,
					serverError: "something wrong with server",
				},
			};
		}

		return {
			buy_ticket: null,
			apply_voucher: {
				success: getPaymentVoucherValidateSchema.parse(await res.json()),
				clientError: null,
				serverError: null,
			},
		};
	}

	return null;
};

export default function TicketPage({ loaderData }: Route.ComponentProps) {
	return (
		<main>
			<Header />
			<Ticket
				tickets={loaderData.tickets}
				user={loaderData.user}
				userTicketStatus={loaderData.userTicketStatus}
			/>
			<Footer />
		</main>
	);
}
