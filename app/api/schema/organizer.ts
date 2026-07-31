import { z } from "zod";

export const organizerDetailTypeSchema = z.object({
	id: z.string(),
	name: z.string(),
});

export const organizerDetailUserSchema = z.object({
	id: z.string(),
	first_name: z.string().nullable(),
	last_name: z.string().nullable(),
	username: z.string().nullable(),
	bio: z.string().nullable(),
	job_title: z.string().nullable().optional(),
	job_category: z.string().nullable().optional(),
	company: z.string().nullable().optional(),
	profile_picture: z.string().nullable(),
	email: z.string().nullable(),
	website: z.string().nullable(),
	facebook_username: z.string().nullable(),
	linkedin_username: z.string().nullable(),
	instagram_username: z.string().nullable(),
	twitter_username: z.string().nullable(),
	github_username: z.string().nullable().optional(),
});

export const organizerDetailSchema = z.object({
	id: z.string(),
	user: organizerDetailUserSchema,
	organizer_type: organizerDetailTypeSchema.nullable(),
});

export type OrganizerDetailType = z.infer<typeof organizerDetailSchema>;

export const organizerListSchema = z.object({
	results: z.array(organizerDetailSchema),
});

export type OrganizerListType = z.infer<typeof organizerListSchema>;

export const organizerCreateSchema = z.object({
	user_id: z.string(),
	organizer_type_id: z.string(),
});

export type OrganizerCreateType = z.infer<typeof organizerCreateSchema>;

export const organizerResponseItemSchema = z.object({
	id: z.string(),
	user_id: z.string(),
	organizer_type_id: z.string(),
	created_at: z.string().nullable(),
	updated_at: z.string().nullable(),
});

export type OrganizerResponseItemType = z.infer<
	typeof organizerResponseItemSchema
>;

export const organizerUpdateSchema = z.object({
	user_id: z.string().nullable().optional(),
	organizer_type_id: z.string().nullable().optional(),
});

export type OrganizerUpdateType = z.infer<typeof organizerUpdateSchema>;

export const organizersByTypeSchema = z.object({
	organizer_type: organizerDetailTypeSchema,
	organizers: z.array(organizerDetailUserSchema),
});

export type OrganizersByTypeType = z.infer<typeof organizersByTypeSchema>;

export const organizersByTypeAllSchema = z.object({
	results: z.array(organizersByTypeSchema),
});

export type OrganizersByTypeAllType = z.infer<typeof organizersByTypeAllSchema>;

export const organizerTypeAllSchema = z.object({
	results: z.array(organizerDetailTypeSchema),
});

export type OrganizerTypeAllType = z.infer<typeof organizerTypeAllSchema>;

export const organizerUserSchema = z.object({
	id: z.string(),
	username: z.string().nullable(),
	first_name: z.string().nullable(),
	last_name: z.string().nullable(),
	email: z.string().nullable(),
});

export type OrganizerUserType = z.infer<typeof organizerUserSchema>;

export const organizerUserListSchema = z.object({
	results: z.array(organizerUserSchema),
});

export type OrganizerUserListType = z.infer<typeof organizerUserListSchema>;

export const organizerDeleteSchema = z.object({
	message: z.string(),
});

export type OrganizerDeleteType = z.infer<typeof organizerDeleteSchema>;

export const organizerPublicSchema = organizerDetailSchema;

export type OrganizerPublicType = z.infer<typeof organizerPublicSchema>;

export const organizerPublicListSchema = organizerListSchema;

export type OrganizerPublicListType = z.infer<typeof organizerPublicListSchema>;
