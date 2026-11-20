// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { App } from "../../src/app/App";
import { features } from "../../src/app/registry";
import { compose, defaultConfig } from "../../src/composition";

afterEach(cleanup);

describe("app shell", () => {
  it("builds the menu from the feature registry", () => {
    render(<App services={compose(defaultConfig)} />);
    fireEvent.click(screen.getByRole("button", { name: "Menu" }));
    const links = screen.getAllByRole("link");
    expect(links.map((l) => l.textContent)).toEqual([
      "Dashboard",
      "Monthly report",
      "Transactions",
      "Alerts",
      "Savings",
      "Investment ideas",
      "Import CSV",
      "Settings",
    ]);
    expect(links).toHaveLength(features.length);
  });

  it("opens on the dashboard with numbers from the demo data", async () => {
    window.location.hash = "";
    render(<App services={compose(defaultConfig)} />);
    expect(await screen.findByText("Income and spending")).toBeTruthy();
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Dashboard");
  });
});
