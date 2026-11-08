const formulario = document.getElementById("formCita");

if (formulario) {
    formulario.addEventListener("submit", function(event) {
        event.preventDefault();
        alert("Cita reservada con exito.");
        formulario.reset();
    });
}
