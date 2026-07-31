import type { CreatePaymentSchema } from "~/api/schema/payment";
import { http } from "~/lib/http/$.server";

export const getPayment = async ({ request }: { request: Request }) => {
	return await http.get("/payment/", { request });
};

export const createPayment = async ({
	body,
	request,
}: {
	body: CreatePaymentSchema;
	request: Request;
}) => {
	return await http.post("/payment/", { body, request });
};

export const getPaymentVoucherValidate = async ({
	code,
	ticket_id,
	request,
}: {
	code: string;
	ticket_id: string;
	request: Request;
}) => {
	return await http.get("/payment/voucher/validate", {
		params: {
			code,
			ticket_id,
		},
		request,
	});
};
