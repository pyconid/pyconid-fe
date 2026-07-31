// biome-ignore-all lint: Anoying
import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

const DropdownChevron = () => (
	<svg
		aria-label="drodown chevron"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<title>Dropdown arrow</title>
		<path
			d="M6 9L12 15L18 9"
			stroke="black"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
);

type DropdownItem = {
	label: string;
	value: string;
};

function getBadgeLabel(label: string) {
	return label.replace(/\s*\([^)]*@[^)]*\)\s*$/, "").trim();
}

export const MultiDropdownSearch = ({
	label,
	id,
	name,
	placeholder,
	dropdownItems,
	searchInputValue = "",
	onSearchInputChange = () => {},
	value = [],
	onChange,
	disabled = false,
	errorMessage,
}: {
	label: string;
	id: string;
	name: string;
	placeholder: string;
	dropdownItems: DropdownItem[];
	searchInputValue?: string | null;
	onSearchInputChange?: (value: string) => void;
	value?: DropdownItem[];
	onChange: (value: DropdownItem[]) => void;
	disabled?: boolean;
	errorMessage?: string;
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (!containerRef.current?.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const handleSelectItem = (item: DropdownItem) => {
		if (value.some((selectedItem) => selectedItem.value === item.value)) {
			return;
		}

		onChange([...value, item]);
	};

	const handleRemoveItem = (itemValue: string) => {
		onChange(value.filter((item) => item.value !== itemValue));
	};

	return (
		<div ref={containerRef} className="w-full relative">
			<label htmlFor={id} className="block mb-2 text-sm font-medium text-black">
				{label}
			</label>
			{value.map((item) => (
				<input key={item.value} name={name} value={item.value} type="hidden" />
			))}
			<div
				className={twMerge(
					"w-full rounded-lg border p-2 pr-10",
					disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white",
					errorMessage ? "border-red-500" : "border-gray-300",
				)}
			>
				<div className="flex flex-wrap items-center gap-2">
					{value.map((item, index) => (
						<span
							key={item.value}
							className={twMerge(
								"inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm",
								index === 0
									? "bg-blue-100 text-blue-800"
									: "bg-slate-100 text-slate-700",
							)}
						>
							<span>{getBadgeLabel(item.label)}</span>
							{index === 0 && (
								<span className="rounded-full bg-blue-200 px-2 py-0.5 text-xs font-medium">
									Main
								</span>
							)}
							<button
								type="button"
								onClick={() => {
									handleRemoveItem(item.value);
								}}
								className="text-xs font-semibold hover:cursor-pointer"
								aria-label={`Remove ${item.label}`}
							>
								x
							</button>
						</span>
					))}
					<input
						id={id}
						type="text"
						className="min-w-24 flex-1 bg-transparent outline-none"
						onClick={() => {
							setIsOpen(true);
						}}
						value={searchInputValue ?? ""}
						onChange={(e) => {
							onSearchInputChange(e.target.value);
						}}
						placeholder={value.length === 0 ? placeholder : ""}
						disabled={disabled}
					/>
				</div>
				<div className="absolute top-9 right-2">
					<DropdownChevron />
				</div>
			</div>
			{errorMessage && (
				<p className="mt-2 text-sm text-red-500">{errorMessage}</p>
			)}
			<ul
				className={twMerge(
					"max-h-[300px] overflow-y-scroll absolute top-16 p-2 bg-white border border-gray-300 rounded-lg w-full mt-1 z-10 shadow-lg",
					isOpen ? "block" : "hidden",
				)}
			>
				{dropdownItems.map((item) => {
					return (
						<li
							key={item.value}
							onClick={() => {
								handleSelectItem(item);
							}}
							className="hover:cursor-pointer hover:bg-[#224083] hover:text-white rounded-sm px-2"
						>
							{item.label}
						</li>
					);
				})}
			</ul>
		</div>
	);
};
