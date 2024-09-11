document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("calculadoraForm");
    const resultadosDiv = document.getElementById("resultados");
    const historialUl = document.getElementById("historial");
    const borrarHistorialBtn = document.getElementById("borrarHistorialBtn");
    const themeBtn = document.querySelector(".theme-btn");
    let isDarkTheme = true;

    fetch("historial_calorias.json")
        .then(response => response.json())
        .then(data => {
            const historial = data.historialCalculos;
            const historialContainer = document.querySelector(".historial-container ul");
            
            historial.forEach(entry => {
                const li = document.createElement("li");
                li.textContent = `${entry.nombre}: ${entry.caloriasConActividad} kcals`;
                historialContainer.appendChild(li);
            });
        })
        .catch(error => {
            console.error("Error al cargar el archivo JSON:", error);
        });
        
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
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¡No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, bórralo!'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem("historialCalculos");
                historialUl.innerHTML = "";
                Swal.fire(
                    '¡Eliminado!',
                    'Tu historial ha sido borrado.',
                    'success'
                );
            }
        });
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
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'El número de días de ejercicio debe estar entre 0 y 7.'
            });
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

        // Crear un gráfico con D3.js
        crearGrafico([metabolismoBasal, caloriasConActividad, caloriasDefinicion, caloriasVolumen]);
    });

    // Crear gráfico con D3.js
    function crearGrafico(data) {
        const svg = d3.select("#grafico").append("svg")
            .attr("width", 500)
            .attr("height", 300);

        const xScale = d3.scaleBand()
            .domain(["Metabolismo Basal", "Calorías con Actividad", "Definición", "Volumen"])
            .range([0, 500])
            .padding(0.4);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data)])
            .range([300, 0]);

        svg.selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", (d, i) => xScale(xScale.domain()[i]))
            .attr("y", d => yScale(d))
            .attr("width", xScale.bandwidth())
            .attr("height", d => 300 - yScale(d))
            .attr("fill", "#69b3a2");

        svg.append("g")
            .attr("transform", "translate(0,300)")
            .call(d3.axisBottom(xScale));

        svg.append("g")
            .call(d3.axisLeft(yScale));
    }

    // Cambiar el tema
    themeBtn.addEventListener("click", () => {
        isDarkTheme = !isDarkTheme;
        document.body.classList.toggle("dark-theme", isDarkTheme);
        themeBtn.textContent = isDarkTheme ? "🌜" : "🌞";
    });

    // Cargar el historial al inicio
    cargarHistorial();
});
