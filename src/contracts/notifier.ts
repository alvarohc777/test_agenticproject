/** Tells the user something happened: a suspicious payment, a bill due, a proposal waiting. */
export type Notice = {
  title: string;
  body: string;
  level: "info" | "warning";
};

export interface Notifier {
  readonly id: string;
  notify(notice: Notice): Promise<void>;
}
