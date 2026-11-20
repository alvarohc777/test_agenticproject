/** Columns of the PostFinance sample export, in file order. */
export const CSV_COLUMNS = [
  "name",
  "type",
  "source_id",
  "source_label",
  "target_id",
  "target_label",
  "transaction_date",
  "value_date",
  "amount",
  "currency",
  "status",
  "exchange_rate",
  "base_amount",
  "base_currency",
  "description",
] as const;

export type CsvColumn = (typeof CSV_COLUMNS)[number];
export type RawRow = Record<CsvColumn, string>;

export class CsvFormatError extends Error {}

/** RFC 4180 parser: quoted fields, "" escapes, CRLF or LF, optional BOM. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  const s = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;

  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (quoted) {
      if (c === '"' && s[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') {
        quoted = false;
      } else {
        field += c;
      }
    } else if (c === '"') {
      quoted = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && s[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += c;
    }
  }
  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => !(r.length === 1 && r[0] === ""));
}

/** Parses an export and checks it has every expected column. */
export function readRows(text: string): RawRow[] {
  const [header, ...body] = parseCsv(text);
  if (!header) throw new CsvFormatError("The file is empty.");
  const index = new Map(header.map((h, i) => [h.trim(), i]));
  const missing = CSV_COLUMNS.filter((c) => !index.has(c));
  if (missing.length > 0) {
    throw new CsvFormatError(`Missing columns: ${missing.join(", ")}`);
  }
  return body.map((cells) => {
    const row = {} as RawRow;
    for (const col of CSV_COLUMNS) row[col] = (cells[index.get(col)!] ?? "").trim();
    return row;
  });
}
