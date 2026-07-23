import { ContentType } from "~/lib/http";
import { http } from "~/lib/http/$.server";

export const getPatrons = async () => {
	return await http.get("/patron/");
};

export const getPatronUsers = async () => {
	return await http.get("/patron/user/");
};

export const postPatron = async ({
	request,
	formData,
}: {
	request: Request;
	formData: FormData;
}) => {
	return await http.post("/patron/", {
		request,
		body: formData,
		contentType: ContentType.FORMDATA,
	});
};

export const getPatron = async ({
	request,
	patron_id,
}: {
	request: Request;
	patron_id: string;
}) => {
	return await http.get(`/patron/${patron_id}`, { request });
};

export const updatePatron = async ({
	request,
	patron_id,
	formData,
}: {
	request: Request;
	patron_id: string;
	formData: FormData;
}) => {
	return await http.put(`/patron/${patron_id}`, {
		request,
		body: formData,
		contentType: ContentType.FORMDATA,
	});
};

export const deletePatron = async ({
	request,
	patron_id,
}: {
	request: Request;
	patron_id: string;
}) => {
	return await http.delete(`/patron/${patron_id}`, { request });
};

export const getPatronImage = async ({ patron_id }: { patron_id: string }) => {
	return await http.get(`/patron/${patron_id}/image/`);
};

export const getPatronUserImage = async ({ user_id }: { user_id: string }) => {
	return await http.get(`/patron/user/${user_id}/image/`);
};
