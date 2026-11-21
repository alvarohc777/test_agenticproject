import type { TransactionFilter } from "../../engines/filter";
import { useI18n } from "../../shared/i18n";

export type DateMode = "any" | "day" | "range";

/** Form state; converted to a TransactionFilter by toFilter(). Amounts are typed in CHF. */
export type FilterForm = {
  dateMode: DateMode;
  day: string;
  from: string;
  to: string;
  categories: string[];
  direction: "all" | "spending" | "income";
  minChf: string;
  maxChf: string;
};

export const emptyForm: FilterForm = {
  dateMode: "any",
  day: "",
  from: "",
  to: "",
  categories: [],
  direction: "all",
  minChf: "",
  maxChf: "",
};

const toRappen = (chf: string) => {
  const n = Number(chf.replace(",", "."));
  return chf.trim() === "" || Number.isNaN(n) ? undefined : Math.round(n * 100);
};

export function toFilter(f: FilterForm): TransactionFilter {
  const dates =
    f.dateMode === "day" && f.day
      ? { from: f.day, to: f.day }
      : f.dateMode === "range"
        ? { from: f.from || undefined, to: f.to || undefined }
        : {};
  return {
    ...dates,
    categories: f.categories,
    direction: f.direction,
    minRappen: toRappen(f.minChf),
    maxRappen: toRappen(f.maxChf),
  };
}

export function Filters({
  form,
  onChange,
  categories,
}: {
  form: FilterForm;
  onChange: (f: FilterForm) => void;
  categories: string[];
}) {
  const { t } = useI18n();
  const set = (patch: Partial<FilterForm>) => onChange({ ...form, ...patch });
  const toggle = (c: string) =>
    set({ categories: form.categories.includes(c) ? form.categories.filter((x) => x !== c) : [...form.categories, c] });

  return (
    <div className="filters">
      <label>
        {t("transactions.date")}
        <select value={form.dateMode} onChange={(e) => set({ dateMode: e.target.value as DateMode })}>
          <option value="any">{t("transactions.anyDate")}</option>
          <option value="day">{t("transactions.oneDay")}</option>
          <option value="range">{t("transactions.range")}</option>
        </select>
      </label>
      {form.dateMode === "day" && (
        <label>
          {t("transactions.day")}
          <input type="date" value={form.day} onChange={(e) => set({ day: e.target.value })} />
        </label>
      )}
      {form.dateMode === "range" && (
        <>
          <label>
            {t("transactions.from")}
            <input type="date" value={form.from} onChange={(e) => set({ from: e.target.value })} />
          </label>
          <label>
            {t("transactions.to")}
            <input type="date" value={form.to} onChange={(e) => set({ to: e.target.value })} />
          </label>
        </>
      )}

      <label>
        {t("transactions.direction")}
        <select value={form.direction} onChange={(e) => set({ direction: e.target.value as FilterForm["direction"] })}>
          <option value="all">{t("transactions.all")}</option>
          <option value="spending">{t("transactions.spending")}</option>
          <option value="income">{t("transactions.income")}</option>
        </select>
      </label>
      <label>
        {t("transactions.minChf")}
        <input inputMode="decimal" placeholder="0" value={form.minChf} onChange={(e) => set({ minChf: e.target.value })} />
      </label>
      <label>
        {t("transactions.maxChf")}
        <input inputMode="decimal" placeholder="∞" value={form.maxChf} onChange={(e) => set({ maxChf: e.target.value })} />
      </label>

      <fieldset className="chips">
        <legend>{t("transactions.category")}</legend>
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            className={form.categories.includes(c) ? "chip on" : "chip"}
            aria-pressed={form.categories.includes(c)}
            onClick={() => toggle(c)}
          >
            {t(`category.${c}`)}
          </button>
        ))}
      </fieldset>

      <button type="button" className="link" onClick={() => onChange(emptyForm)}>
        {t("transactions.reset")}
      </button>
    </div>
  );
}
