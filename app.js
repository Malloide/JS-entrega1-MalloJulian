// Función para calcular el Metabolismo Basal
function calcularMetabolismoBasal(peso, altura, edad, genero) {
    if (genero === 'hombre') {
        return 88.36 + (13.4 * peso) + (4.8 * altura) - (5.7 * edad);
    } else {
        return 447.6 + (9.2 * peso) + (3.1 * altura) - (4.3 * edad);
    }
}

// Función para calcular las calorías según el nivel de actividad
function calcularCaloriasConActividad(metabolismoBasal, diasEjercicio) {
    let factorActividad;
    if (diasEjercicio <= 1) {
        factorActividad = 1.2; // Sedentario
    } else if (diasEjercicio <= 3) {
        factorActividad = 1.375; // Actividad ligera
    } else if (diasEjercicio <= 5) {
        factorActividad = 1.55; // Actividad moderada
    } else if (diasEjercicio <= 6) {
        factorActividad = 1.725; // Actividad intensa
    } else {
        factorActividad = 1.9; // Actividad muy intensa
    }
    return metabolismoBasal * factorActividad;
}

// Función para calcular las calorías para definición
function calcularCaloriasDefinicion(caloriasConActividad) {
    return caloriasConActividad * 0.8;
}

// Función para calcular las calorías para volumen
function calcularCaloriasVolumen(caloriasConActividad) {
    return caloriasConActividad * 1.2;
}

// Función para iniciar los cálculos
function iniciarCalculo() {
    // Recopilar datos del usuario
    let peso = parseFloat(prompt("Ingrese su peso en kilogramos:"));
    let altura = parseFloat(prompt("Ingrese su altura en centímetros:"));
    let edad = parseInt(prompt("Ingrese su edad:"));
    let genero = prompt("Ingrese su género (hombre/mujer):").toLowerCase();
    let diasEjercicio = parseInt(prompt("¿Cuántos días a la semana haces ejercicio?"));

    // Calcular metabolismo basal
    let metabolismoBasal = calcularMetabolismoBasal(peso, altura, edad, genero);

    // Calcular calorías con actividad
    let caloriasConActividad = calcularCaloriasConActividad(metabolismoBasal, diasEjercicio);

    // Calcular calorías para definición
    let caloriasDefinicion = calcularCaloriasDefinicion(caloriasConActividad);

    // Calcular calorías para volumen
    let caloriasVolumen = calcularCaloriasVolumen(caloriasConActividad);

    // Mostrar resultados
    let resultadosDiv = document.getElementById('resultados');
    resultadosDiv.innerHTML = `
        <h2>Resultados:</h2>
        <p><strong>Metabolismo Basal:</strong> ${metabolismoBasal.toFixed(2)} calorías</p>
        <p><strong>Calorías con Actividad:</strong> ${caloriasConActividad.toFixed(2)} calorías</p>
        <p><strong>Calorías para Definición:</strong> ${caloriasDefinicion.toFixed(2)} calorías</p>
        <p><strong>Calorías para Volumen:</strong> ${caloriasVolumen.toFixed(2)} calorías</p>
    `;
}

// Agregar evento al botón
document.getElementById('calcularBtn').addEventListener('click', iniciarCalculo);
