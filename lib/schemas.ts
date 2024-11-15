import { z } from "zod";

export const localeSchema = z.enum(["ja", "en"]);

export const userSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  imageUrl: z.string().nullable().default(null),
  createdAt: z.union([z.string(), z.date()]).transform((val) => new Date(val)),
});
