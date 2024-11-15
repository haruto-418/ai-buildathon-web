"use client";

import { Button } from "@/components/ui/button";

export function ClientDevelopments() {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div>
      <Button variant={"ghost"}>seeding</Button>
    </div>
  );
}
