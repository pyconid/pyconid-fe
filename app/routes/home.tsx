import { getPatronUsers } from "~/api/endpoint/.server/patron";
import { patronUserResponseSchema } from "~/api/schema/patron";
import { Footer } from "~/components/layouts/navigation/footer";
import { Header } from "~/components/layouts/navigation/header";
// import { CommunitySection } from "~/components/sections/home/community";
import { HeroSection } from "~/components/sections/home/hero";
import { PatronSection } from "~/components/sections/home/patron";
// import { OurTeamSection } from "~/components/sections/home/our-team";
// import { ScheduleSection } from "~/components/sections/home/schedule";
// import { ScheduleSection } from "~/components/sections/home/schedule";
import { SpeakersSection } from "~/components/sections/home/speakers";
import { SponsorSection } from "~/components/sections/home/sponsor";
import type { Route } from "./+types/home";

export const loader = async () => {
	try {
		const response = await getPatronUsers();
		if (!response.ok) {
			throw new Error(`Failed to fetch patrons: ${response.status}`);
		}

		const patrons = patronUserResponseSchema.parse(await response.json());
		return { patrons: patrons.results };
	} catch (error) {
		console.error("Failed to fetch patron data: ", error);
		return { patrons: [] };
	}
};

export function meta() {
	return [
		{ title: "PyCon ID 2026" },
		{ name: "PyCon ID 2026 Home Page", content: "Website for PyCon ID 2026" },
	];
}

export default function Home({ loaderData }: Route.ComponentProps) {
	return (
		<main>
			<Header />
			<HeroSection />
			{/* <ScheduleSection /> */}
			{/* <ScheduleSection /> */}
			<SpeakersSection />
			<SponsorSection />
			<PatronSection patrons={loaderData.patrons} />
			{/* <CommunitySection /> */}
			{/* <OurTeamSection /> */}
			<Footer />
		</main>
	);
}
