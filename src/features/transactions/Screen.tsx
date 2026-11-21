import { useState } from "react";
import { useTransactions } from "../../app/services";
import { filterTransactions, inOutTotals } from "../../engines/filter";
import { useI18n } from "../../shared/i18n";
import { formatChf } from "../../shared/money";
import { Card } from "../../shared/ui";
import { emptyForm, Filters, toFilter, type FilterForm } from "./Filters";

const PAGE = 100;

export function Screen() {
  const { t, locale } = useI18n();
  const state = useTransactions();
  const [form, setForm] = useState<FilterForm>(emptyForm);
  if (state.status !== "ready") return <p className="muted">{t("app.loading")}</p>;

  const all = state.transactions;
  const categories = [...new Set(all.map((tx) => tx.category ?? "other"))].sort();
  const shown = filterTransactions(all, toFilter(form)).reverse();
  const totals = inOutTotals(shown);
  // TODO(transactions): detail view, search, and "fix a category" (goes through the approval queue).

  return (
    <>
      <Card>
        <Filters form={form} onChange={setForm} categories={categories} />
      </Card>
      <Card title={`${shown.length} ${t("transactions.of")} ${all.length}`}>
        <p className="muted">
          {t("transactions.in")}: <span className="pos">{formatChf(totals.inRappen, locale)}</span> ·{" "}
          {t("transactions.out")}: {formatChf(totals.outRappen, locale)}
          {shown.length > PAGE && ` · ${t("transactions.first")} ${PAGE}`}
        </p>
        {shown.length === 0 ? (
          <p className="muted">{t("transactions.none")}</p>
        ) : (
          <div className="table-wrap">
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
              {shown.slice(0, PAGE).map((tx) => (
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
          </div>
        )}
      </Card>
    </>
  );
}
