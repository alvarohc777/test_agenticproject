import { useMemo, useState } from "react";
import { HashRouter, Navigate, NavLink, Route, Routes } from "react-router-dom";
import type { Services } from "../composition";
import { I18nProvider, useI18n } from "../shared/i18n";
import { CatIcon } from "../shared/icons";
import { namespaced } from "./feature";
import { features } from "./registry";
import { ServicesProvider } from "./services";
import "./app.css";

export function App({ services }: { services: Services }) {
  const messages = useMemo(() => namespaced(features), []);
  return (
    <ServicesProvider services={services}>
      <I18nProvider extra={messages}>
        <HashRouter>
          <Shell />
        </HashRouter>
      </I18nProvider>
    </ServicesProvider>
  );
}

function Shell() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  return (
    <div className="shell">
      <header className="topbar">
        <button
          className="icon-button"
          aria-label={open ? t("app.closeMenu") : t("app.menu")}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="burger" />
        </button>
        <span className="brand">
          <CatIcon size={28} />
          {t("app.title")}
        </span>
      </header>

      <nav className={`drawer ${open ? "open" : ""}`} aria-label={t("app.menu")}>
        {features.map((f) => (
          <NavLink key={f.id} to={`/${f.id}`} onClick={() => setOpen(false)}>
            {t(`${f.id}.title`)}
          </NavLink>
        ))}
      </nav>
      {open && <div className="scrim" onClick={() => setOpen(false)} />}

      <main className="content">
        <Routes>
          {features.map((f) => (
            <Route
              key={f.id}
              path={`/${f.id}`}
              element={
                <>
                  <h1>{t(`${f.id}.title`)}</h1>
                  <f.Screen />
                </>
              }
            />
          ))}
          <Route path="*" element={<Navigate to={`/${features[0]!.id}`} replace />} />
        </Routes>
      </main>
    </div>
  );
}
