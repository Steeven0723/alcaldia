// js/dashboard.js
// deno-lint-ignore-file no-window
// Obtén el token del localStorage
const token = localStorage.getItem("token");

// Imprimir el token antes de la verificación
console.log("Token en el dashboard:", token);

if (!token) {
    // Si no hay token, redirige al login
    window.location.href = "/login.html";
} else {
    fetch("http://localhost:8000/dashboard.html", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('No autorizado');
        }
        return response.text();
    })
    .then(data => {
        document.querySelector(".container").innerHTML += `<p>${data}</p>`;
    })
    .catch(error => {
        console.error("Error:", error);
        localStorage.removeItem("token"); // Borra el token si hay un error
        window.location.href = "/login.html";
    });
}

