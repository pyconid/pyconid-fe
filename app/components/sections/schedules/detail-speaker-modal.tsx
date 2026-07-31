import { Facebook, Globe, Linkedin, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { ScheduleByIdResponseType } from "~/api/schema/schedule";
import type { SpeakerPublicType } from "~/api/schema/speaker";
import { cn, onAvatarError, parseSpeakerImage } from "~/lib/utils";

export interface SpeakerModalProps {
	isOpen: boolean;
	onClose: () => void;
	scheduleDetail: ScheduleByIdResponseType[] | null;
	speakerDetail: SpeakerPublicType | null;
}

const INITIAL_VISIBLE = 2;

function formatDuration(start: string, end: string) {
	const startTime = new Date(start);
	const endTime = new Date(end);
	const minutes = Math.round(
		(endTime.getTime() - startTime.getTime()) / (1000 * 60),
	);
	return `${minutes} mins`;
}

function getLanguageLabel(
	language: ScheduleByIdResponseType["presentation_language"],
) {
	if (language === "English") return "EN";
	if (language === "Bahasa Indonesia") return "ID";
	return language;
}

function getHourMinuteLabel(date: Date): string {
	return new Intl.DateTimeFormat("en-US", {
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
	}).format(date);
}

function SocialLink({
	href,
	icon,
	label,
}: {
	href: string;
	icon: React.ReactNode;
	label: string;
}) {
	return (
		<a
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			aria-label={label}
			className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-schedule-heading-light/10 hover:bg-schedule-heading-light/20 transition-colors"
		>
			{icon}
		</a>
	);
}

function SpeakerProfileBlock({ speaker }: { speaker: SpeakerPublicType }) {
	const first_name = speaker.user.first_name;
	const last_name = speaker.user.last_name;
	const company = speaker.user.company;
	const job_title = speaker.user.job_title;
	const bio = speaker.user.bio;

	const iconClass = "w-4 h-4 md:w-5 md:h-5 text-schedule-heading-light";

	const socials = [
		{
			href: speaker.user.website || "",
			icon: <Globe className={iconClass} />,
			label: "Website",
			value: speaker.user.website,
		},
		{
			href: `https://www.facebook.com/${speaker.user.facebook_username}`,
			icon: <Facebook className={iconClass} />,
			label: "Facebook",
			value: speaker.user.facebook_username,
		},
		{
			href: `https://www.linkedin.com/in/${speaker.user.linkedin_username}`,
			icon: <Linkedin className={iconClass} />,
			label: "LinkedIn",
			value: speaker.user.linkedin_username,
		},
		{
			href: `https://www.instagram.com/${speaker.user.instagram_username}`,
			icon: (
				<img
					src="/svg/ig.svg"
					alt="Instagram"
					className="w-4 h-4 md:w-5 md:h-5"
				/>
			),
			label: "Instagram",
			value: speaker.user.instagram_username,
		},
		{
			href: `mailto:${speaker.user.email}`,
			icon: (
				<img
					src="/svg/mail.svg"
					alt="Email"
					className="w-4 h-4 md:w-5 md:h-5"
				/>
			),
			label: "Email",
			value: speaker.user.email,
		},
		{
			href: `https://x.com/${speaker.user.twitter_username}`,
			icon: <img src="/svg/x.svg" alt="X" className="w-4 h-4 md:w-5 md:h-5" />,
			label: "X",
			value: speaker.user.twitter_username,
		},
	].filter((item) => item.value);

	return (
		<div className="flex flex-col md:flex-row gap-4 md:gap-6">
			<div className="shrink-0 mx-auto md:mx-0">
				<div className="size-[222px] overflow-hidden bg-schedule-heading-light/10">
					<img
						src={parseSpeakerImage({ id: speaker.id })}
						alt={`${first_name} ${last_name}`}
						onError={onAvatarError}
						className="object-cover w-full h-full"
					/>
				</div>

				{socials.length > 0 && (
					<div>
						<p className="text-schedule-muted-text text-center mt-4 font-bold text-sm mb-2">
							Social Media
						</p>
						<div className="flex justify-center gap-2">
							{socials.map((social) => (
								<SocialLink
									key={social.label}
									href={social.href}
									icon={social.icon}
									label={social.label}
								/>
							))}
						</div>
					</div>
				)}
			</div>

			<div className="flex-1 min-w-0 space-y-4">
				<div>
					<p className="text-schedule-heading-light font-bold text-[14px] md:text-base uppercase">
						{`${first_name} ${last_name}`}
					</p>
					<p className="text-schedule-heading-light text-sm md:text-base">
						{job_title && company
							? `${job_title} @ ${company}`
							: job_title || company}
					</p>
				</div>

				{bio && (
					<div>
						<p className="text-schedule-muted-text font-bold text-sm mb-1">
							Bio
						</p>
						<p className="text-schedule-heading-light text-sm leading-relaxed">
							{bio}
						</p>
					</div>
				)}
			</div>
		</div>
	);
}

function ScheduleItemCard({
	schedule,
}: {
	schedule: ScheduleByIdResponseType;
}) {
	const duration = formatDuration(schedule.start, schedule.end);

	return (
		<div className="border bg-schedule-time-pill-bg border-schedule-card-border/50 p-4 space-y-3">
			<div className="flex items-center justify-between gap-4">
				<div className="flex items-center gap-1 text-schedule-muted-text">
					<img
						alt="Chevron right icon"
						src="/svg/chevron-right.svg"
						className="size-4.5 shrink-0"
					/>
					<span className="text-sm font-bold">
						{schedule.schedule_type.name}
					</span>
				</div>

				{schedule.presentation_language && (
					<div className="flex items-center gap-1 bg-[#909090]/5 px-2 py-1 text-schedule-muted-text">
						<Globe className="w-[18px] h-[18px]" />
						<span className="text-sm font-bold">
							{getLanguageLabel(schedule.presentation_language)}
						</span>
					</div>
				)}
			</div>

			<h4 className="text-schedule-heading-dark font-bold text-lg leading-snug">
				{schedule.title}
			</h4>

			<div className="flex flex-wrap items-center gap-2 text-sm mt-6 text-schedule-muted-text">
				<div className="flex items-center gap-1">
					<span className="font-normal">Duration:</span>
					<span className="font-bold">{duration}</span>
				</div>
				<span className="w-1 h-1 bg-schedule-separator-dot" />
				<div className="flex items-center gap-1">
					<span className="font-normal">Location:</span>
					<span className="font-bold">{schedule.room.name}</span>
				</div>
			</div>

			{schedule.stream?.id && (
				<a
					href={`/schedule/${schedule.id}`}
					className="block w-full text-center bg-schedule-surface text-schedule-heading-light font-bold text-sm uppercase px-6 py-3"
				>
					Watch now
				</a>
			)}
		</div>
	);
}

export const DetailSpeakerModal = ({
	isOpen,
	onClose,
	scheduleDetail,
	speakerDetail,
}: SpeakerModalProps) => {
	const [selectedDay, setSelectedDay] = useState<string | null>(null);
	const [selectedHour, setSelectedHour] = useState<string | null>(null);
	const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

	const speakerSchedules = useMemo(
		() =>
			scheduleDetail?.filter((item) =>
				item.speakers.some((s) => s.speaker.id === speakerDetail?.id),
			) ?? [],
		[scheduleDetail, speakerDetail?.id],
	);

	const sortedDays = useMemo(
		() =>
			[...new Set(speakerSchedules.map((s) => s.start.split("T")[0]))].sort(
				(a, b) => new Date(a).getTime() - new Date(b).getTime(),
			),
		[speakerSchedules],
	);

	const hoursForDay = useMemo(() => {
		if (!selectedDay) return [];
		const daySchedules = speakerSchedules.filter((s) =>
			s.start.startsWith(selectedDay),
		);
		const hourMap = new Map<string, ScheduleByIdResponseType[]>();
		for (const schedule of daySchedules) {
			const label = getHourMinuteLabel(new Date(schedule.start));
			if (!hourMap.has(label)) hourMap.set(label, []);
			hourMap.get(label)?.push(schedule);
		}
		return [...hourMap.entries()].sort(
			(a, b) =>
				new Date(`2000-01-01 ${a[0]}`).getTime() -
				new Date(`2000-01-01 ${b[0]}`).getTime(),
		);
	}, [selectedDay, speakerSchedules]);

	const schedulesForHour = useMemo(() => {
		if (!selectedDay || !selectedHour) return [];
		return speakerSchedules
			.filter(
				(s) =>
					s.start.startsWith(selectedDay) &&
					getHourMinuteLabel(new Date(s.start)) === selectedHour,
			)
			.sort(
				(a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
			);
	}, [selectedDay, selectedHour, speakerSchedules]);

	const allSchedulesForDay = useMemo(() => {
		if (!selectedDay) return [];
		return speakerSchedules
			.filter((s) => s.start.startsWith(selectedDay))
			.sort(
				(a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
			);
	}, [selectedDay, speakerSchedules]);

	const displayedSchedules = selectedHour
		? schedulesForHour
		: allSchedulesForDay;
	const visibleSchedules = displayedSchedules.slice(0, visibleCount);
	const hasMore = visibleCount < displayedSchedules.length;

	const handleDayClick = useCallback((day: string) => {
		setSelectedDay(day);
		setSelectedHour(null);
		setVisibleCount(INITIAL_VISIBLE);
	}, []);

	const handleHourClick = useCallback((hour: string) => {
		setSelectedHour((prev) => (prev === hour ? null : hour));
		setVisibleCount(INITIAL_VISIBLE);
	}, []);

	const handleLoadMore = useCallback(() => {
		setVisibleCount((prev) => prev + INITIAL_VISIBLE);
	}, []);

	useEffect(() => {
		if (isOpen && sortedDays.length > 0) {
			setSelectedDay(sortedDays[0]);
			setSelectedHour(null);
			setVisibleCount(INITIAL_VISIBLE);
		}
	}, [isOpen, sortedDays]);

	if (!isOpen || !speakerDetail) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-0 md:p-6">
			<button
				type="button"
				className="absolute inset-0 bg-black/30 backdrop-blur-md"
				onClick={onClose}
				aria-label="Close modal"
			/>

			<div
				className={cn(
					"relative z-10 w-[calc(100%-3rem)] md:w-full md:max-w-2xl lg:max-w-3xl max-h-[90dvh] overflow-y-auto mx-auto",
					"bg-schedule-surface text-schedule-heading-light",
					"p-6 md:p-12",
				)}
			>
				<img
					src="/svg/hero-accent.svg"
					alt=""
					className="absolute -top-13 -left-8 w-20 md:w-28 opacity-50 pointer-events-none"
				/>

				<div className="flex justify-end mb-4">
					<button
						type="button"
						onClick={onClose}
						className="p-2 hover:bg-white/10 transition-colors cursor-pointer"
						aria-label="Close modal"
					>
						<X className="w-6 h-6 text-schedule-heading-light" />
					</button>
				</div>

				<div className="space-y-6">
					<SpeakerProfileBlock speaker={speakerDetail} />

					{/* <div className="h-px bg-schedule-card-border/50" /> */}

					{speakerSchedules.length > 0 && (
						<div className="space-y-5">
							{sortedDays.length > 1 && (
								<div className="inline-flex w-full items-center bg-schedule-time-pill-bg p-2">
									{sortedDays.map((day, idx) => (
										<button
											type="button"
											key={day}
											onClick={() => handleDayClick(day)}
											className={cn(
												"px-6 py-2.5 text-sm w-full font-bold transition-colors cursor-pointer",
												day === selectedDay
													? "bg-schedule-surface text-schedule-card-bg"
													: "text-schedule-heading-dark hover:bg-schedule-card-border",
											)}
										>
											{`Day ${idx + 1}`}
										</button>
									))}
								</div>
							)}

							<h3 className="text-schedule-heading-light mt-1 font-bold text-base">
								Available Schedules
							</h3>

							{selectedDay && hoursForDay.length > 0 && (
								<div className="inline-block">
									<div className="flex flex-wrap bg-schedule-time-pill-bg p-2 gap-2">
										{hoursForDay.map(([hour]) => (
											<button
												type="button"
												key={hour}
												onClick={() => handleHourClick(hour)}
												className={cn(
													"px-[30px] py-2 text-sm font-bold transition-colors cursor-pointer border-2 border-schedule-surface",
													hour === selectedHour
														? "bg-schedule-surface text-schedule-card-bg"
														: "bg-schedule-time-pill-bg text-schedule-heading-dark hover:bg-schedule-card-border",
												)}
											>
												{hour}
											</button>
										))}
									</div>
								</div>
							)}

							{selectedDay && visibleSchedules.length > 0 && (
								<div className="space-y-4">
									{!selectedHour &&
										hoursForDay.map(([hour, schedules]) => {
											const visibleInGroup = schedules
												.sort(
													(a, b) =>
														new Date(a.start).getTime() -
														new Date(b.start).getTime(),
												)
												.slice(0, visibleCount);
											if (visibleInGroup.length === 0) return null;
											return (
												<div key={hour} className="space-y-3">
													{visibleInGroup.map((schedule) => (
														<ScheduleItemCard
															key={schedule.id}
															schedule={schedule}
														/>
													))}
												</div>
											);
										})}

									{selectedHour &&
										visibleSchedules.map((schedule) => (
											<ScheduleItemCard key={schedule.id} schedule={schedule} />
										))}

									{hasMore && (
										<button
											type="button"
											onClick={handleLoadMore}
											className="w-full py-3 text-lg font-bold text-schedule-heading-light border-2 border-[#FAFAFA] hover:bg-schedule-heading-light/10 transition-colors cursor-pointer"
										>
											Load More
										</button>
									)}
								</div>
							)}

							{selectedDay && allSchedulesForDay.length === 0 && (
								<p className="text-schedule-muted-text text-sm">
									No sessions scheduled for this day.
								</p>
							)}
						</div>
					)}

					{speakerSchedules.length === 0 && (
						<p className="text-schedule-muted-text text-sm">
							No sessions found for this speaker.
						</p>
					)}
				</div>
			</div>
		</div>
	);
};
