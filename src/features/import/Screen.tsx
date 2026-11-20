import { useState } from "react";
import { createCsvSource } from "../../adapters/transactions/csv";
import { useServices } from "../../app/services";
import { ingest, type ImportFile, type IngestReport } from "../../engines/ingest";
import { useI18n } from "../../shared/i18n";
import { Card } from "../../shared/ui";

export function Screen() {
  const { t } = useI18n();
  const { setSource } = useServices();
  const [files, setFiles] = useState<ImportFile[]>([]);
  const [report, setReport] = useState<IngestReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onPick(list: FileList | null) {
    setError(null);
    const picked = await Promise.all([...(list ?? [])].map(async (f) => ({ text: await f.text(), fileName: f.name })));
    try {
      setReport(ingest(picked).report);
      setFiles(picked);
    } catch (e) {
      setReport(null);
      setError(String(e));
    }
  }

  return (
    <Card>
      <p>{t("import.pick")}</p>
      <input type="file" accept=".csv,text/csv" multiple onChange={(e) => onPick(e.target.files)} />
      {error && <p className="neg">{error}</p>}
      {report && (
        <>
          <dl style={{ marginTop: "1rem" }}>
            <dt>{t("import.accounts")}</dt>
            <dd>{report.files.map((f) => `${f.accountLabel} (${f.accountId})`).join(", ")}</dd>
            <dt>{t("import.rows")}</dt>
            <dd>{report.rows}</dd>
            <dt>{t("import.merged")}</dt>
            <dd>{report.mirroredTransfersMerged}</dd>
            <dt>{t("import.flagged")}</dt>
            <dd>{report.flagged["unconverted-currency"] + report.flagged["rounded-amount"]}</dd>
          </dl>
          <p>
            <button className="primary" onClick={() => setSource(createCsvSource(files))}>
              {t("import.use")}
            </button>
          </p>
        </>
      )}
    </Card>
  );
}
