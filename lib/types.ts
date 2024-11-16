import { z } from "zod";
import {
  handoverDocumentSchema,
  handoverSchema,
  localeSchema,
  outputSchema,
  userSchema,
} from "./schemas";

export type Locale = z.infer<typeof localeSchema>;

export type Handover = z.infer<typeof handoverSchema>;

export type HandoverDocument = z.infer<typeof handoverDocumentSchema>;

export type Output = z.infer<typeof outputSchema>;

export type User = z.infer<typeof userSchema>;
