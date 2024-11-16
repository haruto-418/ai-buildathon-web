"use client";

import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

import { localeSchema } from "@/lib/schemas";
import type { Locale } from "@/lib/types";

export default function Page() {
  const [localeInLocalStorage, setLocaleInLocalStorage] =
    useState<Locale | null>(null);

  // 初期値を localStorage から読み込む
  useEffect(() => {
    const value = localStorage.getItem("locale");

    const { data: locale, success } = localeSchema.safeParse(value);

    if (value) {
      if (success) {
        setLocaleInLocalStorage(locale);
      } else {
        localStorage.removeItem("locale");
        redirect("/");
      }
    } else {
      redirect("/");
    }
  }, []);

  return <div>{localeInLocalStorage}</div>;
}
