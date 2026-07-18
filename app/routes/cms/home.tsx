import { Link } from "react-router";

export default function CMSHomePage() {
	return (
		<div>
			<h2>CMS Home Page</h2>
			<ul style={{ listStyle: "none", padding: 0 }}>
				{[
					{ to: "/cms/voucher", label: "Voucher" },
					{ to: "/cms/organizer", label: "Organizer" },
					{ to: "/cms/speaker", label: "Speaker" },
					{ to: "/cms/volunteer", label: "Volunteer" },
					{ to: "/cms/user", label: "User QR" },
					{ to: "/cms/schedule", label: "Schedule" },
					{ to: "/cms/patron", label: "Patron" },
					{ to: "/cms/home", label: "Analytics" },
				].map(({ to, label }) => (
					<li key={to} style={{ marginBottom: "8px" }}>
						<Link
							to={to}
							style={{
								display: "inline-block",
								padding: "8px 16px",
								background: "#007bff",
								color: "#fff",
								border: "none",
								borderRadius: "4px",
								textDecoration: "none",
								fontWeight: "bold",
								cursor: "pointer",
								transition: "background 0.2s",
							}}
						>
							{label}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
