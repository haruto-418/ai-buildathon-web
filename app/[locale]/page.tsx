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
    <div className="flex justify-center py-8">
      <Link href={`/${locale}/handovers`} className={cn(buttonVariants({}))}>
        {locales[locale].startHandOver}
      </Link>
      <p></p>
    </div>
  );
}
