// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { App } from "../../src/app/App";
import { compose, defaultConfig } from "../../src/composition";

afterEach(cleanup);

describe("transactions filters", () => {
  it("narrows the list by type, category and amount, and clears again", async () => {
    window.location.hash = "#/transactions";
    render(<App services={compose(defaultConfig)} />);
    expect(await screen.findByText("59 of 59")).toBeTruthy();

    fireEvent.change(screen.getByLabelText("Type"), { target: { value: "income" } });
    expect(screen.getByText("4 of 59")).toBeTruthy();

    fireEvent.change(screen.getByLabelText("Type"), { target: { value: "spending" } });
    fireEvent.click(screen.getByRole("button", { name: "Housing" }));
    expect(screen.getByText("3 of 59")).toBeTruthy();

    fireEvent.change(screen.getByLabelText("Max CHF"), { target: { value: "100" } });
    expect(screen.getByText("No transactions match these filters.")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(screen.getByText("59 of 59")).toBeTruthy();
  });

  it("shows a single day", async () => {
    window.location.hash = "#/transactions";
    render(<App services={compose(defaultConfig)} />);
    await screen.findByText("59 of 59");
    fireEvent.change(screen.getByLabelText("Date"), { target: { value: "day" } });
    fireEvent.change(screen.getByLabelText("Day"), { target: { value: "2025-02-14" } });
    const rows = screen.getAllByRole("row").slice(1);
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.every((r) => r.textContent?.startsWith("2025-02-14"))).toBe(true);
  });
});
