import { Fragment, useState } from "react";
import { explainMonth } from "../../agent/explain";
import { useServices, useTransactions } from "../../app/services";
import { buildReportFacts } from "../../engines/report";
import { useI18n } from "../../shared/i18n";
import { formatChf, formatMonth } from "../../shared/money";
import { Card } from "../../shared/ui";

export function Screen() {
  const { t, lang, locale } = useI18n();
  const { services } = useServices();
  const state = useTransactions();
  const [text, setText] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  if (state.status !== "ready") return <p className="muted">{t("app.loading")}</p>;

  const lastMonth = state.transactions.at(-1)?.date.slice(0, 7) ?? "";
  const facts = buildReportFacts(state.transactions, lastMonth);

  return (
    <>
      <Card title={`${t("report.facts")}: ${formatMonth(lastMonth, locale)}`}>
        <dl>
          <dt>{t("report.income")}</dt>
          <dd>{formatChf(facts.incomeRappen, locale)}</dd>
          <dt>{t("report.spending")}</dt>
          <dd>{formatChf(facts.spendingRappen, locale)}</dd>
          {facts.topCategories.map((c) => (
            <Fragment key={c.category}>
              <dt>{t(`category.${c.category}`)}</dt>
              <dd>{formatChf(c.spendingRappen, locale)}</dd>
            </Fragment>
          ))}
        </dl>
      </Card>
      <Card>
        <button
          className="primary"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            setText(await explainMonth(services.llm, facts, lang).catch((e: unknown) => String(e)));
            setBusy(false);
          }}
        >
          {t("report.write")}
        </button>
        {text && <p>{text}</p>}
        <p className="muted">LLM: {services.llm.id}</p>
      </Card>
    </>
  );
}
