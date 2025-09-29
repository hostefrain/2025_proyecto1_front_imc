import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import { describe, expect, vi } from "vitest";
import App from "./App";

// Mock de subcomponentes con Vitest
vi.mock("./components/common/layout/Layout", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-layout">{children}</div>
  ),
}));

vi.mock("./components/imc/imcForm/ImcForm", () => ({
  default: () => <div data-testid="mock-form">Mock Form</div>,
}));

vi.mock("./components/imc/imcData/ImcData", () => ({
  default: () => <div data-testid="mock-data">Mock Data</div>,
}));

describe("App component - unitarios", () => {
  test("renderiza el Layout", () => {
    render(<App />);
    expect(screen.getByTestId("mock-layout")).toBeInTheDocument();
  });

  test("renderiza el ImcForm", () => {
    render(<App />);
    expect(screen.getByTestId("mock-form")).toBeInTheDocument();
  });

  test("renderiza el ImcDataComponent", () => {
    render(<App />);
    expect(screen.getByTestId("mock-data")).toBeInTheDocument();
  });
});

describe("App component - integración", () => {
  test("muestra el formulario y los datos dentro del Layout", () => {
    render(<App />);
    const layout = screen.getByTestId("mock-layout");
    const form = screen.getByTestId("mock-form");
    const data = screen.getByTestId("mock-data");

    expect(layout).toContainElement(form);
    expect(layout).toContainElement(data);
  });
});
