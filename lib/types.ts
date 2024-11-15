import { z } from "zod";
import { localeSchema, userSchema } from "./schemas";

export type Locale = z.infer<typeof localeSchema>;

export type User = z.infer<typeof userSchema>;
