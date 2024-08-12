document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("calculadoraForm");
    const resultadosDiv = document.getElementById("resultados");
    const historialUl = document.getElementById("historial");
    const borrarHistorialBtn = document.getElementById("borrarHistorialBtn");
    const themeBtn = document.querySelector(".theme-btn");
    let isDarkTheme = true;

    // Funciones de cálculo
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
            factorActividad = 1.2;
        } else if (diasEjercicio <= 3) {
            factorActividad = 1.375;
        } else if (diasEjercicio <= 5) {
            factorActividad = 1.55;
        } else if (diasEjercicio <= 6) {
            factorActividad = 1.725;
        } else {
            factorActividad = 1.9;
        }
        return metabolismoBasal * factorActividad;
    }

    function calcularCaloriasDefinicion(caloriasConActividad) {
        return caloriasConActividad * 0.8;
    }

    function calcularCaloriasVolumen(caloriasConActividad) {
        return caloriasConActividad * 1.2;
    }

    // Cargar el historial desde el localStorage
    function cargarHistorial() {
        const historial = JSON.parse(localStorage.getItem("historialCalculos")) || [];
        historialUl.innerHTML = "";
        historial.forEach(entry => {
            const li = document.createElement("li");
            li.textContent = entry;
            historialUl.appendChild(li);
        });
    }

    // Guardar en el historial
    function guardarEnHistorial(resultado) {
        const historial = JSON.parse(localStorage.getItem("historialCalculos")) || [];
        historial.push(resultado);
        localStorage.setItem("historialCalculos", JSON.stringify(historial));
        cargarHistorial();
    }

    // Limpiar el historial
    borrarHistorialBtn.addEventListener("click", () => {
        localStorage.removeItem("historialCalculos");
        historialUl.innerHTML = "";
    });

    // Validar y calcular calorías
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const nombre = form.nombre.value; 
        const peso = parseFloat(form.peso.value);
        const altura = parseFloat(form.altura.value);
        const edad = parseInt(form.edad.value);
        const genero = form.genero.value;
        const diasEjercicio = parseInt(form.diasEjercicio.value);

        if (diasEjercicio < 0 || diasEjercicio > 7) {
            alert("El número de días de ejercicio debe estar entre 0 y 7.");
            return;
        }

        const metabolismoBasal = calcularMetabolismoBasal(peso, altura, edad, genero);
        const caloriasConActividad = calcularCaloriasConActividad(metabolismoBasal, diasEjercicio);
        const caloriasDefinicion = calcularCaloriasDefinicion(caloriasConActividad);
        const caloriasVolumen = calcularCaloriasVolumen(caloriasConActividad);

        const resultados = [
            `Nombre: ${nombre}`,
            `Metabolismo Basal: ${metabolismoBasal.toFixed(2)} calorías`,
            `Calorías con Actividad: ${caloriasConActividad.toFixed(2)} calorías`,
            `Calorías para Definición: ${caloriasDefinicion.toFixed(2)} calorías`,
            `Calorías para Volumen: ${caloriasVolumen.toFixed(2)} calorías`
        ];

        resultadosDiv.innerHTML = "<h2>Resultados:</h2>";
        resultados.forEach(resultado => {
            const p = document.createElement("p");
            p.textContent = resultado;
            resultadosDiv.appendChild(p);
        });

        guardarEnHistorial(resultados.join(" | "));
    });

    // Cambiar entre tema oscuro y claro
    themeBtn.addEventListener("click", () => {
        isDarkTheme = !isDarkTheme;
        document.body.classList.toggle("light-theme", !isDarkTheme);
        document.body.classList.toggle("dark-theme", isDarkTheme);
        themeBtn.textContent = isDarkTheme ? "🌞" : "🌜";
    });

    cargarHistorial();
});
