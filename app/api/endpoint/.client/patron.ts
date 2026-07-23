import { ContentType } from "~/lib/http";
import { httpClient } from "~/lib/http/$.client";

export const getPatrons = async () => {
	return await httpClient.get("/patron/");
};

export const getPatronUsers = async () => {
	return await httpClient.get("/patron/user/");
};

export const postPatron = async ({ formData }: { formData: FormData }) => {
	return await httpClient.post("/patron/", {
		body: formData,
		contentType: ContentType.FORMDATA,
	});
};

export const getPatron = async ({ patron_id }: { patron_id: string }) => {
	return await httpClient.get(`/patron/${patron_id}`);
};

export const updatePatron = async ({
	patron_id,
	formData,
}: {
	patron_id: string;
	formData: FormData;
}) => {
	return await httpClient.put(`/patron/${patron_id}`, {
		body: formData,
		contentType: ContentType.FORMDATA,
	});
};

export const deletePatron = async ({ patron_id }: { patron_id: string }) => {
	return await httpClient.delete(`/patron/${patron_id}`);
};

export const getPatronImage = async ({ patron_id }: { patron_id: string }) => {
	return await httpClient.get(`/patron/${patron_id}/image/`);
};

export const getPatronUserImage = async ({ user_id }: { user_id: string }) => {
	return await httpClient.get(`/patron/user/${user_id}/image/`);
};
