import axios from "axios";

export const calculateImc = async (altura: number, peso: number) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}imc/calcular`, {
            altura,
            peso,
        });
        return response.data;
    } catch (error) {
        console.error("Error al calcular el IMC:", error);
        throw new Error("Error al calcular el IMC, verifica si el backend está corriendo.");
    };
};

export const getImcHistorial = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}imc/historial`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener el historial de IMC:", error);
        throw new Error("Error al obtener el historial de IMC, verifica si el backend está corriendo.");
    }
};