import { MailIcon } from "lucide-react";
import { cn, onAvatarError } from "~/lib/utils";
import { Facebook } from "../icons/facebook";
import { Instagram } from "../icons/instagram";
import { Linkedin } from "../icons/linkedin";
import { Twitter } from "../icons/twitter";
import { Earth } from "../icons/website";

export interface SpeakerCardProps {
	name: string;
	description: string;
	company: string;
	instagram?: string;
	twitter?: string;
	facebook?: string;
	linkedin?: string;
	website?: string;
	email?: string;
	github?: string;
	image?: string;
	onClick?: () => void;
}

export const SpeakerCard = ({
	name,
	description,
	company,
	instagram,
	twitter,
	facebook,
	linkedin,
	website,
	email,
	github,
	image,
	onClick,
}: SpeakerCardProps) => {
	const hasSocialLinks =
		instagram || twitter || facebook || linkedin || website || github || email;

	return (
		<button
			onClick={onClick}
			type="button"
			className={cn(
				"w-[340px] mx-auto drop-shadow-md bg-foreground transition-transform p-0.5 hover:-translate-y-1",
				"[clip-path:polygon(42%_0,100%_0,100%_100%,42%_100%,36%_94%,0_94%,0_12%,8%_5%,36%_5%)]",
			)}
		>
			<div
				className={cn(
					"w-full mx-auto flex flex-col font-sans drop-shadow-md bg-background",
					"[clip-path:polygon(42%_0,100%_0,100%_100%,42%_100%,36%_94%,0_94%,0_12%,8%_5%,36%_5%)]",
				)}
			>
				<div className="flex flex-col items-center justify-end relative overflow-hidden">
					<img
						src="/images/PyCon ID 26 Logo@2x.png"
						alt="PyCon ID 2026"
						className="absolute top-2 right-2 h-8 z-10"
					/>

					<img
						src={image ? image : "/images/default-avatar.webp"}
						alt={name}
						className="w-full h-112 object-cover object-bottom z-0"
						loading="lazy"
						onError={onAvatarError}
					/>

					{/* White Name Banner */}
					<div
						className={cn(
							"bg-foreground py-0.5 text-center z-20 shadow-sm absolute bottom-0 inset-x-0 h-20",
							"[clip-path:polygon(100%_0,100%_100%,0_100%,0_0,15%_0,20%_30%,75%_30%,80%_0)]",
						)}
					>
						<div
							className={cn(
								"bg-background py-4 px-4 text-center h-20",
								"[clip-path:polygon(100%_0,100%_100%,0_100%,0_0,15%_0,20%_30%,75%_30%,80%_0)]",
							)}
						>
							<h1 className="text-xl font-bold text-surface break-words leading-tight pt-5">
								{name}
							</h1>
						</div>
					</div>
				</div>

				{/* Bottom Half - Dark Background */}
				<div className="bg-surface text-white p-2 pt-5 flex flex-col justify-between flex-1 min-h-[140px]">
					<div className="text-center mb-4">
						<p className="font-light text-sm text-gray-200">
							{description}
							{company && (
								<>
									<br /> <span>{company}</span>
								</>
							)}
						</p>
					</div>

					{/* Social Links aligned to bottom right */}
					{hasSocialLinks && (
						<div className="flex items-center justify-end gap-x-2 mt-auto">
							{instagram && (
								<div className="bg-background overflow-hidden p-0.5 [clip-path:polygon(20%_0,100%_0%,100%_80%,80%_100%,0_100%,0_20%)]">
									<a
										href={instagram}
										target="_blank"
										rel="noopener noreferrer"
										className={cn(
											"flex items-center justify-center size-9 bg-foreground hover:bg-white hover:text-surface transition-colors",
											"[clip-path:polygon(20%_0,100%_0%,100%_80%,80%_100%,0_100%,0_20%)]",
										)}
									>
										<Instagram className="size-4" />
									</a>
								</div>
							)}
							{twitter && (
								<div className="bg-background overflow-hidden p-0.5 [clip-path:polygon(20%_0,100%_0%,100%_80%,80%_100%,0_100%,0_20%)]">
									<a
										href={twitter}
										target="_blank"
										rel="noopener noreferrer"
										className={cn(
											"flex items-center justify-center size-9 bg-foreground hover:bg-white hover:text-surface transition-colors",
											"[clip-path:polygon(20%_0,100%_0%,100%_80%,80%_100%,0_100%,0_20%)]",
										)}
									>
										<Twitter className="size-4" />
									</a>
								</div>
							)}
							{facebook && (
								<div className="bg-background overflow-hidden p-0.5 [clip-path:polygon(20%_0,100%_0%,100%_80%,80%_100%,0_100%,0_20%)]">
									<a
										href={facebook}
										target="_blank"
										rel="noopener noreferrer"
										className={cn(
											"flex items-center justify-center size-9 bg-foreground hover:bg-white hover:text-surface transition-colors",
											"[clip-path:polygon(20%_0,100%_0%,100%_80%,80%_100%,0_100%,0_20%)]",
										)}
									>
										<Facebook className="size-4" />
									</a>
								</div>
							)}
							{linkedin && (
								<div className="bg-background overflow-hidden p-0.5 [clip-path:polygon(20%_0,100%_0%,100%_80%,80%_100%,0_100%,0_20%)]">
									<a
										href={linkedin}
										target="_blank"
										rel="noopener noreferrer"
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
										rel="noopener noreferrer"
										className={cn(
											"flex items-center justify-center size-9 bg-foreground hover:bg-white hover:text-surface transition-colors",
											"[clip-path:polygon(20%_0,100%_0%,100%_80%,80%_100%,0_100%,0_20%)]",
										)}
									>
										<Earth className="size-4" />
									</a>
								</div>
							)}
							{github && (
								<div className="bg-background overflow-hidden p-0.5 [clip-path:polygon(20%_0,100%_0%,100%_80%,80%_100%,0_100%,0_20%)]">
									<a
										href={github}
										target="_blank"
										rel="noopener noreferrer"
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
							{email && (
								<div className="bg-background overflow-hidden p-0.5 [clip-path:polygon(20%_0,100%_0%,100%_80%,80%_100%,0_100%,0_20%)]">
									<a
										href={email}
										target="_blank"
										rel="noopener noreferrer"
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
					)}
				</div>
			</div>
		</button>
	);
};
