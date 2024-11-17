import { locales } from "@/lib/locales";
import { localeSchema, questionFromServerSchema } from "@/lib/schemas";
import { z } from "zod";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

const propsSchema = z.object({
  questionsFromServer: questionFromServerSchema.array(),
  locale: localeSchema,
});
type Props = z.infer<typeof propsSchema>;
export function Questions(props: Props) {
  const { questionsFromServer, locale } = propsSchema.parse(props);

  return (
    <div className="rounded-md bg-card p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead />
            <TableHead>{locales[locale].question}</TableHead>
            <TableHead>{locales[locale].reason}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {questionsFromServer.map((question) => (
            <TableRow key={question.question}>
              <TableCell></TableCell>
              <TableCell>{question.question}</TableCell>
              <TableCell>{question.reason}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
