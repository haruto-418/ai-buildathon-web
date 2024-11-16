import { z } from "zod";
import {
  handoverDocumentSchema,
  handoverSchema,
  localeSchema,
  userSchema,
} from "./schemas";

export type Locale = z.infer<typeof localeSchema>;

export type Handover = z.infer<typeof handoverSchema>;

export type HandoverDocument = z.infer<typeof handoverDocumentSchema>;

export type User = z.infer<typeof userSchema>;
