function calcularMetabolismoBasal(peso, altura, edad, genero) {
    if (genero === 'hombre') {
        return 88.36 + (13.4 * peso) + (4.8 * altura) - (5.7 * edad);
    } else {
        return 447.6 + (9.2 * peso) + (3.1 * altura) - (4.3 * edad);
    }
}

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

function calcularCaloriasDefinicion(caloriasConActividad) {
    return caloriasConActividad * 0.8;
}

function calcularCaloriasVolumen(caloriasConActividad) {
    return caloriasConActividad * 1.2;
}

function recopilarDatos() {
    let peso = parseFloat(prompt("Ingrese su peso en kilogramos:"));
    let altura = parseFloat(prompt("Ingrese su altura en centímetros:"));
    let edad = parseInt(prompt("Ingrese su edad:"));
    let genero = prompt("Ingrese su género (hombre/mujer):").toLowerCase();
    let diasEjercicio = parseInt(prompt("¿Cuántos días a la semana haces ejercicio?"));
    
    let datosUsuario = { peso, altura, edad, genero, diasEjercicio };
    
    localStorage.setItem('datosUsuario', JSON.stringify(datosUsuario));
    
    return datosUsuario;
}

function iniciarCalculo() {
    let datosUsuario = JSON.parse(localStorage.getItem('datosUsuario')) || recopilarDatos();
    let { peso, altura, edad, genero, diasEjercicio } = datosUsuario;
    
    let metabolismoBasal = calcularMetabolismoBasal(peso, altura, edad, genero);
    let caloriasConActividad = calcularCaloriasConActividad(metabolismoBasal, diasEjercicio);
    let caloriasDefinicion = calcularCaloriasDefinicion(caloriasConActividad);
    let caloriasVolumen = calcularCaloriasVolumen(caloriasConActividad);
    
    let resultados = [
        `Metabolismo Basal: ${metabolismoBasal.toFixed(2)} calorías`,
        `Calorías con Actividad: ${caloriasConActividad.toFixed(2)} calorías`,
        `Calorías para Definición: ${caloriasDefinicion.toFixed(2)} calorías`,
        `Calorías para Volumen: ${caloriasVolumen.toFixed(2)} calorías`
    ];
    
    let resultadosDiv = document.getElementById('resultados');
    resultadosDiv.innerHTML = `<h2>Resultados:</h2>`;
    resultados.forEach(resultado => {
        let p = document.createElement('p');
        p.textContent = resultado;
        resultadosDiv.appendChild(p);
    });
}

document.getElementById('calcularBtn').addEventListener('click', iniciarCalculo);
