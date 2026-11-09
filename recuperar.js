// Elementos del formulario de recuperar contraseña
const formRecuperar = document.getElementById("formRecuperar");
const inputCorreo = document.getElementById("correo");
const errorCorreo = document.getElementById("errorCorreo");
const alertaError = document.getElementById("alertaError");
const alertaExito = document.getElementById("alertaExito");

// Formato básico de correo: algo@algo.algo
const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

// Al escribir, si el campo ya tenía error, se vuelve a validar para limpiarlo al corregirlo
inputCorreo.addEventListener("input", function() {
    if (errorCorreo.textContent !== "") {
        mostrarErrorCampo(errorCorreo, validarCorreo());
    }
    ocultarAlertas();
});

// Envío del formulario
formRecuperar.addEventListener("submit", function(event) {

    // Evita que la página se recargue
    event.preventDefault();
    ocultarAlertas();

    const mensajeCorreo = validarCorreo();

    mostrarErrorCampo(errorCorreo, mensajeCorreo);

    if (mensajeCorreo !== "") {
        mostrarAlerta(alertaError, "Revisa los campos marcados.");
        return;
    }

    // Se valida manual porque todavia no hay backend.
    // El mensaje no confirma si el correo existe, para no revelar qué cuentas están registradas.
    mostrarAlerta(alertaExito, "Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.");
    formRecuperar.reset();
});
