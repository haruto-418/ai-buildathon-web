import { buttonVariants } from "@/components/ui/button";
import { locales } from "@/lib/locales";
import { localeSchema } from "@/lib/schemas";
import { Locale } from "@/lib/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";

type Props = {
  params: Promise<{ locale: Locale }>;
};

export default async function Page({ params }: Props) {
  const { locale: _locale } = await params;
  const locale = localeSchema.parse(_locale);

  return (
    <div className="flex justify-center py-8">
      <Link
        href={`/${locale}/handovers/${uuidv4()}`}
        className={cn(buttonVariants({}))}
      >
        {locales[locale].startHandOver}
      </Link>
      <p></p>
    </div>
  );
}
