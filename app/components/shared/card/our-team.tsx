import { MailIcon } from "lucide-react";
import { cn, onAvatarError } from "~/lib/utils";
import { Facebook } from "../icons/facebook";
import { Instagram } from "../icons/instagram";
import { Linkedin } from "../icons/linkedin";
import { Twitter } from "../icons/twitter";
import { Earth } from "../icons/website";

export interface OurTeamCardProps {
	jobTitle?: string;
	affiliation?: string;
	profile_picture?: string;
	instagram_username?: string;
	twitter_username?: string;
	facebook_username?: string;
	linkedin_username?: string;
	website?: string;
	email?: string;
	github?: string;
	name?: string;
	bio?: string;
	onClick?: () => void;
}

export const OurTeamCard = ({
	name,
	jobTitle,
	affiliation,
	profile_picture,
	instagram_username,
	twitter_username,
	email,
	github,
	facebook_username,
	linkedin_username,
	website,
	onClick,
}: OurTeamCardProps) => {
	return (
		<div
			{...(onClick
				? {
						onClick,
						onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => {
							if (e.key === "Enter" || e.key === " ") {
								e.preventDefault();
								onClick();
							}
						},
						role: "button",
						tabIndex: 0,
					}
				: {})}
			className={cn(
				"w-full max-w-[340px] mx-auto flex flex-col font-sans bg-surface text-white drop-shadow-md",
				"[clip-path:polygon(0_0,100%_0,100%_100%,18%_100%,0_85%)] transition-transform hover:-translate-y-1",
				onClick && "cursor-pointer",
			)}
		>
			{/* Top Half - Avatar & Logo */}
			<div className="relative pt-16 px-6 flex flex-col items-center justify-center">
				<img
					src="/images/logo-pycon-2026-light.png"
					alt="PyCon ID 2026"
					className="absolute top-5 right-5 h-7 z-10 opacity-90"
				/>
				<div className="size-44 rounded-full overflow-hidden border-2 border-background shadow-lg relative z-0">
					<img
						src={profile_picture?.trim() || "/images/default-avatar.webp"}
						alt={name}
						className="size-full object-cover"
						onError={onAvatarError}
						loading="lazy"
					/>
				</div>
			</div>

			{/* Center White Name Strip */}
			<div
				className={cn(
					"bg-white py-3 px-4 text-center w-full z-10 shadow-sm relative",
					"[clip-path:polygon(15%_0,18%_35%,100%_35%,100%_100%,0_100%,0_0)]",
					"flex items-end justify-center h-18",
				)}
			>
				<h1 className="text-lg font-bold text-surface break-words leading-tight">
					{name}
				</h1>
			</div>

			{/* Bottom Half - Info & Socials */}
			<div className="p-6 pt-5 flex flex-col justify-between flex-1 min-h-[140px]">
				<div className="text-center mb-4">
					<p className="font-light text-sm text-gray-300">
						{jobTitle}
						{affiliation && (
							<>
								<br /> <span>{affiliation}</span>
							</>
						)}
					</p>
				</div>

				{/* Social Links aligned to center/bottom */}
				<div className="flex flex-wrap items-center justify-center gap-2 mt-auto px-5">
					{facebook_username && (
						<div className="bg-background overflow-hidden p-0.5 [clip-path:polygon(20%_0,100%_0%,100%_80%,80%_100%,0_100%,0_20%)]">
							<a
								href={facebook_username}
								target="_blank"
								rel="noreferrer noopener"
								className={cn(
									"flex items-center justify-center size-9 bg-foreground hover:bg-white hover:text-surface transition-colors",
									"[clip-path:polygon(20%_0,100%_0%,100%_80%,80%_100%,0_100%,0_20%)]",
								)}
							>
								<Facebook className="size-4" />
							</a>
						</div>
					)}
					{instagram_username && (
						<div className="bg-background overflow-hidden p-0.5 [clip-path:polygon(20%_0,100%_0%,100%_80%,80%_100%,0_100%,0_20%)]">
							<a
								href={instagram_username}
								target="_blank"
								rel="noreferrer noopener"
								className={cn(
									"flex items-center justify-center size-9 bg-foreground hover:bg-white hover:text-surface transition-colors",
									"[clip-path:polygon(20%_0,100%_0%,100%_80%,80%_100%,0_100%,0_20%)]",
								)}
							>
								<Instagram className="size-4" />
							</a>
						</div>
					)}
					{github && (
						<div className="bg-background overflow-hidden p-0.5 [clip-path:polygon(20%_0,100%_0%,100%_80%,80%_100%,0_100%,0_20%)]">
							<a
								href={github}
								target="_blank"
								rel="noreferrer noopener"
								className={cn(
									"flex items-center justify-center size-9 bg-foreground hover:bg-white hover:text-surface transition-colors",
									"[clip-path:polygon(20%_0,100%_0%,100%_80%,80%_100%,0_100%,0_20%)]",
								)}
							>
								<img
									src="/svg/github.svg"
									alt="Github"
									className="size-4 brightness-0 invert"
								/>
							</a>
						</div>
					)}
					{twitter_username && (
						<div className="bg-background overflow-hidden p-0.5 [clip-path:polygon(20%_0,100%_0%,100%_80%,80%_100%,0_100%,0_20%)]">
							<a
								href={twitter_username}
								target="_blank"
								rel="noreferrer noopener"
								className={cn(
									"flex items-center justify-center size-9 bg-foreground hover:bg-white hover:text-surface transition-colors",
									"[clip-path:polygon(20%_0,100%_0%,100%_80%,80%_100%,0_100%,0_20%)]",
								)}
							>
								<Twitter className="size-4" />
							</a>
						</div>
					)}
					{linkedin_username && (
						<div className="bg-background overflow-hidden p-0.5 [clip-path:polygon(20%_0,100%_0%,100%_80%,80%_100%,0_100%,0_20%)]">
							<a
								href={linkedin_username}
								target="_blank"
								rel="noreferrer noopener"
								className={cn(
									"flex items-center justify-center size-9 bg-foreground hover:bg-white hover:text-surface transition-colors",
									"[clip-path:polygon(20%_0,100%_0%,100%_80%,80%_100%,0_100%,0_20%)]",
								)}
							>
								<Linkedin className="size-4" />
							</a>
						</div>
					)}
					{website && (
						<div className="bg-background overflow-hidden p-0.5 [clip-path:polygon(20%_0,100%_0%,100%_80%,80%_100%,0_100%,0_20%)]">
							<a
								href={website}
								target="_blank"
								rel="noreferrer noopener"
								className={cn(
									"flex items-center justify-center size-9 bg-foreground hover:bg-white hover:text-surface transition-colors",
									"[clip-path:polygon(20%_0,100%_0%,100%_80%,80%_100%,0_100%,0_20%)]",
								)}
							>
								<Earth className="size-4" />
							</a>
						</div>
					)}
					{email && (
						<div className="bg-background overflow-hidden p-0.5 [clip-path:polygon(20%_0,100%_0%,100%_80%,80%_100%,0_100%,0_20%)]">
							<a
								href={`mailto:${email}`}
								target="_blank"
								rel="noreferrer noopener"
								className={cn(
									"flex items-center justify-center size-9 bg-foreground hover:bg-white hover:text-surface transition-colors",
									"[clip-path:polygon(20%_0,100%_0%,100%_80%,80%_100%,0_100%,0_20%)]",
								)}
							>
								<MailIcon className="size-4" />
							</a>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
