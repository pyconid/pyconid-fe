import { Briefcase, Building2, MapPin, Search, User } from "lucide-react";
import type { ReactNode } from "react";
import type { GetUserProfileSchema } from "~/api/schema/user_profile";
import { Footer } from "~/components/layouts/navigation/footer";

export const ProfileViewSection = ({
	userProfile,
}: {
	userProfile: GetUserProfileSchema;
}) => {
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

	return (
		<>
			<div className="min-h-[calc(100dvh-120px)] text-white">
				<div className="max-w-[1280px] mx-auto px-6 lg:px-12 py-9">
					{/* Profile Header */}
					<div className="flex items-center gap-4 py-10 px-6 lg:px-12 relative">
						{/* Avatar */}
						<div className="w-32 h-32 rounded-full overflow-hidden bg-gray-600 flex-shrink-0">
							{userProfile.profile_picture ? (
								<img
									src={userProfile.profile_picture}
									alt={fullName}
									className="w-full h-full object-cover"
								/>
							) : (
								<div className="w-full h-full grid place-items-center text-3xl font-bold text-white">
									{initials}
								</div>
							)}
						</div>

						{/* Info */}
						<div className="flex flex-col gap-1.5">
							<h1 className="text-[34px] font-bold leading-tight">
								{fullName || "User"}
							</h1>
							{userProfile.email && (
								<a
									href={`mailto:${userProfile.email}`}
									className="text-base font-bold underline hover:opacity-80"
								>
									{userProfile.email}
								</a>
							)}
							{userProfile.phone && (
								<p className="text-base">{userProfile.phone}</p>
							)}
							{location && (
								<div className="flex items-center gap-1">
									<MapPin className="w-5 h-5" />
									<span className="text-base">{location}</span>
								</div>
							)}
						</div>
					</div>

					{/* Divider */}
					<div className="h-[2px] bg-[#FAFAFA] mx-6 lg:mx-12" />

					{/* Profile Section */}
					<div className="px-6 lg:px-12 py-8 pb-10 flex flex-col gap-4">
						<h2 className="text-[34px] font-bold">Profile</h2>

						{/* Info Cards Row 1 */}
						<div className="flex flex-wrap gap-8">
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
						</div>

						{/* Info Cards Row 2 */}
						<div className="flex flex-wrap gap-8 pt-4">
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

						{/* About */}
						<div className="flex flex-col gap-4 pt-4 max-w-[1080px]">
							<h3 className="text-xl font-bold">About</h3>
							<p className="text-xl leading-relaxed">
								{userProfile.bio || "No bio available."}
							</p>
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</>
	);
};

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
		<div className="flex flex-col gap-1 min-w-[200px]">
			<div className="flex items-center gap-2">
				{icon}
				<span className="text-base font-bold">{label}</span>
			</div>
			<span className="text-2xl font-normal">{value || "-"}</span>
		</div>
	);
}
