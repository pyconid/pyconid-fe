import { redirect } from "react-router";
import {
	getScheduleById,
	// getScheduleStream,
} from "~/api/endpoint/.server/schedule";
import { getStreamDetail } from "~/api/endpoint/.server/streaming";
import { ScheduleByIdSchema } from "~/api/schema/schedule";
import { streamingResponseSchema } from "~/api/schema/streaming";
import { Footer } from "~/components/layouts/navigation/footer";
import { Header } from "~/components/layouts/navigation/header";
import { StreamingSection } from "~/components/sections/streaming/streaming";
import { authenticator } from "~/services/auth/$.server";
import type { Route } from "./+types/streaming";

export function meta() {
	return [
		{ title: "PyCon ID 2025 Streaming" },
		{ name: "Streaming", content: "Streaming" },
	];
}

export const loader = async ({ params, request }: Route.LoaderArgs) => {
	const id = params.id as string;
	const credentials = await authenticator.isAuthenticated(request);
	if (!credentials) {
		return redirect("/login");
	}

	const dataScheduleById = await getScheduleById({ request, id });
	if (dataScheduleById.status !== 200) {
		return redirect("/not-found");
	}

	const jsonDataScheduleById = await dataScheduleById.json();
	const scheduleDetail = ScheduleByIdSchema.parse(jsonDataScheduleById);
	if (!scheduleDetail.stream?.id) {
		return redirect("/not-found");
	}

	const dataStreamDetail = await getStreamDetail({
		request,
		id: scheduleDetail.stream.id,
	});

	if (dataStreamDetail.status === 401) {
		return await authenticator.logout(request, { redirectTo: "/login" });
	}

	if (dataStreamDetail.status !== 200) {
		return redirect("/not-found");
	}

	const jsonDatStreamDetail = await dataStreamDetail.json();
	const scheduleStream = streamingResponseSchema.parse(jsonDatStreamDetail);

	return { scheduleDetail, scheduleStream };
};

export default function Streaming(componentProps: Route.ComponentProps) {
	return (
		<main>
			<Header />
			<StreamingSection componentProps={componentProps} />
			<Footer />
		</main>
	);
}
