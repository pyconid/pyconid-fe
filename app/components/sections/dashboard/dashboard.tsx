import {
	Briefcase,
	Building2,
	MapPin,
	Pencil,
	Search,
	User,
} from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import type { GetUserProfileSchema } from "~/api/schema/user_profile";
import { Checkbox } from "~/components/sections/dashboard/checkbox";
import { DashboardMenu } from "~/components/shared/dashboard-menu";
import { Hero } from "~/components/shared/hero/hero";
import { parseProfileImage } from "~/lib/utils";
import { useRootLoaderData } from "~/root";

export const DashboardSection = ({
	userProfile,
	me,
}: {
	userProfile: GetUserProfileSchema;
	me: { id: string; username: string; participant_type?: string | null };
}) => {
	const rootData = useRootLoaderData();
	const navigate = useNavigate();
	const [isNavigating, setIsNavigating] = useState(false);

	const handleNavigateToProfile = (e: React.MouseEvent<HTMLAnchorElement>) => {
		e.preventDefault();
		setIsNavigating(true);
		setTimeout(() => {
			navigate("/auth/user-profile");
		}, 500);
	};

	const fullName = [userProfile.first_name, userProfile.last_name]
		.filter(Boolean)
		.join(" ");

	const initials =
		(userProfile.first_name?.charAt(0).toUpperCase() || "") +
		(userProfile.last_name?.charAt(0).toUpperCase() || "");

	const location = [
		userProfile.city?.name,
		userProfile.state?.name,
		userProfile.country?.name,
	]
		.filter(Boolean)
		.join(", ");

	const profileImg = userProfile.profile_picture
		? parseProfileImage({ token: rootData.credentials?.token })
		: null;

	return (
		<div className="min-h-[calc(100dvh-120px)]">
			<Hero
				text="My Profile"
				nav={
					<DashboardMenu
						showCheckIn={["Management", "Volunteer", "Organizer"].includes(
							me.participant_type || "",
						)}
						showCms={["Management"].includes(me.participant_type || "")}
					/>
				}
			/>

			{/* Main Card */}
			<div className="mx-auto px-6 lg:px-12 py-9">
				<div className="bg-[#FAFAFA] border-2 border-[#282828] relative overflow-hidden">
					{/* Decorative Accents */}
					<div className="absolute -left-25 -bottom-30 w-[280px] h-[300px] pointer-events-none hidden lg:block">
						<img
							src="/svg/accent.svg"
							alt=""
							className="w-full h-full object-contain"
							aria-hidden="true"
						/>
					</div>
					<div className="absolute -right-25 -bottom-30 w-[280px] h-[300px] pointer-events-none hidden lg:block">
						<img
							src="/svg/accent.svg"
							alt=""
							className="w-full h-full object-contain"
							aria-hidden="true"
						/>
					</div>

					<div className="relative z-10">
						{/* Profile Header */}
						<div className="min-h-[140px] border-b-2 border-[#282828] px-2 lg:px-8 py-2 lg:py-4 relative">
							{/* Snake mascot */}
							<div className="absolute hidden lg:block top-18 right-30 w-[100px] pointer-events-none">
								<img
									src="/svg/dashboard-python.svg"
									alt=""
									className="w-full h-auto brightness-0"
									aria-hidden="true"
								/>
							</div>
							<div className="flex flex-col md:flex-row items-center gap-6">
								{/* Avatar */}
								<div className="w-[135px] h-[135px] rounded-full overflow-hidden bg-gray-400 flex-shrink-0">
									{profileImg ? (
										<img
											src={profileImg}
											alt={fullName}
											className="w-full h-full object-cover"
										/>
									) : (
										<div className="w-full h-full grid place-items-center text-3xl font-bold text-white">
											{initials}
										</div>
									)}
								</div>

								<div className="flex flex-col items-center md:items-start">
									<div className="flex flex-col md:flex-row items-center justify-around md:gap-x-4">
										<h2 className="text-[34px] font-bold text-[#282828] leading-tight">
											{fullName || me.username || "User"}
										</h2>
										<NavLink
											to="/auth/user-profile"
											onClick={handleNavigateToProfile}
											className="flex items-center text-[#282828] hover:opacity-70 transition-opacity z-10 gap-x-1"
										>
											<Pencil
												width="20"
												height="20"
												className="text-blue-500 underline"
											/>
											<span className="font-bold text-xl text-blue-500 underline">
												Change
											</span>
										</NavLink>
									</div>
									<div className="flex items-center md:items-start">
										{userProfile.email && (
											<a
												href={`mailto:${userProfile.email}`}
												className="text-xl text-[#282828] underline hover:opacity-80 break-all text-center md:text-start"
											>
												{userProfile.email}
											</a>
										)}
									</div>

									{userProfile.phone && (
										<p className="text-xl text-[#282828]">
											{userProfile.phone}
										</p>
									)}
									{location && (
										<div className="flex items-center gap-2">
											<MapPin className="w-5 h-5 text-[#282828]" />
											<span className="text-xl text-[#282828]">{location}</span>
										</div>
									)}
								</div>
							</div>
						</div>

						{/* Profile Info */}
						<div className="px-8 lg:px-14 py-8 pb-10">
							<h2 className="text-[34px] font-bold text-[#282828] mb-6">
								Profile
							</h2>
							<div className="flex flex-wrap gap-x-[68px] gap-y-8">
								<InfoCard
									icon={<Briefcase className="w-6 h-6" />}
									label="Job Title"
									value={userProfile.job_title}
								/>
								<InfoCard
									icon={<Building2 className="w-6 h-6" />}
									label="Company Organization"
									value={userProfile.company}
								/>
								<InfoCard
									icon={<User className="w-6 h-6" />}
									label="Participant Type"
									value={userProfile.participant_type}
								/>
								<InfoCard
									icon={<Search className="w-6 h-6" />}
									label="Job Category"
									value={
										userProfile.expertise !== null &&
										userProfile.expertise.length > 0
											? userProfile.expertise.join(", ")
											: userProfile.job_category
									}
								/>
							</div>
						</div>

						{/* About */}
						<div className="px-8 lg:px-14 pt-4 pb-8 max-w-[1080px]">
							<h3 className="text-xl font-bold text-[#282828] mb-4">About</h3>
							<p className="text-xl text-[#282828] leading-relaxed">
								{userProfile.bio || "No bio available."}
							</p>
						</div>

						{/* Divider */}
						<div className="h-[1px] bg-[#282828] mx-8 lg:mx-14" />

						{/* Social Media */}
						<div className="px-8 lg:px-14 py-8">
							<h2 className="text-[34px] font-bold text-[#282828] mb-6">
								Social Media
							</h2>
							<div className="flex flex-col gap-8">
								<div className="flex flex-wrap gap-20">
									<SocialCard
										icon={
											<img
												src="/svg/user-profile/portfolio.svg"
												alt=""
												width="32"
												height="32"
											/>
										}
										label="Portfolio"
										value={userProfile.website}
									/>
									<SocialCard
										icon={
											<img
												src="/svg/user-profile/github.svg"
												alt=""
												width="32"
												height="32"
											/>
										}
										label="Github"
										value={userProfile.github_username}
									/>
									<SocialCard
										icon={
											<img
												src="/svg/user-profile/linkedin.svg"
												alt=""
												width="32"
												height="32"
											/>
										}
										label="Linkedin"
										value={userProfile.linkedin_username}
									/>
									<SocialCard
										icon={
											<img
												src="/svg/user-profile/instagram.svg"
												alt=""
												width="32"
												height="32"
											/>
										}
										label="Instagram"
										value={userProfile.instagram_username}
									/>
								</div>
								<div className="flex flex-wrap gap-10">
									<SocialCard
										icon={
											<img
												src="/svg/user-profile/facebook.svg"
												alt=""
												width="32"
												height="32"
											/>
										}
										label="Facebook"
										value={userProfile.facebook_username}
									/>
									<SocialCard
										icon={
											<img
												src="/svg/user-profile/x-twitter.svg"
												alt=""
												width="32"
												height="32"
											/>
										}
										label="X/Twitter"
										value={userProfile.twitter_username}
									/>
								</div>
							</div>
						</div>

						{/* Attendance */}
						<div className="px-8 lg:px-14 py-8 border-t-2 border-[#282828]">
							<h2 className="text-[34px] font-bold text-[#282828] mb-6">
								Attendance
							</h2>
							<div className="flex flex-wrap gap-6 md:gap-10">
								<AttendanceRow
									day="Day 1"
									checked={userProfile.attendance_day_1 ?? false}
									checkedAt={userProfile.attendance_day_1_at}
								/>
								<AttendanceRow
									day="Day 2"
									checked={userProfile.attendance_day_2 ?? false}
									checkedAt={userProfile.attendance_day_2_at}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
			{isNavigating && (
				<div
					className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-md"
					style={{
						background:
							"radial-gradient(circle at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.85) 100%)",
					}}
				>
					<div className="flex flex-col items-center gap-6">
						<img
							src="/images/logo-pycon-2026-light.png"
							alt="PyCon ID 2026"
							className="h-16 lg:h-20 animate-pulse"
						/>
					</div>
				</div>
			)}
		</div>
	);
};

