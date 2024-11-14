// js/dashboard.js
const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

if (!token) {
  window.location.href = "/auth/login.html";
} else {
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
      const container = document.querySelector(".content");
      // container.innerHTML = `<h1>Bienvenido, ${role}</h1>`;
      
      if (role === "1") {
        // container.innerHTML += '<p>Contenido específico para administradores</p>';
        // Agregar aquí más contenido o funcionalidades para administradores
      } else if (role === "2") {
        // container.innerHTML += '<p>Contenido específico para funcionarios</p>';
        // Agregar aquí más contenido o funcionalidades para funcionarios
      } else if (role === "3") {
      container.innerHTML += '<p>Contenido específico para recepcionista</p>';
      // Agregar aquí más contenido o funcionalidades para funcionarios
    }
    })
    .catch((error) => {
      console.error("Error:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      window.location.href = "/auth/login.html";
    });
}

document.getElementById("logout").addEventListener("click", function (event) {
  event.preventDefault();
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.location.href = "/auth/login.html";
});