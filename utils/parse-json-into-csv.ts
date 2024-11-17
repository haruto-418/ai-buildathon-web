import { z } from "zod";

const parseJsonIntoCsvSchema = z.object({
  json: z.string(),
});
type ParseJsonIntoCsv = z.infer<typeof parseJsonIntoCsvSchema>;
export function parseJsonIntoCsv(args: ParseJsonIntoCsv) {
  const { json: jsonArray } = parseJsonIntoCsvSchema.parse(args);

  // JSONをオブジェクトにパース
  const jsonObject =
    typeof jsonArray === "string" ? JSON.parse(jsonArray) : jsonArray;

  // JSONオブジェクトのパース
  const tableData = jsonObject.Table;

  if (!Array.isArray(tableData) || tableData.length === 0) {
    throw new Error("JSONデータが無効または空です");
  }

  // ヘッダー行を作成 (columnnameをキーとする)
  const headers = tableData.map((row) => row.columnname);

  // データ行を作成 (valueをデータとして抽出)
  const values = tableData.map((row) => {
    const value = row.value;
    // 値にカンマや改行が含まれる場合はクォートで囲む
    return typeof value === "string" &&
      (value.includes(",") || value.includes("\n"))
      ? `"${value.replace(/"/g, '""')}"`
      : value;
  });

  // CSV形式に変換
  const csvRows = [headers.join(","), values.join(",")];

  return csvRows.join("\n");
}
