"use client";

import Papa from "papaparse";
import { useEffect, useState } from "react";
import { z } from "zod";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const propsSchema = z.object({
  csvUrl: z.string(),
});
type Props = z.infer<typeof propsSchema>;
const CSVReader = (props: Props) => {
  const { csvUrl } = propsSchema.parse(props);
  const [data, setData] = useState([]);

  // CSVデータを取得して解析
  useEffect(() => {
    const fetchAndParseCSV = async () => {
      try {
        const response = await fetch(csvUrl);
        const csvText = await response.text();
        Papa.parse(csvText, {
          header: true, // ヘッダー行を認識
          skipEmptyLines: true, // 空行をスキップ
          // @ts-ignore
          complete: (results) => setData(results.data),
        });
      } catch (error) {
        console.error("Failed to fetch or parse CSV:", error);
      }
    };

    fetchAndParseCSV();
  }, [csvUrl]);

  return (
    <div className="mx-auto bg-card p-4">
      {data.length > 0 ? (
        <Table>
          {/* ヘッダー行 */}
          <TableHeader>
            <TableRow>
              {Object.keys(data[0]).map((column) => (
                <TableHead key={column}>{column}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          {/* データ行 */}
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {Object.keys(row).map((column) => (
                  <TableCell key={`${rowIndex}-${column}`}>
                    {row[column]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p>データを読み込んでいます...</p>
      )}
    </div>
  );
};

export default CSVReader;
