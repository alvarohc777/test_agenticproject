import type { ReactNode } from "react";
import { useI18n } from "./i18n";

export function Card({ title, wide, children }: { title?: string; wide?: boolean; children: ReactNode }) {
  return (
    <section className={wide ? "card wide" : "card"}>
      {title && <h2>{title}</h2>}
      {children}
    </section>
  );
}

export function Placeholder({ todo }: { todo: string[] }) {
  const { t } = useI18n();
  return (
    <Card>
      <p className="muted">{t("app.placeholder")}</p>
      <ul className="todo">
        {todo.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </Card>
  );
}
