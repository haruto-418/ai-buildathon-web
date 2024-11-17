"use client";

import { useRouter } from "next/navigation";
import { BsArrowReturnLeft } from "react-icons/bs";

import { Button, buttonVariants } from "@/components/ui/button";
import { locales } from "@/lib/locales";
import { localeSchema } from "@/lib/schemas";
import { Locale } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  locale: Locale;
};

export function BackButton({ className, locale: _locale }: Props) {
  const locale = localeSchema.parse(_locale);
  const router = useRouter();

  return (
    <Button
      onClick={() => {
        if (confirm(locales[locale].confirmBack)) {
          router.back();
        }
      }}
      className={cn(
        buttonVariants({ variant: "outline" }),
        "flex items-center gap-2 text-black",
        className,
      )}
    >
      {locales[locale].back}
      <BsArrowReturnLeft />
    </Button>
  );
}
