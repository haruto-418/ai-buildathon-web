import CSVReader from "@/components/csv-reader";
import { Questions } from "@/components/questions";
import { demo1Json, questionsJson } from "@/lib/data";
import { locales } from "@/lib/locales";
import { localeSchema } from "@/lib/schemas";
import { fetchOutputByHandoverId } from "@/utils/interfaces/outputs/fetch";
import { parseJsonIntoCsv } from "@/utils/parse-json-into-csv";

async function fetchData({ handoverId }: { handoverId: string }) {
  const output = await fetchOutputByHandoverId({ handoverId });

  return { output };
}

type Props = {
  params: Promise<{ locale: string; handoverId: string }>;
};
export default async function Page({ params }: Props) {
  const { locale: _locale, handoverId } = await params;
  const locale = localeSchema.parse(_locale);

  const { output } = await fetchData({ handoverId });
  console.log({ output });

  const csvData = parseJsonIntoCsv({ json: JSON.stringify(demo1Json) });
  console.log({ csvData });

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="font-bold">{locales[locale].handoverTable}</h2>
        <CSVReader data={csvData} />
      </div>
      <div>
        <h2 className="font-bold">{locales[locale].question}</h2>
        <Questions
          questionsFromServer={questionsJson.questions}
          locale={locale}
          handoverId={handoverId}
        />
      </div>
    </div>
  );
}
