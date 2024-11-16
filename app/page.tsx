"use client";

import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { en, ja } from "@/lib/locales";
import { localeSchema } from "@/lib/schemas";
import type { Locale } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { RotatingLines } from "react-loader-spinner";

export default function Page() {
  const [locale, setLocale] = useState<Locale | null>();

  useEffect(() => {
    const storedLocale = localStorage.getItem("locale");
    const _locale = localeSchema.safeParse(storedLocale);
    if (storedLocale) {
      if (_locale.success) {
        setLocale(storedLocale as Locale);
        return;
      }
    }

    setLocale(null);
  }, []);

  if (locale === undefined) {
    return (
      <div className="flex items-center justify-center">
        <RotatingLines
          visible={true}
          width="96"
          strokeColor="#1e293b"
          strokeWidth="5"
          animationDuration="0.75"
          ariaLabel="rotating-lines-loading"
        />
      </div>
    );
  }
  return (
    <div className="relative flex flex-col items-center justify-center gap-4 py-8">
      {locale !== null ? (
        <div></div>
      ) : (
        <div>
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
      )}
    </div>
  );
}
