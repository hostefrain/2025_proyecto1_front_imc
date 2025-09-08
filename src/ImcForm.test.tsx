import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import axios from "axios";
import ImcForm from "./ImcForm";

// función 
function calcularIMC(peso: number, altura: number) {

  if (peso > 500) {
    return "El peso ingresado no puede superar los 500 kilogramos(kg).";
  }

  if (altura > 3) {
    return "La altura ingresada no puede superar los 3 metros(m).";
  }

  if (peso <= 0 || altura <= 0) {
    return "Por favor, ingresa valores válidos (positivos y numéricos).";
  }

  return peso / (altura * altura)
}

describe("Función calcularIMC", () => {
  it("debería calcular el IMC correctamente", () => {
    const resultado = calcularIMC(70, 1.75);
    expect(resultado).toBeCloseTo(22.86, 2);
  });

    it("debería mostara error cuando del peso supere 500kg", () => {
    const resultado = calcularIMC(501, 1.75);
    expect(resultado).toBe("El peso ingresado no puede superar los 500 kilogramos(kg).");
  });

  it("debería mostrar error cuando la altura supere 3m", () => {
    const resultado = calcularIMC(90, 3.01);
    expect(resultado).toBe("La altura ingresada no puede superar los 3 metros(m).")
  })

  it("debería mostrar erro cuando la altura o el peso se menor o igual a 0.", () => {
    const resultado = calcularIMC(0, 2);
    expect(resultado).toBe("Por favor, ingresa valores válidos (positivos y numéricos).")
  })

});

//Simulamos axios para no hacer llamadas reales
vi.mock("axios");
const mockedAxios = axios as unknown as {
  post: ReturnType<typeof vi.fn>;
};

describe("ImcForm", () => {
  it("calcula el IMC cuando se ingresan valores y se hace click en calcular", async () => {
    // simulamos la respuesta de la API
    mockedAxios.post.mockResolvedValueOnce({
      data: { imc: 22.86, categoria: "Normal" },
    });

    render(<ImcForm />);

    // Buscar todos los inputs numéricos y tomar por posición
    const inputs = screen.getAllByRole('spinbutton');
    const inputAltura = inputs[0]; // primer input (altura)
    const inputPeso = inputs[1];   // segundo input (peso)
    const boton = screen.getByRole("button", { name: /calcular/i });

    // simulamos entrada de datos
    fireEvent.change(inputAltura, { target: { value: "1.75" } });
    fireEvent.change(inputPeso, { target: { value: "70" } });

    // clic en calcular
    fireEvent.click(boton);

    // esperamos el resultado renderizado
    const resultado = await screen.findByText(/22.86/i);
    const categoria = await screen.findByText(/Normal/i);

    expect(resultado).toBeTruthy();
    expect(categoria).toBeTruthy();
  });
});