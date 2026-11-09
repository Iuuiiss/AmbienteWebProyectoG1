// ==========================================================
// Datos de ejemplo (todavia no hay backend; luego vendran de la base de datos)
// ==========================================================

const servicios = [
    { id: 1, nombre: "Corte de Cabello", duracion: 30, precio: 5000 },
    { id: 2, nombre: "Arreglo de Barba", duracion: 20, precio: 3500 },
    { id: 3, nombre: "Combo Completo",   duracion: 50, precio: 7500 },
    { id: 4, nombre: "Limpieza Facial",  duracion: 40, precio: 6000 }
];

const horarios = [
    { dia: "Lunes",     apertura: "09:00 AM", cierre: "06:00 PM", abierto: true },
    { dia: "Martes",    apertura: "09:00 AM", cierre: "06:00 PM", abierto: true },
    { dia: "Miercoles", apertura: "09:00 AM", cierre: "06:00 PM", abierto: true },
    { dia: "Jueves",    apertura: "09:00 AM", cierre: "06:00 PM", abierto: true },
    { dia: "Viernes",   apertura: "09:00 AM", cierre: "06:00 PM", abierto: true },
    { dia: "Sabado",    apertura: "09:00 AM", cierre: "04:00 PM", abierto: true },
    { dia: "Domingo",   apertura: "-",        cierre: "-",        abierto: false }
];

const citas = [
    { id: 1, cliente: "María Fernández", servicio: "Corte de Cabello", fecha: "15/11/2026", hora: "09:00 AM", estado: "Confirmada" },
    { id: 2, cliente: "José Vargas",     servicio: "Combo Completo",   fecha: "15/11/2026", hora: "10:00 AM", estado: "Confirmada" },
    { id: 3, cliente: "Ana Solís",       servicio: "Limpieza Facial",  fecha: "16/11/2026", hora: "02:00 PM", estado: "Confirmada" },
    { id: 4, cliente: "Carlos Mora",     servicio: "Arreglo de Barba", fecha: "05/11/2026", hora: "11:00 AM", estado: "Atendida" },
    { id: 5, cliente: "Laura Jiménez",   servicio: "Corte de Cabello", fecha: "03/11/2026", hora: "04:00 PM", estado: "Cancelada" }
];

const usuarios = [
    { id: 1, nombre: "María Fernández", correo: "maria.fernandez@ejemplo.com", telefono: "8888-8888", activo: true },
    { id: 2, nombre: "José Vargas",     correo: "jose.vargas@ejemplo.com",     telefono: "8765-4321", activo: true },
    { id: 3, nombre: "Ana Solís",       correo: "ana.solis@ejemplo.com",       telefono: "7012-3456", activo: true },
    { id: 4, nombre: "Carlos Mora",     correo: "carlos.mora@ejemplo.com",     telefono: "6123-4567", activo: false }
];

// ==========================================================
// Funciones generales
// ==========================================================

const alertaError = document.getElementById("alertaError");
const alertaExito = document.getElementById("alertaExito");

// Clase de color del badge según el estado de la cita
const clasesEstado = {
    "Confirmada": "abierto",   // verde
    "Cancelada": "cerrado",    // rojo
    "Atendida": "atendida"     // azul
};

// Da formato al precio: 5000 -> "₡5,000"
function formatearPrecio(precio) {
    return "₡" + precio.toLocaleString("en-US");
}

