import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import axios from "axios";
import ImcForm from "./ImcForm";
import { FormValidator } from "./FormValidator";

//Test de FromValidator.
describe("FormValidator", () => {
  it("retorna error si el peso es mayor a 500", () => {
    const error = FormValidator(1.75 , 501);
    expect(error).toBe("El peso debe ser un valor positivo entre 0 y 500 kilogramos. Por favor, ingrese valores válidos.");
  });

  it("retorna error si la altura es mayor a 3", () => {
    const error = FormValidator(3.1, 90);
    expect(error).toBe("La altura debe ser un valor positivo entre 0 y 3 metros. Por favor, ingrese valores válidos.");
  });

  it("retorna error si altura <= 0", () => {
    const error = FormValidator(0, 2);
    expect(error).toBe("La altura debe ser un valor positivo entre 0 y 3 metros. Por favor, ingrese valores válidos.");
  });

    it("retorna error si peso <= 0", () => {
    const error = FormValidator(2, 0);
    expect(error).toBe("El peso debe ser un valor positivo entre 0 y 500 kilogramos. Por favor, ingrese valores válidos.");
  });

  it("retorna null si los datos son correctos", () => {
    const error = FormValidator(1.75, 85);
    expect(error).toBeNull();
  });

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
    const resultado = await screen.findByText((content) =>
  content.includes("22.86"));

    const categoria = await screen.findByText(/Normal/i);

    expect(resultado).toBeTruthy();
    expect(categoria).toBeTruthy();
  });
});