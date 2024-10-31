// js/dashboard.js
// deno-lint-ignore-file no-window
// Obtén el token del localStorage
const token = localStorage.getItem("token");

if (!token) {
  // Si no hay token, redirigir al login
  window.location.href = "/auth/login.html";
} else {
  // Realiza la petición para verificar el token
  fetch("/dashboard", {
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
    .then((data) => {
      document.querySelector(".container").innerHTML;
    })
    .catch((error) => {
      console.error("Error:", error);
      localStorage.removeItem("token");
      window.location.href = "/auth/login.html";
    });
}

// Manejo del cierre de sesión
document.getElementById("logout").addEventListener("click", function (event) {
  event.preventDefault(); // Evita el comportamiento predeterminado del enlace
  localStorage.removeItem("token"); // Elimina el token del almacenamiento local
  window.location.href = "/auth/login.html"; // Redirige al usuario a la página de inicio de sesión
});
