import { useEffect, useState } from "react";
import { getPatronUserImage } from "~/api/endpoint/.client/patron";
import type { PatronUserResponseItem } from "~/api/schema/patron";

type PatronSectionProps = {
	patrons: PatronUserResponseItem[];
};

export const PatronSection = ({ patrons }: PatronSectionProps) => {
	const [images, setImages] = useState<Record<string, string>>({});

	useEffect(() => {
		let cancelled = false;
		const objectUrls: string[] = [];

		setImages({});
		void Promise.all(
			patrons.map(async (patron) => {
				try {
					const response = await getPatronUserImage({ user_id: patron.id });
					if (!response.ok) return null;

					const imageUrl = URL.createObjectURL(await response.blob());
					if (cancelled) {
						URL.revokeObjectURL(imageUrl);
						return null;
					}
					objectUrls.push(imageUrl);
					return [patron.id, imageUrl] as const;
				} catch {
					return null;
				}
			}),
		).then((results) => {
			if (cancelled) return;
			const successfulResults = results.filter(
				(result): result is readonly [string, string] => result !== null,
			);
			setImages(Object.fromEntries(successfulResults));
		});

		return () => {
			cancelled = true;
			objectUrls.forEach((url) => URL.revokeObjectURL(url));
		};
	}, [patrons]);

	if (patrons.length === 0) return null;

	return (
		<section className="px-5 py-6 sm:py-6" aria-labelledby="patron-heading">
			<div className="container mx-auto px-5 py-6 sm:px-12 sm:py-6">
				<h2
					id="patron-heading"
					className="mb-12 text-center text-3xl font-semibold text-foreground sm:mb-16 sm:text-4xl"
				>
					Thanks to our Patron
				</h2>

				<div className="mx-auto flex w-full max-w-5xl flex-wrap justify-center gap-x-8 gap-y-12">
					{patrons.map((patron) => {
						const name =
							[patron.first_name, patron.last_name].filter(Boolean).join(" ") ||
							patron.username ||
							patron.email ||
							"Patron";

						return (
							<article
								key={patron.id}
								className="flex w-full max-w-40 flex-col items-center gap-2"
							>
								<div className="flex aspect-square w-30 items-center justify-center overflow-hidden rounded-full border-2 border-foreground bg-background">
									<img
										src={images[patron.id] ?? "/images/default-avatar.webp"}
										alt={name}
										className="h-full w-full object-cover"
									/>
								</div>
								<h3 className="text-center text-xl font-semibold text-foreground">
									{name}
								</h3>
							</article>
						);
					})}
				</div>
			</div>
		</section>
	);
};
