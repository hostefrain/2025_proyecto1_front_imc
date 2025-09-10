import axios from "axios";
import React, { useState } from "react";
import "./ImcForm.css"
import { FormValidator } from "./FormValidator";

const API_URL = import.meta.env.VITE_API_URL;

interface ImcResult {
  imc: number;
  categoria: string;
}

function ImcForm() {
  const [altura, setAltura] = useState("");
  const [peso, setPeso] = useState("");
  const [resultado, setResultado] = useState<ImcResult | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const alturaNum = parseFloat(altura);
    const pesoNum = parseFloat(peso);    

    const validationError = FormValidator(alturaNum, pesoNum)

    if (validationError) {
      setError(validationError);
      setResultado(null);
      return;
    };

    try {
      const response = await axios.post(`${API_URL}imc/calcular`, {
        altura: alturaNum,
        peso: pesoNum,
      });

      setResultado(response.data);
      setError("");
    } catch (err) {
      setError(
        "Error al calcular el IMC. Verifica si el backend está corriendo."
      );
      setResultado(null);
    }
  };

  return (
    <div className="mc-form-container">
      <div>
        <h1 className="imc-form-title">Calculadora de IMC</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label className="imc-form-subtitle">Altura (m):</label>
            <input className="input-group"
              type="number"
              value={altura}
              onChange={(e) => setAltura(e.target.value)}
            />
          </div>
          <div>
            <label className="imc-form-subtitle">Peso (kg):</label>
            <input className="input-group"
              type="number"
              value={peso}
              onChange={(e) => setPeso(e.target.value)}
            />
          </div>
          <button className="calculate-button" type="submit">Calcular</button>
        </form>

        {resultado && (
          <div className="result-container">
            <p className="result-title">IMC: {resultado.imc.toFixed(2)}</p>
            <p className="result-title">Categoría: {resultado.categoria}</p>
          </div>
        )}

        {error && (
          <div>
            <p>{error}</p>
          </div>
        )}
      </div>
      
    </div>
  );
}

export default ImcForm;