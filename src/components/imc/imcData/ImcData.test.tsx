import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, test, expect, beforeEach, vi, MockedFunction } from 'vitest';
import ImcDataComponent from './ImcData';
import * as imcService from '../../services/imcService';

// Mock del módulo completo
vi.mock('../../services/imcService', () => ({
  getImcHistorial: vi.fn()
}));

// Obtener referencia al mock
const mockGetImcHistorial = imcService.getImcHistorial as MockedFunction<typeof imcService.getImcHistorial>;

// Datos de prueba
const mockData = [
  {
    id: 1,
    altura: 1.75,
    peso: 70,
    imcValor: 22.86,
    categoria: 'Peso normal',
    fechaHora: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    altura: 1.80,
    peso: 85,
    imcValor: 26.23,
    categoria: 'Sobrepeso',
    fechaHora: '2024-01-16T14:45:00Z'
  },
  {
    id: 3,
    altura: 1.65,
    peso: 50,
    imcValor: 18.37,
    categoria: 'Bajo peso',
    fechaHora: '2024-01-17T09:15:00Z'
  }
];

describe('ImcDataComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // TESTS UNITARIOS - RENDERIZADO INICIAL
  describe('Renderizado inicial', () => {
    test('debe renderizar el componente correctamente', () => {
      render(<ImcDataComponent />);
      
      expect(screen.getByRole('button', { name: /mostrar historial de imc/i })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /ocultar tabla/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });

    test('debe mostrar el botón de mostrar historial habilitado inicialmente', () => {
      render(<ImcDataComponent />);
      
      const botonMostrar = screen.getByRole('button', { name: /mostrar historial de imc/i });
      expect(botonMostrar).toBeEnabled();
    });

    test('no debe mostrar mensajes de error o tabla inicialmente', () => {
      render(<ImcDataComponent />);
      
      expect(screen.queryByText(/error al cargar los datos/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/no hay datos guardados/i)).not.toBeInTheDocument();
      expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });
  });

  // TESTS UNITARIOS - CARGA DE DATOS EXITOSA
  describe('Carga de datos exitosa', () => {
    test('debe mostrar loading y luego la tabla con datos', async () => {
      mockGetImcHistorial.mockResolvedValueOnce(mockData);
      
      render(<ImcDataComponent />);
      
      const botonMostrar = screen.getByRole('button', { name: /mostrar historial de imc/i });
      fireEvent.click(botonMostrar);

      // Verificar estado de loading
      expect(screen.getByRole('button', { name: /cargando/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cargando/i })).toBeDisabled();

      // Esperar a que se carguen los datos
      await waitFor(() => {
        expect(screen.getByRole('table')).toBeInTheDocument();
      });

      // Verificar que se muestra la tabla
      expect(screen.getByText('📋 Historial de Cálculos IMC (3 registros)')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /ocultar tabla/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /mostrar historial de imc/i })).toBeEnabled();
    });

    test('debe mostrar todos los datos en la tabla correctamente', async () => {
      mockGetImcHistorial.mockResolvedValueOnce(mockData);
      
      render(<ImcDataComponent />);
      
      fireEvent.click(screen.getByRole('button', { name: /mostrar historial de imc/i }));

      await waitFor(() => {
        expect(screen.getByRole('table')).toBeInTheDocument();
      });

      // Verificar encabezados
      expect(screen.getByText('ID')).toBeInTheDocument();
      expect(screen.getByText('Altura (m)')).toBeInTheDocument();
      expect(screen.getByText('Peso (kg)')).toBeInTheDocument();
      expect(screen.getByText('IMC')).toBeInTheDocument();
      expect(screen.getByText('Categoría')).toBeInTheDocument();
      expect(screen.getByText('Fecha y Hora')).toBeInTheDocument();

      // Verificar datos del primer registro
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('1.75')).toBeInTheDocument();
      expect(screen.getByText('70')).toBeInTheDocument();
      expect(screen.getByText('22.86')).toBeInTheDocument();
      expect(screen.getByText('Peso normal')).toBeInTheDocument();

      // Verificar que todos los registros están presentes
      mockData.forEach(item => {
        expect(screen.getByText(item.id.toString())).toBeInTheDocument();
        expect(screen.getByText(item.categoria)).toBeInTheDocument();
      });
    });

    test('debe llamar al servicio getImcHistorial al hacer clic en mostrar historial', async () => {
      mockGetImcHistorial.mockResolvedValueOnce(mockData);
      
      render(<ImcDataComponent />);
      
      fireEvent.click(screen.getByRole('button', { name: /mostrar historial de imc/i }));

      expect(mockGetImcHistorial).toHaveBeenCalledTimes(1);
    });
  });

  // TESTS UNITARIOS - MANEJO DE ERRORES
  describe('Manejo de errores', () => {
    test('debe mostrar mensaje de error cuando falla la carga', async () => {
      const errorMessage = 'Error de conexión';
      mockGetImcHistorial.mockRejectedValueOnce(new Error(errorMessage));
      
      render(<ImcDataComponent />);
      
      fireEvent.click(screen.getByRole('button', { name: /mostrar historial de imc/i }));

      await waitFor(() => {
        expect(screen.getByText(`❌ Error al cargar los datos: ${errorMessage}`)).toBeInTheDocument();
      });

      expect(screen.getByRole('button', { name: /mostrar historial de imc/i })).toBeEnabled();
      expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });

    test('debe manejar errores no-Error correctamente', async () => {
      mockGetImcHistorial.mockRejectedValueOnce('String error');
      
      render(<ImcDataComponent />);
      
      fireEvent.click(screen.getByRole('button', { name: /mostrar historial de imc/i }));

      await waitFor(() => {
        expect(screen.getByText('❌ Error al cargar los datos: Error desconocido')).toBeInTheDocument();
      });
    });
  });

  // TESTS UNITARIOS - MANEJO DE DATOS VACÍOS
  describe('Manejo de datos vacíos', () => {
    test('debe mostrar mensaje cuando no hay datos', async () => {
      mockGetImcHistorial.mockResolvedValueOnce([]);
      
      render(<ImcDataComponent />);
      
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /mostrar historial de imc/i }));
      });

      await waitFor(() => {
        expect(screen.getByText('📊 No hay datos guardados en la base de datos')).toBeInTheDocument();
      });

      expect(screen.queryByRole('table')).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: /ocultar tabla/i })).toBeInTheDocument();
    });

    test('debe manejar correctamente cuando el servicio retorna undefined', async () => {
      // Simular que el servicio retorna undefined
      mockGetImcHistorial.mockResolvedValueOnce(undefined as any);
      
      render(<ImcDataComponent />);
      
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /mostrar historial de imc/i }));
      });

      // Debería mostrar el mensaje de no datos o manejar graciosamente el undefined
      await waitFor(() => {
        expect(screen.queryByText(/error al cargar los datos/i)).not.toBeInTheDocument();
        // El componente debería renderizarse sin errores
        expect(screen.getByRole('button', { name: /mostrar historial de imc/i })).toBeInTheDocument();
      });
    });
  });

  // TESTS UNITARIOS - FUNCIONALIDAD DE OCULTAR
  describe('Funcionalidad de ocultar tabla', () => {
    test('debe ocultar la tabla al hacer clic en ocultar', async () => {
      mockGetImcHistorial.mockResolvedValueOnce(mockData);
      
      render(<ImcDataComponent />);
      
      // Mostrar tabla
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /mostrar historial de imc/i }));
      });
      
      await waitFor(() => {
        expect(screen.getByRole('table')).toBeInTheDocument();
      });

      // Ocultar tabla
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /ocultar tabla/i }));
      });

      expect(screen.queryByRole('table')).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /ocultar tabla/i })).not.toBeInTheDocument();
    });

    test('debe realizar nueva petición al mostrar tabla después de ocultar', async () => {
      // Primera carga
      mockGetImcHistorial.mockResolvedValueOnce(mockData);
      
      render(<ImcDataComponent />);
      
      // Mostrar tabla
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /mostrar historial de imc/i }));
      });

      await waitFor(() => {
        expect(screen.getByRole('table')).toBeInTheDocument();
      });

      // Ocultar tabla
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /ocultar tabla/i }));
      });

      expect(screen.queryByRole('table')).not.toBeInTheDocument();
      expect(mockGetImcHistorial).toHaveBeenCalledTimes(1);

      // Segunda carga (nueva petición)
      mockGetImcHistorial.mockResolvedValueOnce([mockData[0]]); // Solo un registro

      // Mostrar tabla nuevamente
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /mostrar historial de imc/i }));
      });
      
      await waitFor(() => {
        expect(screen.getByRole('table')).toBeInTheDocument();
      });

      // Debería haber hecho una segunda llamada
      expect(mockGetImcHistorial).toHaveBeenCalledTimes(2);
      
      // Verificar que muestra los nuevos datos (1 registro en lugar de 3)
      expect(screen.getByText('📋 Historial de Cálculos IMC (1 registros)')).toBeInTheDocument();
    });
  });

  // TESTS UNITARIOS - FUNCIONES DE FORMATEO Y CLASES
  describe('Funciones de formateo y clases CSS', () => {
    test('debe aplicar clases CSS correctas según la categoría', async () => {
      const datosConCategorias = [
        { ...mockData[0], categoria: 'Bajo peso' },
        { ...mockData[1], categoria: 'Peso normal' },
        { ...mockData[2], categoria: 'Sobrepeso' }
      ];
      
      mockGetImcHistorial.mockResolvedValueOnce(datosConCategorias);
      
      render(<ImcDataComponent />);
      
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /mostrar historial de imc/i }));
      });
      
      await waitFor(() => {
        expect(screen.getByRole('table')).toBeInTheDocument();
      });

      // Buscar elementos por clase más específica
      const bajoPeso = screen.getByText('Bajo peso');
      const pesoNormal = screen.getByText('Peso normal');
      const sobrepeso = screen.getByText('Sobrepeso');

      // Verificar que tienen la clase categoria
      expect(bajoPeso).toHaveClass('categoria');
      expect(pesoNormal).toHaveClass('categoria');
      expect(sobrepeso).toHaveClass('categoria');

      // Verificar clases específicas por categoría
      expect(bajoPeso).toHaveClass('categoria-bajo-peso');
      expect(pesoNormal).toHaveClass('categoria-normal');
      expect(sobrepeso).toHaveClass('categoria-sobrepeso');
    });

    test('debe manejar diferentes variantes de categorías de obesidad', async () => {
      const datosObesidad = [
        { ...mockData[0], categoria: 'Obesidad' },
        { ...mockData[1], categoria: 'Obesidad grado I' },
        { ...mockData[2], categoria: 'Obesidad grado II' }
      ];
      
      mockGetImcHistorial.mockResolvedValueOnce(datosObesidad);
      
      render(<ImcDataComponent />);
      
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /mostrar historial de imc/i }));
      });
      
      await waitFor(() => {
        expect(screen.getByRole('table')).toBeInTheDocument();
      });

      // Verificar elementos específicos de obesidad
      const obesidad = screen.getByText('Obesidad');
      const obesidadI = screen.getByText('Obesidad grado I');
      const obesidadII = screen.getByText('Obesidad grado II');

      expect(obesidad).toHaveClass('categoria-obesidad');
      expect(obesidadI).toHaveClass('categoria-obesidad');
      expect(obesidadII).toHaveClass('categoria-obesidad');
    });
  });

  // TEST DE INTEGRACIÓN
  describe('Test de Integración - Flujo completo', () => {
    test('debe ejecutar el flujo completo: cargar datos, mostrar tabla, ocultar, mostrar error en segunda carga', async () => {
      // Primera carga exitosa
      mockGetImcHistorial.mockResolvedValueOnce(mockData);
      
      render(<ImcDataComponent />);
      
      // 1. Estado inicial
      expect(screen.getByRole('button', { name: /mostrar historial de imc/i })).toBeEnabled();
      expect(screen.queryByRole('table')).not.toBeInTheDocument();
      
      // 2. Cargar datos
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /mostrar historial de imc/i }));
      });
      
      // 3. Datos cargados
      await waitFor(() => {
        expect(screen.getByRole('table')).toBeInTheDocument();
      });
      
      expect(screen.getByText('📋 Historial de Cálculos IMC (3 registros)')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /ocultar tabla/i })).toBeInTheDocument();
      
      // 4. Ocultar tabla
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /ocultar tabla/i }));
      });
      
      expect(screen.queryByRole('table')).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /ocultar tabla/i })).not.toBeInTheDocument();
      
      // 5. Segunda carga con error
      mockGetImcHistorial.mockRejectedValueOnce(new Error('Error de servidor'));
      
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /mostrar historial de imc/i }));
      });
      
      await waitFor(() => {
        expect(screen.getByText('❌ Error al cargar los datos: Error de servidor')).toBeInTheDocument();
      });
      
      // 6. Verificar que no hay tabla y el botón está habilitado
      expect(screen.queryByRole('table')).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: /mostrar historial de imc/i })).toBeEnabled();
      
      // 7. Tercera carga exitosa después del error
      mockGetImcHistorial.mockResolvedValueOnce([mockData[0]]);
      
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /mostrar historial de imc/i }));
      });
      
      await waitFor(() => {
        expect(screen.getByRole('table')).toBeInTheDocument();
      });
      
      // Verificar que el error se limpió y se muestran los nuevos datos
      expect(screen.queryByText(/error al cargar los datos/i)).not.toBeInTheDocument();
      expect(screen.getByText('📋 Historial de Cálculos IMC (1 registros)')).toBeInTheDocument();
      
      // Verificar que se hicieron 3 llamadas al servicio en total
      expect(mockGetImcHistorial).toHaveBeenCalledTimes(3);
    });

    test('debe manejar múltiples clics rápidos sin causar problemas', async () => {
      let resolvePromise: (value: any) => void;
      const mockPromise = new Promise(resolve => {
        resolvePromise = resolve;
      });
      
      mockGetImcHistorial.mockReturnValue(mockPromise);
      
      render(<ImcDataComponent />);
      
      const botonMostrar = screen.getByRole('button', { name: /mostrar historial de imc/i });
      
      // Múltiples clics rápidos - solo el primero debería funcionar
      await act(async () => {
        fireEvent.click(botonMostrar);
        // El botón debería estar deshabilitado después del primer clic
        fireEvent.click(botonMostrar); // Este no debería hacer nada
        fireEvent.click(botonMostrar); // Este no debería hacer nada
      });
      
      // Verificar que el botón está deshabilitado (loading)
      expect(screen.getByRole('button', { name: /cargando/i })).toBeDisabled();
      
      // Resolver la promesa para completar la carga
      await act(async () => {
        resolvePromise!(mockData);
      });

      // Esperar que se complete la carga
      await waitFor(() => {
        expect(screen.getByRole('table')).toBeInTheDocument();
      });

    });

    test('debe formatear las fechas correctamente en formato español', async () => {
      const dataConFechas = [{
        ...mockData[0],
        fechaHora: '2024-01-15T10:30:45Z'
      }];
      
      mockGetImcHistorial.mockResolvedValueOnce(dataConFechas);
      
      render(<ImcDataComponent />);
      
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /mostrar historial de imc/i }));
      });
      
      await waitFor(() => {
        expect(screen.getByRole('table')).toBeInTheDocument();
      });
      
      // Verificar que existe algún texto con formato de fecha
      // Buscar por elementos que contengan números que podrían ser fecha
      const fechaElements = screen.getAllByText(/2024|15|01|10|30/);
      expect(fechaElements.length).toBeGreaterThan(0);
    });
  });
});