"use client";

import { redirect } from "next/navigation";
import { useEffect } from "react";

import { localeSchema } from "@/lib/schemas";

export default function Page() {
  // 初期値を localStorage から読み込む
  useEffect(() => {
    const value = localStorage.getItem("locale");

    const { data: locale, success } = localeSchema.safeParse(value);

    if (value) {
      if (success) {
        redirect(`/${locale}/mypage`);
      } else {
        localStorage.removeItem("locale");
        redirect("/");
      }
    } else {
      redirect("/");
    }
  }, []);

  return null;
}
