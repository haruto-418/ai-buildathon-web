import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

import { storage } from "@/lib/firebase";

export async function POST(request: NextRequest) {
  const bucket = storage.bucket(process.env.FIREBASE_STORAGE_BUCKET);

  const data = await request.formData();
  const file = data.get("file") as Blob | null;

  if (!file) {
    return NextResponse.json({ success: 0, message: "No file uploaded" });
  }

  // @ts-expect-error file.name
  const title = file.name ?? "名称未設定ファイル";

  const fileType = title.split(".").pop();
  if (!fileType) {
    return NextResponse.json({ success: 0, message: "File type not found" });
  }

  const filename = `${uuidv4()}.${fileType}`;
  const path = bucket.file(`${filename}`);

  const fileBuffer = Buffer.from(await file.arrayBuffer());

  try {
    // Firebase Storageにアップロード
    await path.save(fileBuffer, {
      metadata: { contentType: file.type },
    });
    console.info("File uploaded to Firebase Storage:", filename);
  } catch (err) {
    console.error("Error saving(uploading) file to Firebase Storage:", err);
    return NextResponse.json({ success: 0, message: "Upload failed" });
  }

  let url: string;
  try {
    // ファイルの公開URLを取得
    const [_url] = await path.getSignedUrl({
      action: "read",
      expires: "03-09-2500",
    });

    url = _url as string;

    console.info("File uploaded to Firebase Storage:", url);
  } catch (err) {
    console.error("Error getting signed URL:", err);
    return NextResponse.json({
      success: 0,
      message: "Failed to get signed URL",
    });
  }

  return NextResponse.json({
    success: 1,
    file: { url, title, extention: fileType },
  });
}
