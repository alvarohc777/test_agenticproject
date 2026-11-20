import { useTransactions } from "../../app/services";
import { useI18n } from "../../shared/i18n";
import { formatChf } from "../../shared/money";
import { Card } from "../../shared/ui";

export function Screen() {
  const { t, locale } = useI18n();
  const state = useTransactions();
  if (state.status !== "ready") return <p className="muted">{t("app.loading")}</p>;
  const latest = [...state.transactions].reverse().slice(0, 50);
  // TODO(transactions): detail view, search, and "fix a category" (goes through the approval queue).
  return (
    <Card title={`${t("transactions.latest")} ${state.transactions.length}`}>
      <table>
        <thead>
          <tr>
            <th>{t("transactions.date")}</th>
            <th>{t("transactions.who")}</th>
            <th>{t("transactions.category")}</th>
            <th className="num">{t("transactions.amount")}</th>
          </tr>
        </thead>
        <tbody>
          {latest.map((tx) => (
            <tr key={tx.id}>
              <td>{tx.date}</td>
              <td>
                {tx.counterparty}
                {tx.flags?.map((f) => <span key={f} className="flag">{f}</span>)}
              </td>
              <td>{t(`category.${tx.category ?? "other"}`)}</td>
              <td className={`num ${tx.amountRappen < 0 ? "" : "pos"}`}>{formatChf(tx.amountRappen, locale)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
