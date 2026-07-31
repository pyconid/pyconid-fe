import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const formatRupiah = (amount: number) => {
	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		minimumFractionDigits: 0,
	}).format(amount);
};

export const parseProfileImage = ({ token }: { token?: string }) => {
	if (!token) return "";
	const url = import.meta.env.VITE_BASE_API;
	return `${url}/user-profile/${token}/profile-picture/`;
};

export const parseSpeakerImage = ({ id }: { id: string }) => {
	if (!id) return "";
	const url = import.meta.env.VITE_BASE_API;
	return `${url}/speaker/${id}/profile-picture/`;
};

export const parseOrganizerImage = ({ id }: { id: string }) => {
	if (!id) return "";
	const url = import.meta.env.VITE_BASE_API;
	return `${url}/organizer/${id}/profile-picture`;
};

export const parseVolunteerImage = ({ id }: { id: string }) => {
	if (!id) return "";
	const url = import.meta.env.VITE_BASE_API;
	return `${url}/volunteer/${id}/profile-picture/`;
};

export const onAvatarError = (
	evt: React.SyntheticEvent<HTMLImageElement, Event>,
) => {
	const element = evt.target as HTMLImageElement;
	element.onerror = () => {
		return null;
	};
	element.src = "/images/default-avatar.webp";
	element.srcset = "/images/default-avatar.webp";
};
