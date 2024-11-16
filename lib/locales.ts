import { z } from "zod";

export const localesSchema = z.object({
  selectYourLanguage: z.string(),
  welcome: z.string(),
  startHandOver: z.string(),
  successor: z.string(),
});
export type Locales = z.infer<typeof localesSchema>;

const _ja: Locales = {
  selectYourLanguage: "言語を選択してください",
  startHandOver: "引き継ぎを開始",
  welcome: "ようこそ！",
  successor: "後任",
};

const _en: Locales = {
  selectYourLanguage: "Select your language",
  welcome: "Welcome!",
  startHandOver: "Start hand over",
  successor: "Successor",
};

export const ja = localesSchema.parse(_ja);
export const en = localesSchema.parse(_en);

export const locales = {
  ja,
  en,
};
