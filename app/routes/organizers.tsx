import z from "zod";
import { getOrganizersPublic } from "~/api/endpoint/.server/organizer";
import { organizerPublicListSchema } from "~/api/schema/organizer";
import { Footer } from "~/components/layouts/navigation/footer";
import { Header } from "~/components/layouts/navigation/header";
import { OrganizersSection } from "~/components/sections/organizers/organizers";
import type { Route } from "./+types/organizers";

export function meta() {
	return [
		{ title: "PyCon ID 2026 Organizers" },
		{ name: "Organizers", content: "Organizers page" },
	];
}

export const loader = async () => {
	try {
		const [resOrganizers] = await Promise.all([getOrganizersPublic()]);

		if (!resOrganizers.ok) {
			const errMessage = `${resOrganizers.status} ${resOrganizers.statusText} ${await resOrganizers.text()}`;
			throw new Error(errMessage);
		}

		const jsonDataOrganizers = await resOrganizers.json();

		if (!jsonDataOrganizers || !jsonDataOrganizers?.results) {
			throw new Error("Invalid response from server");
		}

		const parsedResponseOrganizers =
			organizerPublicListSchema.safeParse(jsonDataOrganizers);

		if (!parsedResponseOrganizers.success) {
			throw new Error(z.prettifyError(parsedResponseOrganizers.error));
		}

		const organizers = parsedResponseOrganizers.data?.results || [];

		return { organizers };
	} catch (err) {
		console.error("Failed to fetch organizers data: ", err);
		return { organizers: [], volunteers: [] };
	}
};

export default function Organizers({ loaderData }: Route.ComponentProps) {
	return (
		<main>
			<Header />
			<OrganizersSection organizers={loaderData?.organizers || []} />
			<Footer />
		</main>
	);
}
