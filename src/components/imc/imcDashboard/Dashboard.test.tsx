import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Dashboard from "./Dashboard";
import "@testing-library/jest-dom";

describe("Dashboard", () => {
  it("renderiza el iframe del dashboard de Metabase", () => {
    render(<Dashboard />);

    // Buscar el iframe por el título
    const iframe = screen.getByTitle("Metabase Dashboard");

    // Asegurarnos de que exista en el documento
    expect(iframe).toBeTruthy();

    // Validar que el iframe tenga el src correcto
    expect(iframe).toHaveAttribute(
      "src",
      "http://localhost:3000/public/dashboard/0f88564d-351f-4eba-876e-0a5a4e3d3c3f"
    );

    // Validar tamaño
    expect(iframe).toHaveAttribute("width", "100%");
    expect(iframe).toHaveAttribute("height", "100%");
  });
});

