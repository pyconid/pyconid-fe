import { http } from "~/lib/http/$.server";

export const getVoucher = async () => {
	return await http.get("/voucher/");
};

export const getVoucherById = async ({
	request,
	id,
}: {
	request: Request;
	id: string;
}) => {
	return await http.get(`/voucher/${id}`, { request });
};

export const createVoucher = async ({
	request,
	json,
}: {
	request: Request;
	json: {
		code: string;
		value: number | null;
		quota: number;
		type: string | null;
		email_whitelist: {
			emails: string[];
		} | null;
		is_active: boolean;
		ticket_ids: string[] | null;
	};
}) => {
	return await http.post("/voucher/", {
		request,
		body: json,
		contentType: "application/json",
	});
};

export const updateVoucher = async ({
	request,
	json,
	id,
}: {
	request: Request;
	json: {
		code: string;
		value: number | null;
		quota: number;
		type: string | null;
		email_whitelist: {
			emails: string[];
		} | null;
		is_active: boolean;
		ticket_ids: string[] | null;
	};
	id: string;
}) => {
	return await http.put(`/voucher/${id}`, {
		request,
		body: json,
		contentType: "application/json",
	});
};
