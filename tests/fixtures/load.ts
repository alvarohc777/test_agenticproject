import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import type { ImportFile } from "../../src/engines/ingest";

const root = fileURLToPath(new URL("../../", import.meta.url));

export const readText = (path: string) => readFileSync(root + path, "utf8");

/** The made-up demo exports bundled with the app (content/demo/). */
export function demoFiles(): ImportFile[] {
  return [
    { text: readText("content/demo/account1.csv"), fileName: "account1.csv" },
    { text: readText("content/demo/account3.csv"), fileName: "account3.csv" },
  ];
}
