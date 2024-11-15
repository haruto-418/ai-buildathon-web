import { z } from "zod";

export const localesSchema = z.object({
  selectYourLanguage: z.string(),
  welcome: z.string(),
});
export type Locales = z.infer<typeof localesSchema>;

const _ja: Locales = {
  selectYourLanguage: "言語を選択してください",
  welcome: "ようこそ！",
};

const _en: Locales = {
  selectYourLanguage: "Select your language",
  welcome: "Welcome!",
};

export const ja = localesSchema.parse(_ja);
export const en = localesSchema.parse(_en);

export const locales = {
  ja,
  en,
};
