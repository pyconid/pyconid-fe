import { Mail, X } from "lucide-react";
import { useEffect } from "react";
import type { OrganizerPublicType } from "~/api/schema/organizer";

import { Facebook } from "~/components/shared/icons/facebook";
import { Instagram } from "~/components/shared/icons/instagram";
import { Linkedin } from "~/components/shared/icons/linkedin";
import { Twitter } from "~/components/shared/icons/twitter";
import { Earth } from "~/components/shared/icons/website";
import { onAvatarError, parseOrganizerImage } from "~/lib/utils";

export interface OrganizerModalProps {
	isOpen: boolean;
	onClose: () => void;
	organizer: OrganizerPublicType | null;
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
			className="w-10 h-10 flex items-center justify-center bg-[#FAFAFA] hover:bg-white transition-colors"
		>
			{icon}
		</a>
	);
}

export const OrganizerModal = ({
	isOpen,
	onClose,
	organizer,
}: OrganizerModalProps) => {
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}

		return () => {
			document.body.style.overflow = "";
		};
	}, [isOpen]);

	if (!isOpen || !organizer) return null;

	const firstName = organizer.user.first_name || "";
	const lastName = organizer.user.last_name || "";
	const name = `${firstName} ${lastName}`.trim() || "Unknown Organizer";
	const bio = organizer.user.bio;
	const jobTitle = organizer.user.job_title || "";
	const company = organizer.user.company || "";

	const iconClass = "w-5 h-5 text-[#282828]";

	const socials = [
		{
			href: organizer.user.website || "",
			icon: <Earth className={iconClass} />,
			label: "Website",
			value: organizer.user.website,
		},
		{
			href: `https://www.facebook.com/${organizer.user.facebook_username}`,
			icon: <Facebook className={iconClass} />,
			label: "Facebook",
			value: organizer.user.facebook_username,
		},
		{
			href: `https://www.linkedin.com/in/${organizer.user.linkedin_username}`,
			icon: <Linkedin className={iconClass} />,
			label: "LinkedIn",
			value: organizer.user.linkedin_username,
		},
		{
			href: `https://www.instagram.com/${organizer.user.instagram_username}`,
			icon: <Instagram className={iconClass} />,
			label: "Instagram",
			value: organizer.user.instagram_username,
		},
		{
			href: `https://x.com/${organizer.user.twitter_username}`,
			icon: <Twitter className={iconClass} />,
			label: "X",
			value: organizer.user.twitter_username,
		},
		{
			href: `https://github.com/${organizer.user.github_username}`,
			icon: <img src="/svg/github.svg" alt="GitHub" className={iconClass} />,
			label: "GitHub",
			value: organizer.user.github_username,
		},
		{
			href: `mailto:${organizer.user.email}`,
			icon: <Mail className={iconClass} />,
			label: "Email",
			value: organizer.user.email,
		},
	].filter((item) => item.value);

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
			<button
				type="button"
				className="absolute inset-0 bg-black/30 backdrop-blur-md"
				onClick={onClose}
				aria-label="Close modal"
			/>

			<div className="relative z-10 w-full md:max-w-2xl max-h-[90dvh] overflow-y-auto bg-[#282828] text-[#F1F2F3] p-8 md:p-12">
				<img
					src="/svg/hero-accent.svg"
					alt=""
					className="absolute -top-10 -left-6 w-20 md:w-28 opacity-50 pointer-events-none"
				/>

				<div className="flex justify-end mb-4">
					<button
						type="button"
						onClick={onClose}
						className="p-2 hover:bg-white/10 transition-colors cursor-pointer"
						aria-label="Close modal"
					>
						<X className="w-6 h-6 text-[#F1F2F3]" />
					</button>
				</div>

				<div className="flex flex-col md:flex-row gap-6 md:gap-8">
					<div className="shrink-0 mx-auto md:mx-0">
						<div className="w-[222px] h-[222px] overflow-hidden bg-[#909090]/10">
							<img
								src={parseOrganizerImage({ id: organizer.id })}
								alt={name}
								onError={onAvatarError}
								className="object-cover w-full h-full"
							/>
						</div>

						{socials.length > 0 && (
							<div className="mt-4 text-center md:text-left">
								<p className="text-[#909090] font-bold text-sm mb-2">
									Social Media
								</p>
								<div className="flex justify-center md:justify-start gap-2">
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
							<p className="text-[#F1F2F3] font-bold text-base md:text-lg uppercase">
								{name}
							</p>
							{(jobTitle || company) && (
								<p className="text-[#F1F2F3]/90 text-sm md:text-base">
									{jobTitle}
									{jobTitle && company && <span className="mx-1"> @ </span>}
									{company}
								</p>
							)}
						</div>

						{bio && (
							<div>
								<p className="text-[#909090] font-bold text-sm mb-1">Bio</p>
								<p className="text-[#F1F2F3]/90 text-sm md:text-base leading-relaxed">
									{bio}
								</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