function AttendanceRow({
	day,
	checked,
	checkedAt,
}: {
	day: string;
	checked: boolean;
	checkedAt: string | null;
}) {
	return (
		<Checkbox
			id={`attendance_${day.toLowerCase().replace(" ", "_")}`}
			name={`attendance_${day.toLowerCase().replace(" ", "_")}`}
			label={
				<span>
					{day}
					{checkedAt && (
						<span className="ml-2 text-sm text-gray-500">
							({new Date(checkedAt).toLocaleString()})
						</span>
					)}
				</span>
			}
			value={checked}
			onChange={() => {}}
			disabled
			labelClassName="text-lg text-[#282828]"
		/>
	);
}

function InfoCard({
	icon,
	label,
	value,
}: {
	icon: ReactNode;
	label: string;
	value: string | null;
}) {
	return (
		<div className="flex flex-col gap-1 min-w-[180px]">
			<div className="flex items-center gap-2 text-[#282828]">
				{icon}
				<span className="text-base font-bold">{label}</span>
			</div>
			<span className="text-2xl font-normal text-[#282828]">
				{value || "-"}
			</span>
		</div>
	);
}

function SocialCard({
	icon,
	label,
	value,
}: {
	icon: ReactNode;
	label: string;
	value: string | null;
}) {
	return (
		<div className="flex flex-col gap-2 min-w-[180px]">
			<div className="flex items-center gap-4">
				{icon}
				<span className="text-xl text-[#282828]">{label}</span>
			</div>
			<span className="text-2xl text-[#282828]">{value || "-"}</span>
		</div>
	);
}
