import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import type { TicketType } from "~/api/schema/ticket";
import { formatRupiah } from "~/lib/utils";

interface TicketPurchaseModalProps {
	isOpen: boolean;
	onClose: () => void;
	ticket: TicketType | null;
}

type VoucherState = "empty" | "filled" | "verifying" | "verified" | "error";

const CloseIcon = ({ onClick }: { onClick: () => void }) => (
	<button
		type="button"
		onClick={onClick}
		className="cursor-pointer p-0 bg-transparent border-none"
		aria-label="Close modal"
	>
		<img src="/svg/close-icon.svg" alt="Close" width={24} height={24} />
	</button>
);

const CheckCircleIcon = () => (
	<img
		src="/svg/check-circle.svg"
		alt="Voucher verified"
		width={24}
		height={24}
	/>
);

const DashedSeparator = () => (
	<img
		src="/svg/dashed-separator.svg"
		alt=""
		className="w-full h-[1px]"
		aria-hidden="true"
	/>
);

export const TicketPurchaseModal = ({
	isOpen,
	onClose,
	ticket,
}: TicketPurchaseModalProps) => {
	const fetcher = useFetcher();
	const [voucherCode, setVoucherCode] = useState("");
	const [voucherState, setVoucherState] = useState<VoucherState>("empty");
	const [discount, setDiscount] = useState(0);

	// Read voucher validation result from fetcher data
	const voucherResult = fetcher.data?.apply_voucher;
	const buyTicketResult = fetcher.data?.buy_ticket;

	// Reset voucher state when switching to a different ticket
	useEffect(() => {
		if (!ticket) return;
		setVoucherCode("");
		setVoucherState("empty");
		setDiscount(0);
	}, [ticket]);

	if (!isOpen || !ticket) return null;

	const total = ticket.price - discount;

	const handleVoucherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setVoucherCode(value);
		if (value.trim() === "") {
			setVoucherState("empty");
			setDiscount(0);
		} else {
			setVoucherState("filled");
		}
	};

	const handleApplyVoucher = () => {
		if (!voucherCode.trim()) return;
		setVoucherState("verifying");
		fetcher.submit(
			{
				intent: "apply-voucher",
				voucher_code: voucherCode.trim(),
				ticket_id: ticket.id,
			},
			{ method: "post" },
		);
	};

	// When fetcher returns voucher data, update state
	if (
		voucherState === "verifying" &&
		fetcher.state === "idle" &&
		voucherResult
	) {
		if (voucherResult.success) {
			setVoucherState("verified");
			setDiscount(voucherResult.success.value);
		} else {
			setVoucherState("error");
			setDiscount(0);
		}
	}

	const handleClearVoucher = () => {
		setVoucherCode("");
		setVoucherState("empty");
		setDiscount(0);
	};

	const isSubmitting = fetcher.state !== "idle";

	return (
		<div className="fixed inset-0 z-50 flex justify-center items-start pt-20 bg-black/30 backdrop-blur-[16px]">
			{/* Click outside to close */}
			<button
				type="button"
				className="absolute inset-0"
				onClick={onClose}
				aria-label="Close modal overlay"
			/>

			{/* Modal Content */}
			<div className="relative z-10 w-full max-w-[640px] mx-4 bg-[#282828] rounded-lg border-b border-[rgba(198,198,198,0.3)]">
				<div className="relative flex flex-col gap-6 p-8 lg:p-12">
					{/* Header */}
					<div className="flex justify-between items-center">
						<h2 className="text-[#F1F2F3] text-2xl font-bold font-sans tracking-tight">
							Ticket Purchase
						</h2>
						<CloseIcon onClick={onClose} />
					</div>

					{/* Ticket Details */}
					<div className="flex flex-col gap-4">
						<p className="text-[#909090] text-base font-bold">Ticket</p>
						<div className="flex justify-between items-center">
							<span className="text-[#F1F2F3] text-base">1x {ticket.name}</span>
							<span className="text-[#F1F2F3] text-base font-bold">
								{formatRupiah(ticket.price)}
							</span>
						</div>
					</div>

					<DashedSeparator />

					{/* Voucher Section */}
					<div className="flex flex-col gap-4">
						<p className="text-[#909090] text-base font-bold">Voucher Code</p>

						{voucherState === "verified" ? (
							<div className="flex items-center justify-between bg-[#22835F] rounded-lg px-4 py-3">
								<div className="flex items-center gap-2">
									<CheckCircleIcon />
									<span className="text-[#F1F2F3] text-base font-medium">
										{voucherCode.toUpperCase()}
									</span>
								</div>
								<button
									type="button"
									onClick={handleClearVoucher}
									className="cursor-pointer p-1 bg-transparent border-none"
									aria-label="Remove voucher"
								>
									<img
										src="/svg/close-icon.svg"
										alt="Remove voucher"
										width={24}
										height={24}
									/>
								</button>
							</div>
						) : (
							<div className="flex flex-col gap-2">
								<div className="flex gap-2">
									<input
										type="text"
										value={voucherCode}
										onChange={handleVoucherChange}
										placeholder="Enter voucher code"
										disabled={voucherState === "verifying"}
										className="flex-1 px-4 py-3 rounded-lg bg-[#282828] border border-[#909090] text-[#F1F2F3] text-base placeholder:text-[#909090] focus:border-[#224083] focus:outline-none focus:ring-1 focus:ring-[#224083] disabled:opacity-50"
									/>
									<button
										type="button"
										onClick={handleApplyVoucher}
										disabled={
											voucherState === "empty" || voucherState === "verifying"
										}
										className="px-4 py-3 rounded-2xl text-[#282828] bg-[#FAFAFA] font-bold text-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors"
									>
										{voucherState === "verifying"
											? "Verifying..."
											: "Apply Voucher"}
									</button>
								</div>
								{voucherState === "error" && voucherResult?.clientError && (
									<p className="text-red-400 text-sm">
										{voucherResult.clientError}
									</p>
								)}
								{voucherState === "error" && voucherResult?.serverError && (
									<p className="text-red-400 text-sm">
										{voucherResult.serverError}
									</p>
								)}
							</div>
						)}
					</div>

					{/* Discount Row */}
					{discount > 0 && (
						<div className="flex justify-between items-center">
							<span className="text-[#F1F2F3] text-base">Discount Voucher</span>
							<span className="text-[#F1F2F3] text-base font-bold">
								-{formatRupiah(discount)}
							</span>
						</div>
					)}

					<DashedSeparator />

					{/* Total */}
					<div className="flex justify-between items-center">
						<span className="text-[#F1F2F3] text-base">Total</span>
						<span className="text-[#F1F2F3] text-2xl font-bold font-sans">
							{formatRupiah(total)}
						</span>
					</div>

					{/* Error from buy ticket */}
					{buyTicketResult?.clientError && (
						<p className="text-red-400 text-sm text-center">
							{buyTicketResult.clientError}
						</p>
					)}
					{buyTicketResult?.serverError && (
						<p className="text-red-400 text-sm text-center">
							{buyTicketResult.serverError}
						</p>
					)}

					{/* Purchase Form */}
					<fetcher.Form method="post">
						<input type="hidden" name="intent" value="buy-ticket" />
						<input type="hidden" name="ticket_id" value={ticket.id} />
						<input
							type="hidden"
							name="voucher_code"
							value={voucherState === "verified" ? voucherCode : ""}
						/>
						<button
							type="submit"
							disabled={isSubmitting || buyTicketResult?.clientError}
							className="w-full py-3 px-4 bg-[#FAFAFA] text-[#282828] font-bold text-lg rounded hover:bg-white transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isSubmitting ? "Processing..." : "Buy ticket"}
						</button>
					</fetcher.Form>
				</div>
			</div>
		</div>
	);
};
