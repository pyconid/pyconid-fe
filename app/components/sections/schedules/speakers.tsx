import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { getSpeakerSchedules } from "~/api/endpoint/.client/schedule";
import { ScheduleByIdSchema } from "~/api/schema/schedule";
import type { SpeakerPublicType } from "~/api/schema/speaker";
import {
	OurTeamCard as OtherSpeakersCard,
	type OurTeamCardProps,
} from "~/components/shared/card/our-team";
import {
	SpeakerCard,
	type SpeakerCardProps,
} from "~/components/shared/card/speaker";
import { Hero } from "~/components/shared/hero/hero";
import { cn, parseSpeakerImage } from "~/lib/utils";
import { DetailSpeakerModal } from "./detail-speaker-modal";

interface SpeakersSectionProps {
	speakers: SpeakerPublicType[];
}

const getFullName = (speaker: SpeakerPublicType) => {
	if (!speaker?.user) return "Unknown Speaker";
	const firstName = speaker.user.first_name || "";
	const lastName = speaker.user.last_name || "";
	return `${firstName} ${lastName}`.trim() || "Unknown Speaker";
};

export const SpeakersSection = ({ speakers }: SpeakersSectionProps) => {
	const [selectedSpeaker, setSelectedSpeaker] =
		useState<SpeakerPublicType | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const { data: speakerSchedules } = useQuery({
		queryKey: ["speaker-schedules", selectedSpeaker?.id],
		queryFn: async () => {
			if (!selectedSpeaker) return [];
			const res = await getSpeakerSchedules({ id: selectedSpeaker.id });
			const json = await res.json();
			return ScheduleByIdSchema.array().parseAsync(json);
		},
		enabled: !!selectedSpeaker,
	});

	const handleSpeakerClick = (speaker: SpeakerPublicType) => {
		setSelectedSpeaker(speaker);
		setIsModalOpen(true);
	};

	const parsedSpeakers = useMemo(() => {
		const keynote: (SpeakerCardProps & {
			id: string;
			original: SpeakerPublicType;
		})[] = [];
		const short: (OurTeamCardProps & {
			id: string;
			original: SpeakerPublicType;
		})[] = [];
		const regular: (OurTeamCardProps & {
			id: string;
			original: SpeakerPublicType;
		})[] = [];

		if (speakers?.length) {
			speakers.forEach((speaker) => {
				const speakerType = speaker.speaker_type?.name?.toLowerCase();
				if (speakerType?.includes("keynote")) {
					return keynote.push({
						id: speaker.id,
						original: speaker,
						name: getFullName(speaker),
						description: speaker.user?.job_title || "",
						company: speaker.user?.company || "",
						twitter:
							(speaker?.user?.twitter_username &&
								`https://twitter.com/${speaker?.user?.twitter_username}`) ||
							undefined,
						image: parseSpeakerImage({ id: speaker.id }),
						instagram:
							(speaker?.user?.instagram_username &&
								`https://www.instagram.com/${speaker?.user?.instagram_username}`) ||
							undefined,
						email: speaker?.user?.email || undefined,
					});
				}

				const parsedItem: OurTeamCardProps & {
					id: string;
					original: SpeakerPublicType;
				} = {
					id: speaker.id,
					original: speaker,
					name: getFullName(speaker),
					email: speaker?.user?.email || undefined,
					profile_picture: parseSpeakerImage({ id: speaker.id }),
					twitter_username:
						(speaker?.user?.twitter_username &&
							`https://twitter.com/${speaker?.user?.twitter_username}`) ||
						undefined,
					instagram_username:
						(speaker?.user?.instagram_username &&
							`https://www.instagram.com/${speaker?.user?.instagram_username}`) ||
						undefined,
					jobTitle: speaker.user?.job_title || undefined,
					affiliation: speaker.user?.company || undefined,
					linkedin_username:
						(speaker?.user?.linkedin_username &&
							`https://www.linkedin.com/in/${speaker?.user?.linkedin_username}`) ||
						undefined,
					facebook_username:
						(speaker?.user?.facebook_username &&
							`https://www.facebook.com/${speaker?.user?.facebook_username}`) ||
						undefined,
					website: speaker?.user?.website || undefined,
				};

				if (speakerType?.includes("short")) short.push(parsedItem);
				else regular.push(parsedItem);
			});
		}

		return {
			keynote,
			talks: [
				{ name: "Regular Talk", data: regular },
				{ name: "Short Talk", data: short },
			],
		};
	}, [speakers, speakers.length]);

	return (
		<section className="bg-background relative w-full overflow-x-hidden min-h-screen">
			<DetailSpeakerModal
				isOpen={isModalOpen}
				onClose={() => {
					setIsModalOpen(false);
					setSelectedSpeaker(null);
				}}
				scheduleDetail={speakerSchedules ?? null}
				speakerDetail={selectedSpeaker}
			/>

			<Hero text="Our Speakers" className="lg:pb-44" />

			<div className="py-20">
				{/* KEYNOTE SPEAKERS SECTION */}
				<div className="container mx-auto px-6 lg:px-12 relative mb-24">
					<div className="mb-16 relative w-max mx-auto z-10 text-center">
						<div className="absolute w-26 -left-28 -bottom-20 text-surface/30 hidden md:block select-none text-4xl">
							<img
								src="/svg/accent-2.svg"
								alt=""
								className="w-full h-auto rotate-90"
								aria-hidden="true"
							/>
						</div>
						<div className="absolute w-26 -right-28 -top-20 text-surface/30 hidden md:block select-none text-4xl">
							<img
								src="/svg/accent-2.svg"
								alt=""
								className="w-full h-auto rotate-90"
								aria-hidden="true"
							/>
						</div>

						<h2 className="font-sans relative text-3xl md:text-4xl lg:text-5xl font-black uppercase">
							<span className="text-gray-400 mr-3">Keynote</span>
							<span className="text-surface">Speakers</span>
						</h2>
					</div>

					<div className="flex justify-center">
						<div className="flex flex-col items-center md:flex-row lg:gap-12 gap-8 max-w-4xl">
							{parsedSpeakers.keynote.map((speaker) => (
								<button
									key={speaker.id}
									type="button"
									onClick={() => handleSpeakerClick(speaker.original)}
									className="cursor-pointer text-left w-full"
								>
									<SpeakerCard {...speaker} />
								</button>
							))}
						</div>
					</div>
				</div>

				{/* REGULAR / SHORT TALKS SECTION */}
				{parsedSpeakers.talks.map((organizer) => (
					<div
						key={organizer.name}
						className="container mx-auto px-6 lg:px-12 relative mb-24"
					>
						<div className="mb-16 relative w-max mx-auto z-10 text-center">
							<div className="absolute w-26 -left-28 -top-20 text-surface/30 hidden md:block select-none text-4xl">
								<img
									src="/svg/accent-2.svg"
									alt=""
									className="w-full h-auto rotate-90"
									aria-hidden="true"
								/>
							</div>
							<div className="absolute w-26 -right-40 -bottom-12 text-surface/30 hidden md:block select-none text-4xl">
								<img
									src="/svg/accent-2.svg"
									alt=""
									className="w-full h-auto rotate-90"
									aria-hidden="true"
								/>
							</div>

							<h2 className="font-sans relative text-3xl md:text-4xl lg:text-5xl font-black uppercase">
								<span className="text-gray-400 mr-3">{organizer.name}</span>
								<span className="text-surface">Speakers</span>
							</h2>
						</div>

						<div>
							<div
								className={cn(
									"grid gap-8 justify-items-center sm:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl mx-auto",
									organizer.data.length === 1 &&
										"sm:grid-cols-1 lg:grid-cols-1",
									organizer.data.length === 2 &&
										"sm:grid-cols-2 lg:grid-cols-2 max-w-4xl",
									organizer.data.length > 1 &&
										"lg:[&>:nth-child(3n+1):last-child]:col-start-2",
								)}
							>
								{organizer.data.length > 0 ? (
									organizer.data.map((item) => (
										<button
											key={item.id}
											type="button"
											onClick={() => handleSpeakerClick(item.original)}
											className="cursor-pointer text-left w-full"
										>
											<OtherSpeakersCard {...item} />
										</button>
									))
								) : (
									<div className="col-span-full text-center text-gray-500 py-8 h-[300px] flex items-center justify-center">
										No {organizer.name} Speakers Available
									</div>
								)}
							</div>
						</div>
					</div>
				))}
			</div>
		</section>
	);
};
