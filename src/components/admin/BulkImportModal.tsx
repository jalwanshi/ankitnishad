"use client";

import { useMemo, useRef, useState } from "react";
import { Download, FileJson, FileSpreadsheet, Upload, X } from "lucide-react";
import { BulkImportRecord } from "@/lib/bulkImport";

type ImportFormat = "csv" | "json";

interface BulkImportModalProps {
  open: boolean;
  title: string;
  description: string;
  fields: string[];
  sample: BulkImportRecord;
  onClose: () => void;
  onImport: (records: BulkImportRecord[]) => Promise<number>;
}

function parseCsvRows(input: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let value = "";
  let quoted = false;

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];
    const nextCharacter = input[index + 1];

    if (character === '"') {
      if (quoted && nextCharacter === '"') {
        value += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
      continue;
    }

    if (character === "," && !quoted) {
      row.push(value);
      value = "";
      continue;
    }

    if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && nextCharacter === "\n") index += 1;
      row.push(value);
      if (row.some((cell) => cell.trim())) rows.push(row);
      row = [];
      value = "";
      continue;
    }

    value += character;
  }

  row.push(value);
  if (row.some((cell) => cell.trim())) rows.push(row);

  if (quoted) {
    throw new Error("CSV has an unclosed quoted value.");
  }

  return rows;
}

function parseCsv(input: string): BulkImportRecord[] {
  const rows = parseCsvRows(input);
  if (rows.length < 2) {
    throw new Error("CSV needs a header row and at least one data row.");
  }

  const headers = rows[0].map((header) => header.trim());
  if (headers.some((header) => !header)) {
    throw new Error("Every CSV column must have a header.");
  }

  return rows.slice(1).map((row) =>
    Object.fromEntries(headers.map((header, index) => [header, row[index]?.trim() ?? ""]))
  );
}

function parseJson(input: string): BulkImportRecord[] {
  const parsed: unknown = JSON.parse(input);
  const records =
    Array.isArray(parsed)
      ? parsed
      : parsed && typeof parsed === "object" && Array.isArray((parsed as { items?: unknown[] }).items)
        ? (parsed as { items: unknown[] }).items
        : [parsed];

  if (
    records.length === 0 ||
    records.some((record) => !record || typeof record !== "object" || Array.isArray(record))
  ) {
    throw new Error("JSON must contain an object or an array of objects.");
  }

  return records as BulkImportRecord[];
}

function escapeCsvCell(value: unknown): string {
  const text = Array.isArray(value) ? value.join(" | ") : String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

export default function BulkImportModal({
  open,
  title,
  description,
  fields,
  sample,
  onClose,
  onImport
}: BulkImportModalProps) {
  const [format, setFormat] = useState<ImportFormat>("csv");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const placeholder = useMemo(() => {
    if (format === "json") return JSON.stringify([sample], null, 2);
    return [
      fields.join(","),
      fields.map((field) => escapeCsvCell(sample[field])).join(",")
    ].join("\n");
  }, [fields, format, sample]);

  if (!open) return null;

  const closeModal = () => {
    if (importing) return;
    setContent("");
    setError("");
    onClose();
  };

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const nextFormat = file.name.toLowerCase().endsWith(".json") ? "json" : "csv";
    setFormat(nextFormat);
    setContent(await file.text());
    setError("");
    event.target.value = "";
  };

  const downloadTemplate = () => {
    const template = placeholder;
    const blob = new Blob([template], {
      type: format === "json" ? "application/json" : "text/csv;charset=utf-8"
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-template.${format}`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async () => {
    setError("");
    if (!content.trim()) {
      setError("Paste data or choose a CSV/JSON file first.");
      return;
    }

    try {
      setImporting(true);
      const records = format === "json" ? parseJson(content) : parseCsv(content);
      await onImport(records);
      setContent("");
      onClose();
    } catch (importError) {
      setError(importError instanceof Error ? importError.message : "Bulk import failed.");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-primary-black/70 p-4 backdrop-blur-sm sm:p-6">
      <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col border border-border-grey bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-6 border-b border-border-grey px-6 py-5">
          <div>
            <h2 className="font-display text-xl uppercase tracking-wider text-primary-black">
              Bulk Add {title}
            </h2>
            <p className="mt-1 max-w-2xl text-[10px] uppercase leading-relaxed tracking-widest text-muted-grey">
              {description}
            </p>
          </div>
          <button
            type="button"
            onClick={closeModal}
            disabled={importing}
            className="p-1 text-muted-grey transition-colors hover:text-primary-black disabled:opacity-50"
            aria-label="Close bulk import"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 overflow-y-auto p-6">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div className="flex gap-2">
              {(["csv", "json"] as ImportFormat[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setFormat(item);
                    setError("");
                  }}
                  className={`flex items-center gap-2 border px-4 py-2 text-[10px] font-semibold uppercase tracking-widest transition-colors ${
                    format === item
                      ? "border-primary-black bg-primary-black text-white"
                      : "border-border-grey bg-white text-muted-grey hover:border-primary-black hover:text-primary-black"
                  }`}
                >
                  {item === "csv" ? <FileSpreadsheet className="h-3.5 w-3.5" /> : <FileJson className="h-3.5 w-3.5" />}
                  {item}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={downloadTemplate}
                className="flex items-center gap-2 border border-border-grey px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-muted-grey transition-colors hover:border-primary-black hover:text-primary-black"
              >
                <Download className="h-3.5 w-3.5" />
                Download Template
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 border border-primary-black px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-primary-black transition-colors hover:bg-primary-black hover:text-white"
              >
                <Upload className="h-3.5 w-3.5" />
                Choose File
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv,.json,application/json"
                onChange={handleFile}
                className="hidden"
              />
            </div>
          </div>

          <div className="border border-border-grey bg-soft-bg px-4 py-3">
            <p className="text-[9px] uppercase leading-relaxed tracking-widest text-muted-grey">
              Columns: {fields.join(", ")}. For list fields, separate items with a pipe ( | ), semicolon, comma, or use a JSON array.
            </p>
          </div>

          <textarea
            rows={16}
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder={placeholder}
            spellCheck={false}
            className="w-full resize-y border border-border-grey bg-main-bg px-4 py-3 font-mono text-xs font-light leading-relaxed focus:border-primary-black focus:outline-none"
          />

          {error && (
            <div className="border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
              {error}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-border-grey px-6 py-4">
          <button
            type="button"
            onClick={closeModal}
            disabled={importing}
            className="px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-muted-grey transition-colors hover:text-primary-black disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleImport}
            disabled={importing}
            className="border border-primary-black bg-primary-black px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-primary-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            {importing ? "Importing..." : "Import All"}
          </button>
        </div>
      </div>
    </div>
  );
}
