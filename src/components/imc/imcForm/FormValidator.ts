export function FormValidator(altura: number, peso: number) : string | null {

    if (isNaN(altura) || isNaN(peso)) {
        return "Alguno campo se encuentra vacío. Por favor ingrese todos los datos solicitados."
    }

    if (altura <= 0 || altura > 3) {
        return "La altura debe ser un valor positivo entre 0 y 3 metros. Por favor, ingrese valores válidos.";
    }

    if (peso <= 0 || peso > 500) {
        return "El peso debe ser un valor positivo entre 0 y 500 kilogramos. Por favor, ingrese valores válidos."
    }

    return null
}