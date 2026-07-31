import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Form, Link, redirect, useNavigation } from "react-router";
import { toast } from "sonner";
import { getTicket } from "~/api/endpoint/.client/ticket";
import { createVoucher } from "~/api/endpoint/.server/voucher";
import { clientErrorSchema } from "~/api/schema/shared";
import { TicketsResponseSchema } from "~/api/schema/ticket";
import { Checkbox } from "~/components/sections/cms-voucher/checkbox";
import { Input } from "~/components/sections/cms-voucher/input";
import { MultiDropdownSearch } from "~/components/sections/cms-voucher/multiDropdownSearch";
import { Select } from "~/components/sections/cms-voucher/select";
import type { Route } from "./+types/voucher-create";

const PARTICIPANT_TYPES = [
	"Keynote Speaker",
	"Speaker",
	"Organizer",
	"Volunteer",
	"Sponsor",
	"Community",
	"Patron",
] as const;

type ParticipantType = (typeof PARTICIPANT_TYPES)[number];

type TicketOption = {
	label: string;
	value: string;
};

export const action = async ({ request }: Route.ActionArgs) => {
	const formData = await request.formData();
	const code = formData.get("code");
	const value = formData.get("value");
	const quota = formData.get("quota");
	const rawType = formData.get("type");
	const rawEmails = formData.get("email_whitelist");
	const ticketIds = formData
		.getAll("ticket_ids")
		.map((value) => (typeof value === "string" ? value.trim() : ""))
		.filter((value) => value !== "");
	const is_active = !!formData.get("is_active");

	let type: ParticipantType | null = null;

	if (typeof rawType === "string" && rawType.trim() !== "") {
		if ((PARTICIPANT_TYPES as readonly string[]).includes(rawType)) {
			type = rawType as ParticipantType;
		} else {
			type = null;
		}
	}

	let email_whitelist: { emails: string[] } | null = null;

	if (typeof rawEmails === "string") {
		const emails = rawEmails
			.split(",")
			.map((e) => e.trim())
			.filter((e) => e.length > 0);

		if (emails.length > 0) {
			email_whitelist = { emails };
		} else {
			email_whitelist = null;
		}
	} else {
		email_whitelist = null;
	}

	const json = {
		code: typeof code === "string" ? code : "",
		value: value ? Number(value) : null,
		quota: quota ? Number(quota) : 0,
		type,
		email_whitelist,
		is_active: is_active,
		ticket_ids: ticketIds.length > 0 ? ticketIds : null,
	};

	console.log(json);
	const res = await createVoucher({ request, json });

	if (res.status === 422) {
		const json = await res.json();
		console.error("Validation error:", json);
		const clientError = clientErrorSchema.parse(json);
		return {
			clientError,
			serverError: null,
		};
	} else if (res.status === 400) {
		const json = await res.json();
		console.error("Bad request error:", json);
		const clientError = clientErrorSchema.parse({
			message: json.message,
			errors: [],
		});
		return {
			clientError,
			serverError: null,
		};
	}
	if (!res.ok) {
		console.error("Failed to create voucher:", res.statusText);
		return {
			clientError: null,
			serverError: res.statusText,
		};
	}

	return redirect("/cms/voucher");
};

function getTicketIdsFieldError(
	errors: { field: string; message: string }[] | undefined,
) {
	return (
		errors
			?.filter(
				(item) =>
					item.field === "ticket_ids" || item.field.startsWith("ticket_ids"),
			)
			.map((item) => item.message)
			.join(", ") || undefined
	);
}

export default function VoucherCreatePage(
	componentProps: Route.ComponentProps,
) {
	const actionData = componentProps.actionData;
	const navigation = useNavigation();

	const [ticketSearch, setTicketSearch] = useState<string | null>(null);
	const [formValue, setFormValue] = useState<{
		ticket_ids: TicketOption[];
	}>({
		ticket_ids: [],
	});

	const ticketQuery = useQuery({
		queryKey: ["ticket", ticketSearch],
		queryFn: async () => {
			const res = await getTicket();
			const data = await res.json();
			return TicketsResponseSchema.parseAsync(data);
		},
	});

	useEffect(() => {
		if (actionData?.clientError?.message) {
			toast.error(actionData.clientError.message);
		}
		if (actionData?.serverError) {
			toast.error(actionData.serverError);
		}
	}, [actionData]);

	return (
		<div className="max-w-[500px] border border-gray-500 rounded-lg p-4">
			<Form method="post">
				<Input
					id="code"
					name="code"
					label="code"
					placeholder="code"
					errorMessage={
						actionData?.clientError?.errors
							.filter((item) => item.field === "code")
							.map((item) => item.message)
							.join(", ") || undefined
					}
				/>
				<Input
					id="value"
					type="number"
					name="value"
					label="value"
					placeholder="value"
					errorMessage={
						actionData?.clientError?.errors
							.filter((item) => item.field === "value")
							.map((item) => item.message)
							.join(", ") || undefined
					}
				/>
				<Input
					id="quota"
					type="number"
					name="quota"
					label="quota"
					placeholder="quota"
					errorMessage={
						actionData?.clientError?.errors
							.filter((item) => item.field === "quota")
							.map((item) => item.message)
							.join(", ") || undefined
					}
				/>
				<Select
					id="type"
					name="type"
					label="participant type"
					placeholder="Select participant type"
					defaultValue={null}
					options={[
						{ value: "Keynote Speaker", label: "Keynote Speaker" },
						{ value: "Speaker", label: "Speaker" },
						{ value: "Organizer", label: "Organizer" },
						{ value: "Volunteer", label: "Volunteer" },
						{ value: "Sponsor", label: "Sponsor" },
						{ value: "Community", label: "Community" },
						{ value: "Patron", label: "Patron" },
					]}
					errorMessage={
						actionData?.clientError?.errors
							.filter((item) => item.field === "type")
							.map((item) => item.message)
							.join(", ") || undefined
					}
				/>
				<Input
					id="email_whitelist"
					name="email_whitelist"
					label="Allowed emails (comma separated)"
					placeholder="example1@mail.com, example2@mail.com"
					errorMessage={
						actionData?.clientError?.errors
							.filter((item) => item.field === "email_whitelist")
							.map((item) => item.message)
							.join(", ") || undefined
					}
				/>
				<MultiDropdownSearch
					id="ticket_ids"
					label="Ticket IDs"
					name="ticket_ids"
					placeholder="search ticket..."
					dropdownItems={
						ticketQuery.data?.results.map((item) => ({
							label: item.name,
							value: item.id,
						})) || []
					}
					searchInputValue={ticketSearch || ""}
					onSearchInputChange={(value) => setTicketSearch(value)}
					value={formValue.ticket_ids}
					onChange={(value) =>
						setFormValue((prev) => ({ ...prev, ticket_ids: value }))
					}
					errorMessage={getTicketIdsFieldError(actionData?.clientError?.errors)}
				/>
				<Checkbox id="is_active" name="is_active" label="is active" />
				<div className="flex justify-end gap-4">
					<Link
						to={"/cms/voucher"}
						className="bg-gray-500 rounded-lg hover:cursor-pointer text-white px-4 py-2"
					>
						Cancel
					</Link>
					<button
						type="submit"
						className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600"
						disabled={navigation.state === "submitting"}
					>
						{navigation.state === "submitting" ? "Creating..." : "Create"}
					</button>
				</div>
			</Form>
		</div>
	);
}
