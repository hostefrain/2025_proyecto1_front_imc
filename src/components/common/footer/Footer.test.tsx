import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom"; // 👈 matchers extendidos
import Footer from "./Footer";

describe("Footer Component", () => {
  // 🧪 Unit tests
  it("debe renderizar el footer con role contentinfo", () => {
    render(<Footer />);
    const footer = screen.getByRole("contentinfo"); // <footer> => role="contentinfo"
    expect(footer).toBeInTheDocument();
  });

  it("debe tener las clases de estilo correctas", () => {
    render(<Footer />);
    const footer = screen.getByRole("contentinfo");
    expect(footer).toHaveClass("bg-gray-800");
    expect(footer).toHaveClass("text-white");
    expect(footer).toHaveClass("py-3");
    expect(footer).toHaveClass("text-center");
  });

  // 🔗 Integration test
  it("debe mostrar el texto de copyright completo", () => {
    render(<Footer />);
    expect(
      screen.getByText(
        "© 2025 Calculadora IMC - Programación Avanzada - Host Efrain, Mateo Tazzioli"
      )
    ).toBeInTheDocument();
  });

  it("debe renderizar el texto dentro de un <p> con clase text-sm", () => {
    render(<Footer />);
    const paragraph = screen.getByText(
      "© 2025 Calculadora IMC - Programación Avanzada - Host Efrain, Mateo Tazzioli"
    );
    expect(paragraph.tagName).toBe("P");
    expect(paragraph).toHaveClass("text-sm");
  });
});
