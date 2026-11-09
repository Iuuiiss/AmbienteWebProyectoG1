// Elementos del formulario de inicio de sesión
const formLogin = document.getElementById("formLogin");
const inputCorreo = document.getElementById("correo");
const inputContrasena = document.getElementById("contrasena");
const errorCorreo = document.getElementById("errorCorreo");
const errorContrasena = document.getElementById("errorContrasena");
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

// Valida la contraseña y devuelve el mensaje de error ("" si está bien)
function validarContrasena() {
    const contrasena = inputContrasena.value;
    if (contrasena === "") {
        return "La contraseña es obligatoria.";
    }
    if (contrasena.length < 8) {
        return "La contraseña debe tener al menos 8 caracteres.";
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

inputContrasena.addEventListener("input", function() {
    if (errorContrasena.textContent !== "") {
        mostrarErrorCampo(errorContrasena, validarContrasena());
    }
    ocultarAlertas();
});

// Envío del formulario
formLogin.addEventListener("submit", function(event) {

    // Evita que la página se recargue
    event.preventDefault();
    ocultarAlertas();

    const mensajeCorreo = validarCorreo();
    const mensajeContrasena = validarContrasena();

    mostrarErrorCampo(errorCorreo, mensajeCorreo);
    mostrarErrorCampo(errorContrasena, mensajeContrasena);

    if (mensajeCorreo !== "" || mensajeContrasena !== "") {
        mostrarAlerta(alertaError, "Revisa los campos marcados.");
        return;
    }

    // Se valida manual porque todavia no hay backend
    mostrarAlerta(alertaExito, "Inicio de sesión exitoso");
    formLogin.reset();
});
