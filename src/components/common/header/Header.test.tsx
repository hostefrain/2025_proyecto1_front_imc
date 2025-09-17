import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom"; // 👈 para usar toBeInTheDocument y demás
import Header from "./Header";

describe("Header Component", () => {
  // 🧪 Unit tests
  it("debe renderizar el header con la clase app-header", () => {
    render(<Header />);
    const header = screen.getByRole("banner"); // <header> por defecto tiene role="banner"
    expect(header).toBeInTheDocument();
    expect(header).toHaveClass("app-header");
  });

  it("debe renderizar el efecto de brillo", () => {
    render(<Header />);
    expect(document.querySelector(".header-shine")).toBeInTheDocument();
  });

  it("debe renderizar el icono SVG decorativo", () => {
    render(<Header />);
    const svgIcon = document.querySelector(".header-icon svg");
    expect(svgIcon).toBeInTheDocument();
    expect(svgIcon?.tagName).toBe("svg");
  });

  it("debe mostrar el título y subtítulo correctos", () => {
    render(<Header />);
    expect(screen.getByText("Calculadora IMC")).toBeInTheDocument();
    expect(screen.getByText("Entrega 1")).toBeInTheDocument();
  });

  // 🔗 Integration test
  it("debe mostrar los indicadores decorativos (3 dots)", () => {
    render(<Header />);
    const dots = document.querySelectorAll(".header-dot");
    expect(dots).toHaveLength(3);
    expect(document.querySelector(".header-dot-1")).toBeInTheDocument();
    expect(document.querySelector(".header-dot-2")).toBeInTheDocument();
    expect(document.querySelector(".header-dot-3")).toBeInTheDocument();
  });
});
