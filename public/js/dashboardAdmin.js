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

// Evento de cierre de sesión manual
document.getElementById("logout").addEventListener("click", async (event) => {
  event.preventDefault();
  logout();
});

// Función para cerrar sesión
async function logout() {
  const idRegistro = sessionStorage.getItem("id_registro");
  if (!idRegistro) {
    console.error("No se encontró id_registro en sessionStorage");
    return;
  }

  const token = sessionStorage.getItem("token");  // Eliminar token antes de hacer la petición


  try {
    const response = await fetch("/logout", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id_registro: idRegistro }),
    });

    if (response.ok) {
      // Eliminar todos los datos de sessionStorage
      sessionStorage.clear();

      // Redirigir al login
      window.location.href = "/";
    } else {
      const errorData = await response.json();
      console.error("Error al cerrar sesión:", errorData);
    }
  } catch (error) {
    console.error("Error de red:", error);
  }
}

/* ========== CONTROL DE INACTIVIDAD ========== */
let timeout;

function resetTimer() {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    logout();
  }, 60 * 60 * 1000); // 60 minutos
}

// Eventos para detectar actividad del usuario y reiniciar el temporizador
document.addEventListener("mousemove", resetTimer);
document.addEventListener("keydown", resetTimer);
document.addEventListener("click", resetTimer);
