const formulario = document.getElementById("formCita");

formulario.addEventListener("submit", function(event) {
    event.preventDefault();
    alert("Cita reservada con exito.");
    formulario.reset();
});