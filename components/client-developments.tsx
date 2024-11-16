"use client";

import { Button } from "@/components/ui/button";
import { outputSchema } from "@/lib/schemas";
import { Output } from "@/lib/types";
import { usePathname } from "next/navigation";

export function ClientDevelopments() {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  const pathname = usePathname();

  const handoverIdMatch = pathname.match(/\/handovers\/([^/]+)/);
  let handoverId: string | null = null;
  if (handoverIdMatch) {
    handoverId = handoverIdMatch[1];
  } else {
    console.log("No match found");
  }

  async function generateDemoOutput() {
    if (!handoverId) {
      console.log("No handoverId found");
      return;
    }

    const _output: Output = {
      id: "",
      handoverId,
      csvUrl:
        "https://drive.google.com/file/d/1Q3fHyS4LQlGo7Uhf_LOgv76WyEwpFLvd/view?usp=sharing",
      createdAt: new Date(),
    };
    const output = outputSchema.parse(_output);
  }

  return (
    <div className="flex flex-col gap-4">
      <Button variant={"ghost"}>seeding</Button>
      {handoverId && (
        <Button variant={"ghost"}>generate demo output: {handoverId}</Button>
      )}
    </div>
  );
}
