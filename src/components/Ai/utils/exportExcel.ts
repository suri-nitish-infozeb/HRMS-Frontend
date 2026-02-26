import * as XLSX from "xlsx";
import type { TableMessage } from "../types";

function sanitizeSheetName(name: string) {
  // Excel rules: max 31 chars and cannot contain: : \ / ? * [ ]
  const cleaned = name.replace(/[:\\/?*\[\]]/g, " ").trim();
  return (cleaned || "Data").slice(0, 31);
}

export function downloadTableAsXLSX(
  message: TableMessage,
  filename = "insight.xlsx"
) {
  const worksheet = XLSX.utils.json_to_sheet(message.rows || []);
  const workbook = XLSX.utils.book_new();

  const sheetName = sanitizeSheetName(message.title || "Data");
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  XLSX.writeFile(workbook, filename);
}

export function downloadTableAsCSV(
  message: TableMessage,
  filename = "insight.csv"
) {
  const worksheet = XLSX.utils.json_to_sheet(message.rows || []);
  const csv = XLSX.utils.sheet_to_csv(worksheet);

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}