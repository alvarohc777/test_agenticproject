import type { ReactNode } from "react";
import type { Transaction } from "../../contracts";
import { useTransactions } from "../../app/services";
import { monthlyTotals, spendingByCategory } from "../../engines/insights";
import { useI18n } from "../../shared/i18n";
import { formatChf, formatMonth } from "../../shared/money";
import { Card } from "../../shared/ui";
import { defaultLayout, type WidgetType } from "./layout";

export function Screen() {
  const { t } = useI18n();
  const state = useTransactions();
  if (state.status === "loading") return <p className="muted">{t("app.loading")}</p>;
  if (state.status === "error") return <p className="neg">{state.error}</p>;
  // TODO(dashboard): read the layout from Storage so approved agent proposals persist.
  const layout = defaultLayout;
  return (
    <div className="grid">
      {layout.widgets.map((w, i) => (
        <Widget key={`${w.type}-${i}`} type={w.type} transactions={state.transactions} />
      ))}
    </div>
  );
}

function Widget({ type, transactions }: { type: WidgetType; transactions: Transaction[] }): ReactNode {
  const { t, locale } = useI18n();
  switch (type) {
    case "monthly-totals":
      return (
        <Card title={t("dashboard.months")} wide>
          <table>
            <thead>
              <tr><th /><th className="num">{t("dashboard.income")}</th><th className="num">{t("dashboard.spending")}</th></tr>
            </thead>
            <tbody>
              {monthlyTotals(transactions).slice(-6).map((m) => (
                <tr key={m.month}>
                  <td>{formatMonth(m.month, locale)}</td>
                  <td className="num pos">{formatChf(m.incomeRappen, locale)}</td>
                  <td className="num">{formatChf(m.spendingRappen, locale)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      );
    case "top-categories": {
      const top = Object.entries(spendingByCategory(transactions)).sort((a, b) => b[1] - a[1]).slice(0, 5);
      return (
        <Card title={t("dashboard.top")}>
          <table>
            <tbody>
              {top.map(([cat, r]) => (
                <tr key={cat}><td>{t(`category.${cat}`)}</td><td className="num">{formatChf(r, locale)}</td></tr>
              ))}
            </tbody>
          </table>
        </Card>
      );
    }
    case "data-quality": {
      const flagged = transactions.filter((tx) => tx.flags?.length).length;
      return (
        <Card title={t("dashboard.quality")}>
          <p>{transactions.length} {t("dashboard.rows")}</p>
          <p className={flagged ? "neg" : "muted"}>{t("dashboard.flagged")}: {flagged}</p>
        </Card>
      );
    }
  }
}
