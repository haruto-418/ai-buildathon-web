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
  edit: z.string(),
  mypage: z.string(),
  successorHandoevrs: z.string(),
  predecessorHandovers: z.string(),
  successMessages: z.object({
    add: z.string(),
    save: z.string(),
  }),
  errorMessages: z.object({
    handoverNotFound: z.string(),
    userNotFound: z.string(),
    addSuccessorError: z.string(),
    saveError: z.string(),
  }),
  title: z.string(),
  unset: z.string(),
  save: z.string(),
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
  mypage: "マイページ",
  successMessages: {
    add: "追加しました",
    save: "保存しました",
  },
  errorMessages: {
    handoverNotFound: "引き継ぎが見つかりません",
    userNotFound: "ユーザーが見つかりません",
    addSuccessorError: "後任の追加に失敗しました",
    saveError: "保存に失敗しました",
  },
  successorHandoevrs: "後任者としての引き継ぎ",
  predecessorHandovers: "前任者としての引き継ぎ",
  title: "タイトル",
  unset: "未設定",
  edit: "編集",
  save: "保存",
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
  mypage: "My Page",
  successMessages: {
    add: "Added successfully",
    save: "Saved successfully",
  },
  errorMessages: {
    handoverNotFound: "Handover not found",
    userNotFound: "User not found",
    addSuccessorError: "Failed to add successor",
    saveError: "Failed to save",
  },
  successorHandoevrs: "Handovers as a successor",
  predecessorHandovers: "Handovers as a predecessor",
  title: "Title",
  unset: "Unset",
  edit: "Edit",
  save: "Save",
};

export const ja = localesSchema.parse(_ja);
export const en = localesSchema.parse(_en);

export const locales = {
  ja,
  en,
};
