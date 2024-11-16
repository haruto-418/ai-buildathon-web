import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { locales } from "@/lib/locales";
import { localeSchema } from "@/lib/schemas";
import type { Locale } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  params: Promise<{ locale: Locale }>;
};

export default async function Page({ params }: Props) {
  const { locale: _locale } = await params;
  const locale = localeSchema.parse(_locale);

  return (
    <div className="flex flex-col items-center justify-center gap-8 py-8">
      <Link
        href={`/${locale}/handovers`}
        className={cn(
          buttonVariants({}),
          "rounded-full bg-teal-500 px-8 py-6 text-lg font-bold text-white",
        )}
      >
        {locales[locale].startHandOver}
      </Link>
      <div className="flex flex-col items-center gap-2">
        <p>{locales[locale].ifYouWantToWorkWithExistingHandover}</p>
        <Link
          href={`/${locale}/mypage`}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "border-gray-400",
          )}
        >
          {locales[locale].mypage}
        </Link>
      </div>
    </div>
  );
}
