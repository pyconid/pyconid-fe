import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getScheduleById } from "~/api/endpoint/.client/schedule";
import {
	type ResultScheduleType,
	ScheduleByIdSchema,
	type ScheduleItemType,
} from "~/api/schema/schedule";
import { Hero } from "~/components/shared/hero/hero";
import { SessionCard } from "./session-card";
import { SpeakerModal } from "./speaker-modal";

function formatCustomDate(isoString: string) {
	const date = new Date(isoString);
	return date.toLocaleDateString("en-US", {
		weekday: "long",
		day: "numeric",
		month: "long",
		year: "numeric",
	});
}

function getHourMinuteLabel(date: Date): string {
	return new Intl.DateTimeFormat("en-US", {
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
	}).format(date);
}

function groupScheduleByHour(schedules: ResultScheduleType) {
	const sortedSchedules = [...schedules].sort(
		(a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
	);

	const groups: Record<string, ScheduleItemType[]> = {};

	for (const item of sortedSchedules) {
		const date = new Date(item.start);
		const label = getHourMinuteLabel(date);

		if (!groups[label]) groups[label] = [];
		groups[label].push(item);
	}

	return Object.entries(groups);
}

function sortSpeakersByOrder<T extends { speakers: { order: number }[] }>(
	item: T,
): T {
	return {
		...item,
		speakers: [...item.speakers].sort((a, b) => {
			if (a.order < b.order) return -1;
			if (a.order > b.order) return 1;
			return 0;
		}),
	};
}

export const SchedulesSection = ({
	listSchedule,
	isLoading,
	isError,
	error,
}: {
	listSchedule: ResultScheduleType;
	isLoading?: boolean;
	isError?: boolean;
	error?: Error | null;
}) => {
	const sortedDates = Array.from(
		new Set(listSchedule.map((item) => item.start.split("T")[0])),
	).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

	const [open, setOpen] = useState(false);
	const [selectedDate, setSelectedDate] = useState(sortedDates[1]);
	const [selectedScheduleId, setSelectedScheduleId] = useState<
		ScheduleItemType["id"] | null
	>(null);

	const detailSchedule = useQuery({
		queryKey: ["detailSchedule", selectedScheduleId],
		queryFn: async () => {
			const res = await getScheduleById({ id: selectedScheduleId || "" });
			const data = await res.json();
			const parsed = await ScheduleByIdSchema.parseAsync(data);
			setOpen(true);
			return parsed;
		},
		enabled: !!selectedScheduleId,
	});

	useEffect(() => {
		if (sortedDates.length > 0 && !selectedDate) {
			setSelectedDate(sortedDates[1]);
		}
	}, [sortedDates, selectedDate]);

	if (isError) {
		return (
			<section className="bg-schedule-page-bg min-h-screen">
				<Hero text="Schedules" />
				<div className="container mx-auto px-5 md:px-12 py-16">
					<p className="text-center text-red-500">
						Failed to load schedules.
						{error?.message && (
							<span className="block text-sm mt-2">{error.message}</span>
						)}
					</p>
				</div>
			</section>
		);
	}

	if (
		isLoading ||
		!listSchedule ||
		listSchedule.length === 0 ||
		!selectedDate
	) {
		return (
			<section className="bg-schedule-page-bg min-h-screen">
				<Hero text="Schedules" />
				<div className="container mx-auto px-5 md:px-12 py-16">
					<p className="text-center text-schedule-muted-text">
						Loading schedules...
					</p>
				</div>
			</section>
		);
	}

	const filteredSchedule = listSchedule
		.filter((item) => item.start.startsWith(selectedDate))
		.map(sortSpeakersByOrder);

	const schedulesByHour = groupScheduleByHour(filteredSchedule);

	return (
		<section className="bg-schedule-page-bg min-h-screen">
			<SpeakerModal
				scheduleDetail={
					detailSchedule.data ? sortSpeakersByOrder(detailSchedule.data) : null
				}
				isOpen={detailSchedule.data ? open : false}
				onClose={() => {
					setOpen(false);
					setSelectedScheduleId(null);
				}}
			/>

			<Hero text="Schedules" />
			<div className="container mx-auto px-5 md:px-12 py-10 md:py-20">
				<div className="flex flex-col items-center gap-8 md:gap-10">
					{sortedDates.length > 1 && (
						<div className="inline-flex items-center bg-schedule-time-pill-bg p-2">
							{sortedDates.map((date, idx) => (
								<button
									type="button"
									key={date}
									onClick={() => setSelectedDate(date)}
									className={`px-10 py-3 text-base font-bold transition-colors cursor-pointer ${
										date === selectedDate
											? "bg-schedule-surface text-schedule-card-bg"
											: "text-schedule-heading-dark hover:bg-schedule-card-border"
									}`}
								>
									{`Day ${idx + 1}`}
								</button>
							))}
						</div>
					)}

					<h2 className="text-schedule-heading-dark font-sans text-2xl font-bold text-start">
						{formatCustomDate(selectedDate)}
					</h2>
					<div className="w-full flex flex-col gap-10 md:gap-12">
						{schedulesByHour.map(([time, items]) => (
							<div key={time} className="flex flex-col gap-4">
								<div className="bg-schedule-time-pill-bg px-5 py-2 text-schedule-heading-dark font-bold text-lg text-start">
									{time}
								</div>

								<ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
									{items
										.sort((s1, s2) => s1.room.name.localeCompare(s2.room.name))
										.map((session) => (
											<li key={session.id}>
												<SessionCard
													onClick={() => {
														setSelectedScheduleId(session.id);
													}}
													data={session}
												/>
											</li>
										))}
								</ul>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};
