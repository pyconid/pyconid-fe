import { httpClient } from "~/lib/http/$.client";

export const getTicket = async () => {
	return await httpClient.get("/ticket/");
};
