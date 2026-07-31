import { httpClient } from "~/lib/http/$.client";

export const getSchedule = async ({
	page = 1,
	page_size = 5,
	schedule_date,
	search,
	all = false,
}: {
	page?: number;
	page_size?: number;
	schedule_date?: string;
	search?: string;
	all?: boolean;
}) => {
	const params: Record<string, string> = {
		page: page.toString(),
		page_size: page_size.toString(),
	};
	if (schedule_date) {
		params.schedule_date = schedule_date;
	}
	if (search) {
		params.search = search;
	}
	if (all) {
		params.all = all ? "true" : "false";
	}
	return await httpClient.get("/schedule/", { params });
};

export const getScheduleById = async ({ id }: { id: string }) => {
	return await httpClient.get(`/schedule/${id}`);
};

export const getSpeakerSchedules = async ({ id }: { id: string }) => {
	return await httpClient.get(`/speaker/${id}/schedule/`);
};
export const getScheduleStream = async ({ id }: { id: string }) => {
	return await httpClient.get(`/schedule/${id}/stream`);
};
export const postRecreateStream = async ({ id }: { id: string }) => {
	return await httpClient.post(`/schedule/${id}/recreate-stream`);
};
