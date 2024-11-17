import { questionFromServerSchema } from "@/lib/schemas";
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
});
type Props = z.infer<typeof propsSchema>;
export function Questions(props: Props) {
  const { questionsFromServer } = propsSchema.parse(props);

  return (
    <div className="rounded-md bg-card p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead />
            <TableHead>question</TableHead>
            <TableHead>reason</TableHead>
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
