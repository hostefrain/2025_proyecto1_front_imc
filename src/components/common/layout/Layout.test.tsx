// src/components/layout/Layout.test.tsx
import { render, screen } from "@testing-library/react";
import Layout from "./Layout";
import { vi } from "vitest";   // 👈 Importar vi
import '@testing-library/jest-dom';

// Mockeamos Header y Footer para aislar Layout
vi.mock("../header/Header", () => ({
  default: () => <div data-testid="mock-header">Mock Header</div>,
}));

vi.mock("../footer/Footer", () => ({
  default: () => <div data-testid="mock-footer">Mock Footer</div>,
}));

describe("Layout Component", () => {
  // 🧪 Unit tests
  it("debe renderizar el contenedor principal con la clase correcta", () => {
    render(<Layout>contenido</Layout>);
    const layoutDiv = screen.getByRole("main").closest("div.app-layout");
    expect(layoutDiv).toBeInTheDocument();
  });

  it("debe renderizar los elementos decorativos de fondo", () => {
    render(<Layout>contenido</Layout>);

    expect(document.querySelector(".layout-background")).toBeInTheDocument();
    expect(document.querySelector(".layout-orb-1")).toBeInTheDocument();
    expect(document.querySelector(".layout-orb-2")).toBeInTheDocument();
    expect(document.querySelector(".layout-orb-3")).toBeInTheDocument();
    expect(document.querySelector(".layout-dots")).toBeInTheDocument();
  });

  it("debe envolver el contenido en .layout-content y .layout-main", () => {
    render(<Layout>contenido de prueba</Layout>);
    const main = screen.getByRole("main");
    expect(main).toBeInTheDocument();
    expect(main).toHaveClass("layout-main");
    expect(main).toHaveTextContent("contenido de prueba");
  });

  // 🔗 Integration tests
  it("debe integrar el Header y Footer correctamente", () => {
    render(<Layout>contenido</Layout>);
    expect(screen.getByTestId("mock-header")).toBeInTheDocument();
    expect(screen.getByTestId("mock-footer")).toBeInTheDocument();
  });

  it("debe renderizar los children dentro del main", () => {
    render(
      <Layout>
        <p data-testid="child">Child content</p>
      </Layout>
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.getByRole("main")).toContainElement(screen.getByTestId("child"));
  });
});
