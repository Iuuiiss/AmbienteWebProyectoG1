// Elementos del formulario de registro
const formRegistro = document.getElementById("formRegistro");
const inputNombre = document.getElementById("nombre");
const inputCorreo = document.getElementById("correo");
const inputTelefono = document.getElementById("telefono");
const inputContrasena = document.getElementById("contrasena");
const inputConfirmarContrasena = document.getElementById("confirmarContrasena");
const errorNombre = document.getElementById("errorNombre");
const errorCorreo = document.getElementById("errorCorreo");
const errorTelefono = document.getElementById("errorTelefono");
const errorContrasena = document.getElementById("errorContrasena");
const errorConfirmarContrasena = document.getElementById("errorConfirmarContrasena");
const alertaError = document.getElementById("alertaError");
const alertaExito = document.getElementById("alertaExito");

// Formato básico de correo: algo@algo.algo
const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Teléfono de Costa Rica: 8 dígitos, con o sin guion en medio (88888888 o 8888-8888)
const formatoTelefono = /^\d{4}-?\d{4}$/;

// Contraseña: al menos una letra y al menos un número
const tieneLetra = /[a-zA-Z]/;
const tieneNumero = /\d/;

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

// Valida la contraseña y devuelve el mensaje de error ("" si está bien)
function validarContrasena() {
    const contrasena = inputContrasena.value;
    if (contrasena === "") {
        return "La contraseña es obligatoria.";
    }
    if (contrasena.length < 8) {
        return "La contraseña debe tener al menos 8 caracteres.";
    }
    if (!tieneLetra.test(contrasena) || !tieneNumero.test(contrasena)) {
        return "La contraseña debe tener al menos una letra y un número.";
    }
    return "";
}

// Valida que la confirmación sea igual a la contraseña ("" si está bien)
function validarConfirmarContrasena() {
    const confirmar = inputConfirmarContrasena.value;
    if (confirmar === "") {
        return "Confirmá tu contraseña.";
    }
    if (confirmar !== inputContrasena.value) {
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
inputNombre.addEventListener("input", function() {
    if (errorNombre.textContent !== "") {
        mostrarErrorCampo(errorNombre, validarNombre());
    }
    ocultarAlertas();
});

inputCorreo.addEventListener("input", function() {
    if (errorCorreo.textContent !== "") {
        mostrarErrorCampo(errorCorreo, validarCorreo());
    }
    ocultarAlertas();
});

inputTelefono.addEventListener("input", function() {
    if (errorTelefono.textContent !== "") {
        mostrarErrorCampo(errorTelefono, validarTelefono());
    }
    ocultarAlertas();
});

inputContrasena.addEventListener("input", function() {
    if (errorContrasena.textContent !== "") {
        mostrarErrorCampo(errorContrasena, validarContrasena());
    }
    // La confirmación depende de la contraseña, así que también se revisa si tenía error
    if (errorConfirmarContrasena.textContent !== "") {
        mostrarErrorCampo(errorConfirmarContrasena, validarConfirmarContrasena());
    }
    ocultarAlertas();
});

inputConfirmarContrasena.addEventListener("input", function() {
    if (errorConfirmarContrasena.textContent !== "") {
        mostrarErrorCampo(errorConfirmarContrasena, validarConfirmarContrasena());
    }
    ocultarAlertas();
});

// Envío del formulario
formRegistro.addEventListener("submit", function(event) {

    // Evita que la página se recargue
    event.preventDefault();
    ocultarAlertas();

    const mensajeNombre = validarNombre();
    const mensajeCorreo = validarCorreo();
    const mensajeTelefono = validarTelefono();
    const mensajeContrasena = validarContrasena();
    const mensajeConfirmar = validarConfirmarContrasena();

    mostrarErrorCampo(errorNombre, mensajeNombre);
    mostrarErrorCampo(errorCorreo, mensajeCorreo);
    mostrarErrorCampo(errorTelefono, mensajeTelefono);
    mostrarErrorCampo(errorContrasena, mensajeContrasena);
    mostrarErrorCampo(errorConfirmarContrasena, mensajeConfirmar);

    if (mensajeNombre !== "" || mensajeCorreo !== "" || mensajeTelefono !== "" ||
        mensajeContrasena !== "" || mensajeConfirmar !== "") {
        mostrarAlerta(alertaError, "Revisa los campos marcados.");
        return;
    }

    // Se valida manual porque todavia no hay backend
    mostrarAlerta(alertaExito, "Cuenta creada con éxito");
    formRegistro.reset();
});
