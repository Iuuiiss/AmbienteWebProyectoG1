// Citas de ejemplo (todavia no hay backend; luego vendran de la base de datos)
const citas = [
    { id: 1, servicio: "Corte de Cabello", fecha: "15/11/2026", hora: "09:00 AM", precio: 5000, estado: "Confirmada" },
    { id: 2, servicio: "Combo Completo",   fecha: "20/11/2026", hora: "02:00 PM", precio: 7500, estado: "Confirmada" },
    { id: 3, servicio: "Arreglo de Barba", fecha: "02/11/2026", hora: "11:00 AM", precio: 3500, estado: "Atendida" },
    { id: 4, servicio: "Limpieza Facial",  fecha: "28/10/2026", hora: "04:00 PM", precio: 6000, estado: "Cancelada" }
];

// Elementos de la página
const cuerpoTablaCitas = document.getElementById("cuerpoTablaCitas");
const tablaCitas = document.getElementById("tablaCitas");
const mensajeSinCitas = document.getElementById("mensajeSinCitas");
const alertaExito = document.getElementById("alertaExito");

// Clase de color del badge según el estado
const clasesEstado = {
    "Confirmada": "abierto",   // verde
    "Cancelada": "cerrado",    // rojo
    "Atendida": "atendida"     // azul
};

// Da formato al precio: 5000 -> "₡5,000"
function formatearPrecio(precio) {
    return "₡" + precio.toLocaleString("en-US");
}

// Muestra una alerta con un mensaje
function mostrarAlerta(alerta, mensaje) {
    alerta.textContent = mensaje;
    alerta.classList.add("mostrar");
}

// Dibuja la tabla a partir del arreglo de citas
function dibujarTabla() {

    // Si no hay citas, se oculta la tabla y se muestra el mensaje
    if (citas.length === 0) {
        tablaCitas.hidden = true;
        mensajeSinCitas.hidden = false;
        return;
    }

    tablaCitas.hidden = false;
    mensajeSinCitas.hidden = true;

    let filas = "";
    for (const cita of citas) {

        // Solo las citas confirmadas se pueden cancelar
        let accion = "-";
        if (cita.estado === "Confirmada") {
            accion = `<button type="button" class="btn btnPeligro" data-id="${cita.id}">Cancelar</button>`;
        }

        filas += `
            <tr>
                <td>${cita.servicio}</td>
                <td>${cita.fecha}</td>
                <td>${cita.hora}</td>
                <td>${formatearPrecio(cita.precio)}</td>
                <td><span class="badge-estado ${clasesEstado[cita.estado]}">${cita.estado}</span></td>
                <td>${accion}</td>
            </tr>`;
    }

    cuerpoTablaCitas.innerHTML = filas;
}

// Cancela una cita después de pedir confirmación
function cancelarCita(id) {
    const cita = citas.find(function(c) {
        return c.id === id;
    });

    if (!confirm(`¿Seguro que querés cancelar tu cita de ${cita.servicio} el ${cita.fecha} a las ${cita.hora}?`)) {
        return;
    }

    cita.estado = "Cancelada";
    dibujarTabla();
    mostrarAlerta(alertaExito, "La cita fue cancelada con éxito.");
}

// Un solo listener en el tbody atiende los clics de todos los botones "Cancelar",
// incluso los que se crean cada vez que se vuelve a dibujar la tabla
cuerpoTablaCitas.addEventListener("click", function(event) {
    const boton = event.target.closest("button[data-id]");
    if (boton) {
        cancelarCita(Number(boton.dataset.id));
    }
});

// Dibujo inicial
dibujarTabla();
