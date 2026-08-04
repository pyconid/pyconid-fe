import { useMemo, useState } from "react";
import type { OrganizerPublicType } from "~/api/schema/organizer";
import {
	OurTeamCard,
	type OurTeamCardProps,
} from "~/components/shared/card/our-team";
import {
	SpeakerCard,
	type SpeakerCardProps,
} from "~/components/shared/card/speaker";
import { Hero } from "~/components/shared/hero/hero";
import { cn, parseOrganizerImage } from "~/lib/utils";
import { OrganizerModal } from "./organizer-modal";

interface OrganizersSectionProps {
	organizers: OrganizerPublicType[];
}

// Helper function to get full name
const getFullName = (organizer: OrganizerPublicType) => {
	if (!organizer?.user) return "Unknown Organizer";
	const firstName = organizer.user.first_name || "";
	const lastName = organizer.user.last_name || "";
	return `${firstName} ${lastName}`.trim() || "Unknown Organizer";
};

export const OrganizersSection = ({ organizers }: OrganizersSectionProps) => {
	const [selectedPerson, setSelectedPerson] =
		useState<OrganizerPublicType | null>(null);

	const parsedOrganizers = useMemo(() => {
		const lead: (SpeakerCardProps & { id: string })[] = [];
		const program: (OurTeamCardProps & { id: string })[] = [];
		const website: (OurTeamCardProps & { id: string })[] = [];
		const experience: (OurTeamCardProps & { id: string })[] = [];
		const creative: (OurTeamCardProps & { id: string })[] = [];
		const partnership: (OurTeamCardProps & { id: string })[] = [];

		if (organizers?.length) {
			organizers.forEach((organizer) => {
				const organizerType = organizer.organizer_type?.name?.toLowerCase();
				const name = getFullName(organizer);
				const profilePicture = parseOrganizerImage({ id: organizer.id });
				const email = organizer?.user?.email || undefined;

				if (organizerType === "lead organizer") {
					lead.push({
						id: organizer.id,
						name,
						description: organizer.user.job_title || "",
						company: organizer.user.company || "",
						image: profilePicture,
						twitter:
							(organizer?.user?.twitter_username &&
								`https://twitter.com/${organizer?.user?.twitter_username}`) ||
							undefined,
						instagram:
							(organizer?.user?.instagram_username &&
								`https://www.instagram.com/${organizer?.user?.instagram_username}`) ||
							undefined,
						linkedin:
							(organizer?.user?.linkedin_username &&
								`https://www.linkedin.com/in/${organizer?.user?.linkedin_username}`) ||
							undefined,
						facebook:
							(organizer?.user?.facebook_username &&
								`https://www.facebook.com/${organizer?.user?.facebook_username}`) ||
							undefined,
						website: organizer?.user?.website || undefined,
						github:
							(organizer?.user?.github_username &&
								`https://github.com/${organizer?.user?.github_username}`) ||
							undefined,
						email,
					});
				} else {
					const ourTeamItem: OurTeamCardProps & { id: string } = {
						id: organizer.id,
						name,
						jobTitle: organizer.user.job_title || "",
						affiliation: organizer.user.company || "",
						profile_picture: profilePicture,
						twitter_username:
							(organizer?.user?.twitter_username &&
								`https://twitter.com/${organizer?.user?.twitter_username}`) ||
							undefined,
						instagram_username:
							(organizer?.user?.instagram_username &&
								`https://www.instagram.com/${organizer?.user?.instagram_username}`) ||
							undefined,
						linkedin_username:
							(organizer?.user?.linkedin_username &&
								`https://www.linkedin.com/in/${organizer?.user?.linkedin_username}`) ||
							undefined,
						facebook_username:
							(organizer?.user?.facebook_username &&
								`https://www.facebook.com/${organizer?.user?.facebook_username}`) ||
							undefined,
						website: organizer?.user?.website || undefined,
						github:
							(organizer?.user?.github_username &&
								`https://github.com/${organizer?.user?.github_username}`) ||
							undefined,
						email,
					};

					if (organizerType === "talks & programs") {
						program.push(ourTeamItem);
					} else if (organizerType === "website") {
						website.push(ourTeamItem);
					} else if (organizerType === "logistic & hospitality") {
						experience.push(ourTeamItem);
					} else if (organizerType === "publication & design") {
						creative.push(ourTeamItem);
					} else if (organizerType === "partnership") {
						partnership.push(ourTeamItem);
					}
				}
			});
		}

		return [
			{ name: "Lead Organizer", items: lead },
			{ name: "Talks & Programs", items: program },
			{ name: "Website", items: website },
			{ name: "Logistic & Hospitality", items: experience },
			{ name: "Publication & Design", items: creative },
			{ name: "Partnership", items: partnership },
		];
	}, [organizers, organizers.length]);

	return (
		<section className="bg-[#F1F1F1] relative w-full overflow-x-hidden pb-20">
			<Hero text="Organizers" />

			<div className="py-20">
				{parsedOrganizers.map((group) => {
					const isLeadOrganizer = group.name === "Lead Organizer";
					return (
						<div
							key={group.name}
							className="container mx-auto px-6 lg:px-12 relative mb-24"
						>
							<div className="mb-16 relative w-max mx-auto z-10 text-center">
								{/* Title accent - left */}
								<div
									className={cn(
										"absolute -left-16 md:-left-24 -translate-y-1/2 pointer-events-none opacity-70",
										isLeadOrganizer ? "-bottom-20" : "top-1",
									)}
								>
									<img
										src="/svg/square-decoration-bw-alt.svg"
										alt=""
										width={80}
										className="rotate-[-135deg]"
									/>
								</div>
								{/* Title accent - right */}
								<div
									className={cn(
										"absolute -right-16 md:-right-24 -translate-y-1/2 pointer-events-none opacity-70",
										isLeadOrganizer ? "top-1" : "-bottom-20",
									)}
								>
									<img
										src="/svg/square-decoration-bw-alt.svg"
										alt=""
										width={80}
										className="rotate-[-135deg]"
									/>
								</div>

								<h2 className="font-display relative text-3xl md:text-4xl lg:text-[4rem] font-bold text-foreground uppercase">
									{group.name}
								</h2>
							</div>

							<div
								className={cn(
									"grid gap-8 justify-items-center place-items-center sm:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl mx-auto",
									group.items.length === 1 &&
										"sm:grid-cols-1 lg:grid-cols-1 max-w-xl",
									group.items.length === 2 &&
										"sm:grid-cols-2 lg:grid-cols-2 max-w-4xl",
									group.items.length > 1 &&
										"lg:[&>:nth-child(3n+1):last-child]:col-start-2",
								)}
							>
								{group.items.length > 0 ? (
									group.items.map(({ id, ...rest }) => {
										const handleOrganizerClick = (
											items: OrganizerPublicType[],
										) => {
											const org = items.find((o) => o.id === id);
											if (org) setSelectedPerson(org);
										};

										if (!isLeadOrganizer) {
											return (
												<OurTeamCard
													key={id}
													{...(rest as OurTeamCardProps)}
													onClick={() => {
														handleOrganizerClick(organizers);
													}}
												/>
											);
										}

										return (
											<SpeakerCard
												key={id}
												{...(rest as SpeakerCardProps)}
												onClick={() => handleOrganizerClick(organizers)}
											/>
										);
									})
								) : (
									<div className="col-span-full text-center text-gray-500 py-8 h-[300px] flex items-center justify-center">
										No {group.name} available
									</div>
								)}
							</div>
						</div>
					);
				})}
			</div>

			<OrganizerModal
				isOpen={!!selectedPerson}
				onClose={() => setSelectedPerson(null)}
				organizer={selectedPerson}
			/>
		</section>
	);
};
