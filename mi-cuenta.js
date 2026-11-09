// Elementos del formulario de cambiar contraseña
const formCambiarContrasena = document.getElementById("formCambiarContrasena");
const inputContrasenaActual = document.getElementById("contrasenaActual");
const inputNuevaContrasena = document.getElementById("nuevaContrasena");
const inputConfirmarNuevaContrasena = document.getElementById("confirmarNuevaContrasena");
const errorContrasenaActual = document.getElementById("errorContrasenaActual");
const errorNuevaContrasena = document.getElementById("errorNuevaContrasena");
const errorConfirmarNuevaContrasena = document.getElementById("errorConfirmarNuevaContrasena");
const alertaError = document.getElementById("alertaError");
const alertaExito = document.getElementById("alertaExito");

// Contraseña: al menos una letra y al menos un número (misma regla que el registro)
const tieneLetra = /[a-zA-Z]/;
const tieneNumero = /\d/;

// Valida la contraseña actual y devuelve el mensaje de error ("" si está bien)
// Sin backend solo se revisa que no esté vacía; luego el servidor verificará que sea la correcta
function validarContrasenaActual() {
    if (inputContrasenaActual.value === "") {
        return "La contraseña actual es obligatoria.";
    }
    return "";
}

// Valida la nueva contraseña y devuelve el mensaje de error ("" si está bien)
function validarNuevaContrasena() {
    const nueva = inputNuevaContrasena.value;
    if (nueva === "") {
        return "La nueva contraseña es obligatoria.";
    }
    if (nueva.length < 8) {
        return "La contraseña debe tener al menos 8 caracteres.";
    }
    if (!tieneLetra.test(nueva) || !tieneNumero.test(nueva)) {
        return "La contraseña debe tener al menos una letra y un número.";
    }
    if (nueva === inputContrasenaActual.value) {
        return "La nueva contraseña debe ser distinta de la actual.";
    }
    return "";
}

// Valida que la confirmación sea igual a la nueva contraseña ("" si está bien)
function validarConfirmarNuevaContrasena() {
    const confirmar = inputConfirmarNuevaContrasena.value;
    if (confirmar === "") {
        return "Confirmá tu nueva contraseña.";
    }
    if (confirmar !== inputNuevaContrasena.value) {
        return "Las contraseñas no coinciden.";
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
inputContrasenaActual.addEventListener("input", function() {
    if (errorContrasenaActual.textContent !== "") {
        mostrarErrorCampo(errorContrasenaActual, validarContrasenaActual());
    }
    // La nueva contraseña se compara con la actual, así que también se revisa si tenía error
    if (errorNuevaContrasena.textContent !== "") {
        mostrarErrorCampo(errorNuevaContrasena, validarNuevaContrasena());
    }
    ocultarAlertas();
});

inputNuevaContrasena.addEventListener("input", function() {
    if (errorNuevaContrasena.textContent !== "") {
        mostrarErrorCampo(errorNuevaContrasena, validarNuevaContrasena());
    }
    // La confirmación depende de la nueva contraseña, así que también se revisa si tenía error
    if (errorConfirmarNuevaContrasena.textContent !== "") {
        mostrarErrorCampo(errorConfirmarNuevaContrasena, validarConfirmarNuevaContrasena());
    }
    ocultarAlertas();
});

inputConfirmarNuevaContrasena.addEventListener("input", function() {
    if (errorConfirmarNuevaContrasena.textContent !== "") {
        mostrarErrorCampo(errorConfirmarNuevaContrasena, validarConfirmarNuevaContrasena());
    }
    ocultarAlertas();
});

// Envío del formulario
formCambiarContrasena.addEventListener("submit", function(event) {

    // Evita que la página se recargue
    event.preventDefault();
    ocultarAlertas();

    const mensajeActual = validarContrasenaActual();
    const mensajeNueva = validarNuevaContrasena();
    const mensajeConfirmar = validarConfirmarNuevaContrasena();

    mostrarErrorCampo(errorContrasenaActual, mensajeActual);
    mostrarErrorCampo(errorNuevaContrasena, mensajeNueva);
    mostrarErrorCampo(errorConfirmarNuevaContrasena, mensajeConfirmar);

    if (mensajeActual !== "" || mensajeNueva !== "" || mensajeConfirmar !== "") {
        mostrarAlerta(alertaError, "Revisa los campos marcados.");
        return;
    }

    // Se valida manual porque todavia no hay backend
    mostrarAlerta(alertaExito, "Contraseña actualizada con éxito");
    formCambiarContrasena.reset();
});
