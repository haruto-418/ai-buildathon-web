import { locales } from "@/lib/locales";
import { localeSchema } from "@/lib/schemas";
import { Locale } from "@/lib/types";

type Props = {
  params: Promise<{ locale: Locale }>;
};

export default async function Page({ params }: Props) {
  const { locale: _locale } = await params;
  const locale = localeSchema.parse(_locale);

  return (
    <div className="flex justify-center py-8">
      <p>{locales[locale].welcome}</p>
    </div>
  );
}
