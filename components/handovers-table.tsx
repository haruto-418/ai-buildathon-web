import { z } from "zod";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { locales } from "@/lib/locales";
import { handoverSchema, localeSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "./ui/button";

const propsSchema = z.object({
  handovers: handoverSchema.array(),
  locale: localeSchema,
});
type Props = z.infer<typeof propsSchema>;
export function HandoversTable(props: Props) {
  const { handovers, locale } = propsSchema.parse(props);

  return (
    <div className="rounded-md bg-gray-50 p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{locales[locale].title}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {handovers.map((handover) => (
            <TableRow key={handover.id}>
              <TableCell>
                <Link
                  href={`/${locale}/handovers/${handover.id}`}
                  className={cn(buttonVariants({ variant: "link" }))}
                >
                  {handover.title}
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
