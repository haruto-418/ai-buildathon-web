"use client";

import { redirect } from "next/navigation";
import { BsArrowReturnLeft } from "react-icons/bs";

import { Button, buttonVariants } from "@/components/ui/button";
import { locales } from "@/lib/locales";
import { localeSchema } from "@/lib/schemas";
import { Locale } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  handoverId: string;
  locale: Locale;
};

export function HandoverTopButton({
  className,
  locale: _locale,
  handoverId,
}: Props) {
  const locale = localeSchema.parse(_locale);

  return (
    <Button
      onClick={() => {
        if (confirm(locales[locale].confirmBack)) {
          redirect(`/${locale}/handovers/${handoverId}`);
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
