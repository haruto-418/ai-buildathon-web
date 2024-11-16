"use client";

import { Button } from "@/components/ui/button";
import { en, ja } from "@/lib/locales";
import { cn } from "@/lib/utils";
import { redirect } from "next/navigation";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      <div className="flex flex-col">
        <p className="text-lg font-bold">{ja.selectYourLanguage}</p>
        <p className="text-lg font-bold">{en.selectYourLanguage}</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant={"outline"}
          className={cn("w-full border-gray-400")}
          onClick={() => {
            localStorage.setItem("locale", "ja");
            redirect("/ja");
          }}
        >
          日本語
        </Button>
        <Button
          variant={"outline"}
          className={cn("w-full border-gray-400")}
          onClick={() => {
            localStorage.setItem("locale", "en");
            redirect("/en");
          }}
        >
          English
        </Button>
      </div>
    </div>
  );
}
