import CSVReader from "@/components/csv-reader";
import { demo1Json } from "@/lib/data";
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
  const { locale, handoverId } = await params;

  const { output } = await fetchData({ handoverId });
  console.log({ output });

  const csvData = parseJsonIntoCsv({ json: JSON.stringify(demo1Json) });
  console.log({ csvData });

  return (
    <div>
      <CSVReader data={csvData} />
      <h1>Handover {handoverId}</h1>
      <p>Locale: {locale}</p>
    </div>
  );
}
