import React, { useState } from 'react';
import './ImcData.css';
import { getImcHistorial } from './imcService';

interface ImcData {
  id: number;
  altura: number;
  peso: number;
  imcValor: number;
  categoria: string;
  fechaHora: string;
}

const ImcDataComponent: React.FC = () => {
  const [datos, setDatos] = useState<ImcData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [mostrarTabla, setMostrarTabla] = useState<boolean>(false);

  const obtenerTodosLosDatos = async () => {
    setLoading(true);
    setError('');
    
    try {
      const data = await getImcHistorial();

      setDatos(data);
      setMostrarTabla(true);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error al obtener datos:', err);
    } finally {
      setLoading(false);
    }
  };

  const ocultarTabla = () => {
    setMostrarTabla(false);
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const obtenerClaseCategoria = (categoria: string) => {
    switch (categoria.toLowerCase()) {
      case 'bajo peso':
        return 'categoria-bajo-peso';
      case 'peso normal':
      case 'normal':
        return 'categoria-normal';
      case 'sobrepeso':
        return 'categoria-sobrepeso';
      case 'obesidad':
      case 'obesidad grado i':
      case 'obesidad grado ii':
      case 'obesidad grado iii':
        return 'categoria-obesidad';
      default:
        return '';
    }
  };

  return (
    <div className="imc-data-container">
      <div className="botones-container">
        <button 
          className="btn-obtener-datos"
          onClick={obtenerTodosLosDatos} 
          disabled={loading}
        >
          {loading ? 'Cargando...' : 'Mostrar Historial de IMC'}
        </button>
        
        {mostrarTabla && (
          <button 
            className="btn-ocultar"
            onClick={ocultarTabla}
          >
            Ocultar Tabla
          </button>
        )}
      </div>

      {error && (
        <div className="error-message">
          <p>❌ Error al cargar los datos: {error}</p>
        </div>
      )}

      {mostrarTabla && !loading && datos.length === 0 && (
        <div className="no-data-message">
          <p>📊 No hay datos guardados en la base de datos</p>
        </div>
      )}

      {mostrarTabla && datos.length > 0 && (
        <div className="tabla-container">
          <h3 className="tabla-titulo">
            📋 Historial de Cálculos IMC ({datos.length} registros)
          </h3>
          
          <div className="tabla-wrapper">
            <table className="imc-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Altura (m)</th>
                  <th>Peso (kg)</th>
                  <th>IMC</th>
                  <th>Categoría</th>
                  <th>Fecha y Hora</th>
                </tr>
              </thead>
              <tbody>
                {datos.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.altura}</td>
                    <td>{item.peso}</td>
                    <td className="imc-valor">{item.imcValor}</td>
                    <td className={`categoria ${obtenerClaseCategoria(item.categoria)}`}>
                      {item.categoria}
                    </td>
                    <td className="fecha">{formatearFecha(item.fechaHora)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImcDataComponent;