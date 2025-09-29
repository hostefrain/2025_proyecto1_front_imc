// src/main.test.tsx
import "@testing-library/jest-dom";
import { screen } from "@testing-library/react";
import { vi, describe, test, expect } from "vitest";

// Mock de App
vi.mock("./App", () => ({
  default: () => <div data-testid="mock-app">App Mock</div>,
}));

describe("main.tsx", () => {
  test("monta el componente App en root", async () => {
    const root = document.createElement("div");
    root.id = "root";
    document.body.appendChild(root);

    await import("./main"); // ejecuta main.tsx

    // Espera a que se renderice el mock
    expect(await screen.findByTestId("mock-app")).toBeInTheDocument();
  });
});
