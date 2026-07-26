"use server";

import { importCsvRows, parseImportCsv, type ImportRowResult } from "@/lib/import/csv";

export type ImportState = {
  error?: string;
  results?: ImportRowResult[];
};

export async function importCsvAction(
  _prevState: ImportState,
  formData: FormData
): Promise<ImportState> {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose a CSV file first." };
  }

  const text = await file.text();
  if (!text.trim()) {
    return { error: "That file is empty." };
  }

  let records: Record<string, string>[];
  try {
    records = parseImportCsv(text);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Couldn't parse that CSV." };
  }

  if (records.length === 0) {
    return { error: "No data rows found in that CSV." };
  }

  const results = await importCsvRows(records);
  return { results };
}
