import { z } from "zod";

const fetchDataSchema = z.object({
  handoverId: z.string(),
  locale: z.string(),
});
type FetchData = z.infer<typeof fetchDataSchema>;
async function fetchData(args: FetchData) {
  const { handoverId, locale } = fetchDataSchema.parse(args);

  return { handoverId, locale };
}

type Props = {
  params: Promise<{ handoverId: string; locale: string }>;
};

export default async function Page({ params }: Props) {
  const { handoverId, locale } = await params;

  const {} = await fetchData({ handoverId, locale });

  return (
    <div>
      <h1></h1>
      <div></div>
      <p>{handoverId}</p>
      <p>{locale}</p>
    </div>
  );
}
