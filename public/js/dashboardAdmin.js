// deno-lint-ignore-file no-window
// js/dashboard.js
document.addEventListener("DOMContentLoaded", () => {
  // Obtén el nombre del usuario desde el backend o sessionStorage
  const nombre = sessionStorage.getItem("nombre") || "Usuario Desconocido";

  // Actualiza el contenido del elemento
  document.getElementById("nombre").textContent = nombre;
});


const token = sessionStorage.getItem("token");
const _role = sessionStorage.getItem("role");
const _idRegistro = sessionStorage.getItem("id_registro");

if (!token) {
  window.location.href = "/";
} else {
  fetch("/admin", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("No autorizado");
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Error:", error);
      sessionStorage.clear();
      window.location.href = "/";
    });
}

document.getElementById("logout").addEventListener("click", function (event) {
  event.preventDefault();
  // Eliminar todos los datos de sessionStorage
  sessionStorage.clear();

  // Redirigir al login
  window.location.href = "/";

});



// Actualizar trazabilidad para todos los enlaces
// document.querySelectorAll("a").forEach((link) => {
//   link.addEventListener("click", (e) => {
//     const href = e.target.getAttribute("href");
//     if (href && href !== "#") {
//       updateTrazabilidad(href);
//     }
//   });
// });