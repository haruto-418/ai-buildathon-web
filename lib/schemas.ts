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

export const handoverDocumentSchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string(),
  createdAt: z.union([z.string(), z.date()]).transform((val) => new Date(val)),
});

export const handoverSchema = z.object({
  id: z.string(),
  title: z.string().nullable().default(null),
  predecessorId: z.string(),
  successorId: z.string().nullable().default(null),
  handoverDocuments: z.array(handoverDocumentSchema).default([]),
  createdAt: z.union([z.string(), z.date()]).transform((val) => new Date(val)),
});
