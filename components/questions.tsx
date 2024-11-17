import { locales } from "@/lib/locales";
import { localeSchema, questionFromServerSchema } from "@/lib/schemas";
import { MdCheckCircle } from "react-icons/md";
import { z } from "zod";
import { QuestionAnswerForm } from "./question-answer-form";
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
  handoverId: z.string(),
});
type Props = z.infer<typeof propsSchema>;
export function Questions(props: Props) {
  const { questionsFromServer, locale, handoverId } = propsSchema.parse(props);

  return (
    <div className="rounded-md bg-card p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead />
            <TableHead>{locales[locale].question}</TableHead>
            <TableHead>{locales[locale].reason}</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {questionsFromServer.map((question) => (
            <TableRow key={question.question}>
              <TableCell>
                <MdCheckCircle className="text-green-500" />
              </TableCell>
              <TableCell>{question.question}</TableCell>
              <TableCell>{question.reason}</TableCell>
              <TableCell>
                <QuestionAnswerForm
                  handoverId={handoverId}
                  questionFromServer={question}
                  locale={locale}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
