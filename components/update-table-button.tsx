import { z } from "zod";

import { locales } from "@/lib/locales";
import { localeSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "./ui/button";

const propsSchema = z.object({
  handoverId: z.string(),
  locale: localeSchema,
});
type Props = z.infer<typeof propsSchema>;
export function UpdateTableButton(props: Props) {
  const { locale } = propsSchema.parse(props);

  return (
    <Button
      className={cn(
        buttonVariants({}),
        "w-fit rounded-full px-8 py-6",
        "bg-teal-600",
        "fixed bottom-8 right-8",
        "shadow-xl",
        "border border-gray-400",
      )}
      onClick={() => {
        if (process.env.NODE_ENV !== "development") {
          alert("This is under development / 現在実装中です");
        }
      }}
    >
      {locales[locale].updateTableBasedOnAnswers}
    </Button>
  );
}
