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
import { localeSchema } from "@/lib/schemas";

const filesTablePropsSchema = z.object({
  fileData: z
    .object({
      fileTitle: z.string(),
      fileUrl: z.string(),
    })
    .array(),
  locale: localeSchema,
});
type FilesTableProps = z.infer<typeof filesTablePropsSchema>;
export function FilesTable(args: FilesTableProps) {
  const { fileData, locale } = filesTablePropsSchema.parse(args);

  return (
    <div className="rounded-md bg-card p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{locales[locale].fileTitle}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fileData.map((file) => (
            <TableRow key={file.fileUrl}>
              <TableCell>
                <a href={file.fileUrl}>{file.fileTitle}</a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