// Evita que un texto escrito por el usuario se interprete como HTML al usar innerHTML
function escaparHtml(texto) {
    return String(texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
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

// Busca un elemento por id dentro de un arreglo
function buscarPorId(arreglo, id) {
    return arreglo.find(function(elemento) {
        return elemento.id === id;
    });
}

// ==========================================================
// Menú lateral: muestra solo la sección elegida
// ==========================================================

const enlacesMenu = document.querySelectorAll(".panelMenu a");
const secciones = document.querySelectorAll(".seccionPanel");

for (const enlace of enlacesMenu) {
    enlace.addEventListener("click", function(event) {

        // Evita que el enlace "#" mueva la página hacia arriba
        event.preventDefault();
        ocultarAlertas();

        // Marca como activo solo el enlace presionado
        for (const otro of enlacesMenu) {
            otro.classList.remove("activo");
        }
        enlace.classList.add("activo");

        // Muestra solo la sección cuyo id coincide con data-seccion
        for (const seccion of secciones) {
            seccion.hidden = seccion.id !== enlace.dataset.seccion;
        }
    });
}

// ==========================================================
// 1. Servicios (agregar, editar y eliminar)
// ==========================================================

const formServicio = document.getElementById("formServicio");
const tituloFormServicio = document.getElementById("tituloFormServicio");
const btnGuardarServicio = document.getElementById("btnGuardarServicio");
const btnCancelarEdicion = document.getElementById("btnCancelarEdicion");
const inputNombreServicio = document.getElementById("nombreServicio");
const inputDuracionServicio = document.getElementById("duracionServicio");
const inputPrecioServicio = document.getElementById("precioServicio");
const errorNombreServicio = document.getElementById("errorNombreServicio");
const errorDuracionServicio = document.getElementById("errorDuracionServicio");
const errorPrecioServicio = document.getElementById("errorPrecioServicio");
const cuerpoTablaServicios = document.getElementById("cuerpoTablaServicios");

// Id del servicio que se está editando (null = se está agregando uno nuevo)
let idServicioEditando = null;

// Siguiente id disponible para un servicio nuevo
let siguienteIdServicio = servicios.length + 1;

// Valida el nombre y devuelve el mensaje de error ("" si está bien)
function validarNombreServicio() {
    if (inputNombreServicio.value.trim() === "") {
        return "El nombre del servicio es obligatorio.";
    }
    return "";
}

// Valida la duración y devuelve el mensaje de error ("" si está bien)
function validarDuracionServicio() {
    const texto = inputDuracionServicio.value;
    const duracion = Number(texto);
    if (texto === "") {
        return "La duración es obligatoria.";
    }
    if (!Number.isInteger(duracion) || duracion < 10 || duracion > 180) {
        return "La duración debe ser un número entero entre 10 y 180 minutos.";
    }
    return "";
}

// Valida el precio y devuelve el mensaje de error ("" si está bien)
function validarPrecioServicio() {
    const texto = inputPrecioServicio.value;
    const precio = Number(texto);
    if (texto === "") {
        return "El precio es obligatorio.";
    }
    if (isNaN(precio) || precio <= 0) {
        return "El precio debe ser mayor a 0.";
    }
    return "";
}

// Dibuja la tabla de servicios
function dibujarServicios() {
    let filas = "";
    for (const servicio of servicios) {
        filas += `
            <tr>
                <td>${escaparHtml(servicio.nombre)}</td>
                <td>${servicio.duracion} min</td>
                <td>${formatearPrecio(servicio.precio)}</td>
                <td>
                    <button type="button" class="btn btn-secondary" data-accion="editar" data-id="${servicio.id}">Editar</button>
                    <button type="button" class="btn btnPeligro" data-accion="eliminar" data-id="${servicio.id}">Eliminar</button>
                </td>
            </tr>`;
    }

    if (servicios.length === 0) {
        filas = `<tr><td colspan="4">No hay servicios registrados.</td></tr>`;
    }

    cuerpoTablaServicios.innerHTML = filas;
}

// Deja el formulario listo para agregar un servicio nuevo
function limpiarFormServicio() {
    formServicio.reset();
    idServicioEditando = null;
    tituloFormServicio.textContent = "Agregar servicio";
    btnGuardarServicio.textContent = "Agregar servicio";
    btnCancelarEdicion.hidden = true;
    mostrarErrorCampo(errorNombreServicio, "");
    mostrarErrorCampo(errorDuracionServicio, "");
    mostrarErrorCampo(errorPrecioServicio, "");
}

// Carga los datos de un servicio en el formulario para editarlo
function editarServicio(id) {
    const servicio = buscarPorId(servicios, id);
    limpiarFormServicio();

    idServicioEditando = id;
    inputNombreServicio.value = servicio.nombre;
    inputDuracionServicio.value = servicio.duracion;
    inputPrecioServicio.value = servicio.precio;

    tituloFormServicio.textContent = "Editar servicio";
    btnGuardarServicio.textContent = "Guardar cambios";
    btnCancelarEdicion.hidden = false;
    inputNombreServicio.focus();
}

// Elimina un servicio después de pedir confirmación
function eliminarServicio(id) {
    const servicio = buscarPorId(servicios, id);
    if (!confirm(`¿Seguro que querés eliminar el servicio "${servicio.nombre}"?`)) {
        return;
    }

    // splice quita 1 elemento en la posición encontrada
    const posicion = servicios.indexOf(servicio);
    servicios.splice(posicion, 1);

    // Si se estaba editando ese mismo servicio, se limpia el formulario
    if (idServicioEditando === id) {
        limpiarFormServicio();
    }

    dibujarServicios();
    mostrarAlerta(alertaExito, "Servicio eliminado con éxito.");
}

// Al escribir, si el campo ya tenía error, se vuelve a validar para limpiarlo al corregirlo
inputNombreServicio.addEventListener("input", function() {
    if (errorNombreServicio.textContent !== "") {
        mostrarErrorCampo(errorNombreServicio, validarNombreServicio());
    }
    ocultarAlertas();
});

inputDuracionServicio.addEventListener("input", function() {
    if (errorDuracionServicio.textContent !== "") {
        mostrarErrorCampo(errorDuracionServicio, validarDuracionServicio());
    }
    ocultarAlertas();
});

inputPrecioServicio.addEventListener("input", function() {
    if (errorPrecioServicio.textContent !== "") {
        mostrarErrorCampo(errorPrecioServicio, validarPrecioServicio());
    }
    ocultarAlertas();
});

// Envío del formulario: agrega o edita según idServicioEditando
formServicio.addEventListener("submit", function(event) {
    event.preventDefault();
    ocultarAlertas();

    const mensajeNombre = validarNombreServicio();
    const mensajeDuracion = validarDuracionServicio();
    const mensajePrecio = validarPrecioServicio();

    mostrarErrorCampo(errorNombreServicio, mensajeNombre);
    mostrarErrorCampo(errorDuracionServicio, mensajeDuracion);
    mostrarErrorCampo(errorPrecioServicio, mensajePrecio);

    if (mensajeNombre !== "" || mensajeDuracion !== "" || mensajePrecio !== "") {
        mostrarAlerta(alertaError, "Revisa los campos marcados.");
        return;
    }

    const nombre = inputNombreServicio.value.trim();
    const duracion = Number(inputDuracionServicio.value);
    const precio = Number(inputPrecioServicio.value);

    if (idServicioEditando === null) {
        servicios.push({ id: siguienteIdServicio, nombre: nombre, duracion: duracion, precio: precio });
        siguienteIdServicio++;
        mostrarAlerta(alertaExito, "Servicio agregado con éxito.");
    } else {
        const servicio = buscarPorId(servicios, idServicioEditando);
        servicio.nombre = nombre;
        servicio.duracion = duracion;
        servicio.precio = precio;
        mostrarAlerta(alertaExito, "Servicio actualizado con éxito.");
    }

    limpiarFormServicio();
    dibujarServicios();
});

btnCancelarEdicion.addEventListener("click", function() {
    limpiarFormServicio();
    ocultarAlertas();
});

// Un solo listener atiende los botones Editar y Eliminar de toda la tabla
cuerpoTablaServicios.addEventListener("click", function(event) {
    const boton = event.target.closest("button[data-accion]");
    if (!boton) {
        return;
    }

    ocultarAlertas();
    const id = Number(boton.dataset.id);

    if (boton.dataset.accion === "editar") {
        editarServicio(id);
    } else if (boton.dataset.accion === "eliminar") {
        eliminarServicio(id);
    }
});

// ==========================================================
// 2. Horarios (solo consulta)
// ==========================================================

const cuerpoTablaHorarios = document.getElementById("cuerpoTablaHorarios");

function dibujarHorarios() {
    let filas = "";
    for (const horario of horarios) {
        let estado = `<span class="badge-estado cerrado">Cerrado</span>`;
        if (horario.abierto) {
            estado = `<span class="badge-estado abierto">Abierto</span>`;
        }

        filas += `
            <tr>
                <td>${horario.dia}</td>
                <td>${horario.apertura}</td>
                <td>${horario.cierre}</td>
                <td>${estado}</td>
            </tr>`;
    }
    cuerpoTablaHorarios.innerHTML = filas;
}

// ==========================================================
// 3. Citas (cancelar o marcar como atendida)
// ==========================================================

const cuerpoTablaCitas = document.getElementById("cuerpoTablaCitas");

function dibujarCitas() {
    let filas = "";
    for (const cita of citas) {

        // Solo las citas confirmadas tienen acciones
        let acciones = "-";
        if (cita.estado === "Confirmada") {
            acciones = `
                <button type="button" class="btn btn-primary" data-accion="atender" data-id="${cita.id}">Marcar atendida</button>
                <button type="button" class="btn btnPeligro" data-accion="cancelar" data-id="${cita.id}">Cancelar</button>`;
        }

        filas += `
            <tr>
                <td>${cita.cliente}</td>
                <td>${cita.servicio}</td>
                <td>${cita.fecha}</td>
                <td>${cita.hora}</td>
                <td><span class="badge-estado ${clasesEstado[cita.estado]}">${cita.estado}</span></td>
                <td>${acciones}</td>
            </tr>`;
    }
    cuerpoTablaCitas.innerHTML = filas;
}

cuerpoTablaCitas.addEventListener("click", function(event) {
    const boton = event.target.closest("button[data-accion]");
    if (!boton) {
        return;
    }

    ocultarAlertas();
    const cita = buscarPorId(citas, Number(boton.dataset.id));

    if (boton.dataset.accion === "cancelar") {
        if (!confirm(`¿Seguro que querés cancelar la cita de ${cita.cliente} el ${cita.fecha} a las ${cita.hora}?`)) {
            return;
        }
        cita.estado = "Cancelada";
        mostrarAlerta(alertaExito, "La cita fue cancelada con éxito.");
    } else if (boton.dataset.accion === "atender") {
        cita.estado = "Atendida";
        mostrarAlerta(alertaExito, "La cita se marcó como atendida.");
    }

    dibujarCitas();
});

// ==========================================================
// 4. Usuarios (activar o desactivar)
// ==========================================================

const cuerpoTablaUsuarios = document.getElementById("cuerpoTablaUsuarios");

function dibujarUsuarios() {
    let filas = "";
    for (const usuario of usuarios) {

        // El badge y el botón cambian según si el usuario está activo
        let estado = `<span class="badge-estado cerrado">Inactivo</span>`;
        let boton = `<button type="button" class="btn btn-primary" data-id="${usuario.id}">Activar</button>`;
        if (usuario.activo) {
            estado = `<span class="badge-estado abierto">Activo</span>`;
            boton = `<button type="button" class="btn btnPeligro" data-id="${usuario.id}">Desactivar</button>`;
        }

        filas += `
            <tr>
                <td>${usuario.nombre}</td>
                <td>${usuario.correo}</td>
                <td>${usuario.telefono}</td>
                <td>${estado}</td>
                <td>${boton}</td>
            </tr>`;
    }
    cuerpoTablaUsuarios.innerHTML = filas;
}

cuerpoTablaUsuarios.addEventListener("click", function(event) {
    const boton = event.target.closest("button[data-id]");
    if (!boton) {
        return;
    }

    ocultarAlertas();
    const usuario = buscarPorId(usuarios, Number(boton.dataset.id));

    // ! invierte el valor: true pasa a false y false pasa a true
    usuario.activo = !usuario.activo;

    if (usuario.activo) {
        mostrarAlerta(alertaExito, `${usuario.nombre} fue activado.`);
    } else {
        mostrarAlerta(alertaExito, `${usuario.nombre} fue desactivado.`);
    }

    dibujarUsuarios();
});

// ==========================================================
// Dibujo inicial de todas las tablas
// ==========================================================

dibujarServicios();
dibujarHorarios();
dibujarCitas();
dibujarUsuarios();
