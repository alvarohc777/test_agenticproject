import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import merchantsFile from "../../content/merchants.json";
import type { Transaction, TransactionSource } from "../contracts";
import type { Services } from "../composition";
import { categorize } from "../engines/categorize";

type Ctx = {
  services: Services;
  source: TransactionSource;
  /** Used by the import screen to switch to the user's own CSV files. */
  setSource: (s: TransactionSource) => void;
};

const ServicesContext = createContext<Ctx | null>(null);

export function ServicesProvider({ services, children }: { services: Services; children: ReactNode }) {
  const [source, setSource] = useState<TransactionSource>(services.transactions);
  return <ServicesContext.Provider value={{ services, source, setSource }}>{children}</ServicesContext.Provider>;
}

export function useServices(): Ctx {
  const ctx = useContext(ServicesContext);
  if (!ctx) throw new Error("useServices must be used inside ServicesProvider");
  return ctx;
}

type State = { status: "loading" } | { status: "ready"; transactions: Transaction[] } | { status: "error"; error: string };

/** Loads and categorises the active source's transactions. */
export function useTransactions(): State {
  const { source } = useServices();
  const [state, setState] = useState<State>({ status: "loading" });
  useEffect(() => {
    let alive = true;
    setState({ status: "loading" });
    source
      .load()
      .then((txs) => alive && setState({ status: "ready", transactions: categorize(txs, merchantsFile.merchants) }))
      .catch((e: unknown) => alive && setState({ status: "error", error: String(e) }));
    return () => {
      alive = false;
    };
  }, [source]);
  return state;
}
