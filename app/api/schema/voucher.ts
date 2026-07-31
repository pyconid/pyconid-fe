import { z } from "zod";

export const VoucherEmailWhitelistSchema = z.object({
	emails: z.array(z.string()),
});

export const VoucherResultSchema = z.object({
	id: z.string(),
	code: z.string(),
	value: z.number().nullable(),
	type: z.string().nullable(),
	email_whitelist: VoucherEmailWhitelistSchema.nullable(),
	quota: z.number().nullable(),
	is_active: z.boolean().nullable(),
	tickets: z
		.array(
			z.object({
				id: z.string(),
				name: z.string(),
			}),
		)
		.nullable()
		.optional(),
});

export const VoucherListSchema = z.array(VoucherResultSchema);

export type VoucherListType = z.infer<typeof VoucherListSchema>;

export const VoucherResponseSchema = z.object({
	page: z.number(),
	page_size: z.number(),
	count: z.number(),
	page_count: z.number(),
	results: VoucherListSchema,
});
