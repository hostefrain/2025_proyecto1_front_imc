import React, { useState } from "react";
import "./ImcForm.css"
import { FormValidator } from "./FormValidator";
import { calculateImc } from "../../services/imcService";

interface ImcResult {
  id: number;
  altura: number;
  peso: number;
  imcValor: number;
  categoria: string;
  fechaHora: Date;
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
      const data = await calculateImc(alturaNum, pesoNum);

      console.log('Respuesta del backend:', data);

      // Adaptamos la respuesta al tipo ImcResult
      setResultado({
        id: data.id ?? 0,
        altura: alturaNum,
        peso: pesoNum,
        imcValor: data.imc ?? data.imcValor,
        categoria: data.categoria,
        fechaHora: data.fechaHora ?? new Date(),
      });
      setError("");
    } catch (err: any) {

      console.error('Error completo:', err);

      setError(
        err.message || "Error inesperado al calcular el IMC."
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
            <p className="result-title">IMC: {resultado?.imcValor !== undefined ? resultado.imcValor.toFixed(2) : "--"}</p>
            <p className="result-title">Categoría: {resultado.categoria}</p>
            <p className="result-title">
              Fecha: {new Date(resultado.fechaHora).toLocaleDateString('es-AR')}
            </p>    
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