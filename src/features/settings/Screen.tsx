import { useServices } from "../../app/services";
import { LANGUAGES, useI18n, type Language } from "../../shared/i18n";
import { Card, Placeholder } from "../../shared/ui";

export function Screen() {
  const { t, lang, setLang } = useI18n();
  const { services, source } = useServices();
  return (
    <>
      <Card title={t("settings.language")}>
        <select value={lang} onChange={(e) => setLang(e.target.value as Language)}>
          {LANGUAGES.map((l) => (
            <option key={l} value={l}>{l.toUpperCase()}</option>
          ))}
        </select>
      </Card>
      <Card title={t("settings.adapters")}>
        <dl>
          <dt>TransactionSource</dt><dd>{source.id}</dd>
          <dt>Storage</dt><dd>{services.config.storage}</dd>
          <dt>LlmProvider</dt><dd>{services.llm.id}</dd>
          <dt>Notifier</dt><dd>{services.notifier.id}</dd>
        </dl>
      </Card>
      <Placeholder todo={["Payday", "AI on or off", "What data may leave the phone"]} />
    </>
  );
}
