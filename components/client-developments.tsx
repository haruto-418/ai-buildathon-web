"use client";

import { Button } from "@/components/ui/button";
import { outputSchema } from "@/lib/schemas";
import { Output } from "@/lib/types";
import { createOutput } from "@/utils/interfaces/outputs/create";
import { usePathname } from "next/navigation";

export function ClientDevelopments() {
  const pathname = usePathname();

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

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
      handoverTableString: ``,
      createdAt: new Date(),
    };
    const output = outputSchema.parse(_output);

    try {
      await createOutput({ output });
    } catch (err) {
      console.error(`Failed to create output: ${err}`);
      throw new Error(`Failed to create output: ${err}`);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Button variant={"ghost"}>seeding</Button>
      {handoverId && (
        <Button variant={"ghost"} onClick={generateDemoOutput}>
          generate demo output: {handoverId}
        </Button>
      )}
    </div>
  );
}
