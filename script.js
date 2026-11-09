// Elementos del formulario de reserva
const formulario = document.getElementById("formCita");

if (formulario) {
    const inputNombre = document.getElementById("nombre");
    const inputCorreo = document.getElementById("correo");
    const inputTelefono = document.getElementById("telefono");
    const selectServicio = document.getElementById("servicio");
    const inputFecha = document.getElementById("fecha");
    const selectHora = document.getElementById("hora");
    const errorNombre = document.getElementById("errorNombre");
    const errorCorreo = document.getElementById("errorCorreo");
    const errorTelefono = document.getElementById("errorTelefono");
    const errorServicio = document.getElementById("errorServicio");
    const errorFecha = document.getElementById("errorFecha");
    const errorHora = document.getElementById("errorHora");
    const alertaError = document.getElementById("alertaError");
    const alertaExito = document.getElementById("alertaExito");

    // Formato básico de correo: algo@algo.algo
    const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Teléfono de Costa Rica: 8 dígitos, con o sin guion en medio (88888888 o 8888-8888)
    const formatoTelefono = /^\d{4}-?\d{4}$/;

    // Convierte el texto "AAAA-MM-DD" del input date en una fecha local (a las 00:00)
    // No se usa new Date("AAAA-MM-DD") porque eso la toma en hora UTC y en Costa Rica
    // quedaría en el día anterior
    function convertirFecha(texto) {
        const partes = texto.split("-");
        const anio = Number(partes[0]);
        const mes = Number(partes[1]) - 1;   // en JavaScript los meses van de 0 a 11
        const dia = Number(partes[2]);
        return new Date(anio, mes, dia);
    }

    // Fecha de hoy a las 00:00, para comparar solo el día y no la hora
    function obtenerHoy() {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        return hoy;
    }

    // Da formato a una fecha: 2026-11-15 -> "15/11/2026"
    function formatearFecha(texto) {
        const partes = texto.split("-");
        return partes[2] + "/" + partes[1] + "/" + partes[0];
    }

    // Valida el nombre y devuelve el mensaje de error ("" si está bien)
    function validarNombre() {
        const nombre = inputNombre.value.trim();
        if (nombre === "") {
            return "El nombre es obligatorio.";
        }
        if (nombre.length < 3) {
            return "El nombre debe tener al menos 3 caracteres.";
        }
        return "";
    }

    // Valida el correo y devuelve el mensaje de error ("" si está bien)
    function validarCorreo() {
        const correo = inputCorreo.value.trim();
        if (correo === "") {
            return "El correo es obligatorio.";
        }
        if (!formatoCorreo.test(correo)) {
            return "Ingresá un correo válido, por ejemplo correo@ejemplo.com.";
        }
        return "";
    }

    // Valida el teléfono y devuelve el mensaje de error ("" si está bien)
    function validarTelefono() {
        const telefono = inputTelefono.value.trim();
        if (telefono === "") {
            return "El teléfono es obligatorio.";
        }
        if (!formatoTelefono.test(telefono)) {
            return "Ingresá un teléfono de 8 dígitos, por ejemplo 8888-8888.";
        }
        return "";
    }

    // Valida que se haya elegido un servicio
    function validarServicio() {
        if (selectServicio.value === "") {
            return "Seleccioná un servicio.";
        }
        return "";
    }

    // Valida la fecha: obligatoria, no anterior a hoy y no domingo
    function validarFecha() {
        if (inputFecha.value === "") {
            return "La fecha es obligatoria.";
        }

        const fecha = convertirFecha(inputFecha.value);

        if (fecha < obtenerHoy()) {
            return "La fecha no puede ser anterior a hoy.";
        }
        // getDay() devuelve 0 para domingo, 1 para lunes ... 6 para sábado
        if (fecha.getDay() === 0) {
            return "Los domingos estamos cerrados. Elegí otro día.";
        }
        return "";
    }

    // Valida que se haya elegido una hora y que respete el horario del sábado
    function validarHora() {
        if (selectHora.value === "") {
            return "Seleccioná una hora.";
        }

        // Los sábados se cierra a las 4:00 PM, así que la última cita es a las 3:00 PM.
        // Las horas tienen formato "HH:MM" con dos dígitos, así que se pueden comparar como texto
        if (inputFecha.value !== "" && convertirFecha(inputFecha.value).getDay() === 6 && selectHora.value > "15:00") {
            return "Los sábados cerramos a las 4:00 PM. Elegí una hora hasta las 03:00 PM.";
        }
        return "";
    }

    // Muestra (o limpia) el mensaje de error de un campo
    function mostrarErrorCampo(elementoError, mensaje) {
        elementoError.textContent = mensaje;
    }

    // Muestra una alerta con un mensaje
    function mostrarAlerta(alerta, mensaje) {
        alerta.textContent = mensaje;
        alerta.classList.add("mostrar");
    }

    // Oculta ambas alertas
    function ocultarAlertas() {
        alertaError.classList.remove("mostrar");
        alertaExito.classList.remove("mostrar");
    }

    // Al cambiar un campo, si ya tenía error, se vuelve a validar para limpiarlo al corregirlo.
    // Los select y el input date avisan con "change"; los de texto con "input".
    function revalidarAlCambiar(campo, evento, elementoError, validar) {
        campo.addEventListener(evento, function() {
            if (elementoError.textContent !== "") {
                mostrarErrorCampo(elementoError, validar());
            }
            ocultarAlertas();
        });
    }

    revalidarAlCambiar(inputNombre, "input", errorNombre, validarNombre);
    revalidarAlCambiar(inputCorreo, "input", errorCorreo, validarCorreo);
    revalidarAlCambiar(inputTelefono, "input", errorTelefono, validarTelefono);
    revalidarAlCambiar(selectServicio, "change", errorServicio, validarServicio);
    revalidarAlCambiar(inputFecha, "change", errorFecha, validarFecha);
    revalidarAlCambiar(selectHora, "change", errorHora, validarHora);

    // La validez de la hora depende de la fecha (regla del sábado),
    // así que al cambiar la fecha también se revisa la hora si tenía error
    inputFecha.addEventListener("change", function() {
        if (errorHora.textContent !== "") {
            mostrarErrorCampo(errorHora, validarHora());
        }
    });

    // Envío del formulario
    formulario.addEventListener("submit", function(event) {

        // Evita que la página se recargue
        event.preventDefault();
        ocultarAlertas();

        const mensajeNombre = validarNombre();
        const mensajeCorreo = validarCorreo();
        const mensajeTelefono = validarTelefono();
        const mensajeServicio = validarServicio();
        const mensajeFecha = validarFecha();
        const mensajeHora = validarHora();

        mostrarErrorCampo(errorNombre, mensajeNombre);
        mostrarErrorCampo(errorCorreo, mensajeCorreo);
        mostrarErrorCampo(errorTelefono, mensajeTelefono);
        mostrarErrorCampo(errorServicio, mensajeServicio);
        mostrarErrorCampo(errorFecha, mensajeFecha);
        mostrarErrorCampo(errorHora, mensajeHora);

        if (mensajeNombre !== "" || mensajeCorreo !== "" || mensajeTelefono !== "" ||
            mensajeServicio !== "" || mensajeFecha !== "" || mensajeHora !== "") {
            mostrarAlerta(alertaError, "Revisa los campos marcados.");
            return;
        }

        // Resumen con el texto visible de la hora (ej: "02:00 PM" en vez de "14:00")
        const servicio = selectServicio.value;
        const fecha = formatearFecha(inputFecha.value);
        const hora = selectHora.options[selectHora.selectedIndex].text;

        // Se valida manual porque todavia no hay backend
        mostrarAlerta(alertaExito, `Cita reservada: ${servicio} el ${fecha} a las ${hora}.`);
        formulario.reset();
    });
}
