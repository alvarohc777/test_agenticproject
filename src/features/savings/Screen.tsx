import { useTransactions } from "../../app/services";
import { savingsRate } from "../../engines/savings";
import { useI18n } from "../../shared/i18n";
import { Card, Placeholder } from "../../shared/ui";

export function Screen() {
  const { t } = useI18n();
  const state = useTransactions();
  if (state.status !== "ready") return <p className="muted">{t("app.loading")}</p>;
  const rate = savingsRate(state.transactions);
  return (
    <>
      <Card title={t("savings.rate")}>
        <p style={{ fontSize: "2rem", margin: 0 }}>{rate === null ? "–" : `${Math.round(rate * 100)} %`}</p>
      </Card>
      <Placeholder todo={["Cut suggestions per category", "Cheaper alternatives from content/alternatives.json", "Savings goal"]} />
    </>
  );
}
