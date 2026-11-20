import type { Storage } from "../contracts";

/** Something the agent wants to change. Nothing happens until the user approves it. */
export type Proposal = {
  id: string;
  kind: "dashboard-layout" | "category-fix" | "savings-goal";
  /** One sentence the user reads before deciding. */
  summary: string;
  payload: unknown;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
};

const KEY = "agent/proposals";

export function createApprovalQueue(storage: Storage) {
  const all = async () => (await storage.get<Proposal[]>(KEY)) ?? [];
  const save = (items: Proposal[]) => storage.set(KEY, items);

  return {
    all,
    async pending() {
      return (await all()).filter((p) => p.status === "pending");
    },
    async propose(p: Omit<Proposal, "id" | "status" | "createdAt">): Promise<Proposal> {
      const proposal: Proposal = {
        ...p,
        id: `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      await save([...(await all()), proposal]);
      return proposal;
    },
    async decide(id: string, decision: "approved" | "rejected") {
      await save((await all()).map((p) => (p.id === id ? { ...p, status: decision } : p)));
    },
  };
}
