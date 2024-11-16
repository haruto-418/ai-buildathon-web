import { z } from "zod";

export const localesSchema = z.object({
  selectYourLanguage: z.string(),
  welcome: z.string(),
  startHandOver: z.string(),
  successor: z.string(),
  predecessor: z.string(),
  fileTitle: z.string(),
  handoverPage: z.string(),
  email: z.string(),
  emailInputDescription: z.string(),
  add: z.string(),
  successMessages: z.object({
    add: z.string(),
  }),
  errorMessages: z.object({
    handoverNotFound: z.string(),
    userNotFound: z.string(),
    addSuccessorError: z.string(),
  }),
});
export type Locales = z.infer<typeof localesSchema>;

const _ja: Locales = {
  selectYourLanguage: "言語を選択してください",
  startHandOver: "引き継ぎを開始",
  welcome: "ようこそ！",
  successor: "後任",
  predecessor: "前任",
  fileTitle: "ファイル名",
  handoverPage: "引き継ぎページ",
  email: "メールアドレス",
  emailInputDescription:
    "ユーザー登録に使用したGoogleアカウントのgmailを入力してください",
  add: "追加",
  successMessages: {
    add: "追加しました",
  },
  errorMessages: {
    handoverNotFound: "引き継ぎが見つかりません",
    userNotFound: "ユーザーが見つかりません",
    addSuccessorError: "後任の追加に失敗しました",
  },
};

const _en: Locales = {
  selectYourLanguage: "Select your language",
  welcome: "Welcome!",
  startHandOver: "Start hand over",
  successor: "Successor",
  predecessor: "Predecessor",
  fileTitle: "File Title",
  handoverPage: "Handover Page",
  email: "Email",
  emailInputDescription:
    "Enter the gmail address of the Google account you used for user registration",
  add: "Add",
  successMessages: {
    add: "Added successfully",
  },
  errorMessages: {
    handoverNotFound: "Handover not found",
    userNotFound: "User not found",
    addSuccessorError: "Failed to add successor",
  },
};

export const ja = localesSchema.parse(_ja);
export const en = localesSchema.parse(_en);

export const locales = {
  ja,
  en,
};
