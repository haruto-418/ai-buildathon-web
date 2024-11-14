import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch(
    "https://ai-buildathon-2024-test-926771992458.us-central1.run.app",
  );
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await res.json();

  return NextResponse.json({ data });
}
