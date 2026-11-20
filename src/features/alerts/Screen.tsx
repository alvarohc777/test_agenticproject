import { useTransactions } from "../../app/services";
import { findAlerts } from "../../engines/alerts";
import { useI18n } from "../../shared/i18n";
import { formatChf } from "../../shared/money";
import { Card, Placeholder } from "../../shared/ui";

export function Screen() {
  const { t, locale } = useI18n();
  const state = useTransactions();
  if (state.status !== "ready") return <p className="muted">{t("app.loading")}</p>;
  const alerts = findAlerts(state.transactions);
  return (
    <>
      {alerts.length === 0 && <p className="muted">{t("alerts.none")}</p>}
      {alerts.map((a) => (
        <Card key={a.id} title={t("alerts.repeat")}>
          <p>
            {a.facts.date} · {a.facts.counterparty} · {a.facts.count} × {formatChf(Number(a.facts.amountRappen), locale)}
          </p>
        </Card>
      ))}
      <Placeholder todo={["Approve or escalate to a bank adviser", "More rules: unusual amount, new merchant abroad"]} />
    </>
  );
}
