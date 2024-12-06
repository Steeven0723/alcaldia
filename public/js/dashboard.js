// deno-lint-ignore-file no-window
// js/dashboard.js
const token = localStorage.getItem("token");
const role = localStorage.getItem("role");
const idRegistro = localStorage.getItem("id_registro");


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

    // Registrar la vista del dashboard
    updateTrazabilidad("/official/dashboard.html");

    })
    .catch((error) => {
      console.error("Error:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      window.location.href = "/auth/login.html";
    });
}

// document.getElementById("logout").addEventListener("click", function (event) {
//   event.preventDefault();
//   localStorage.removeItem("token");
//   localStorage.removeItem("role");
//   window.location.href = "/auth/login.html";
// });

document.getElementById("logout").addEventListener("click", async (event) => {
  event.preventDefault();
  const idRegistro = localStorage.getItem("id_registro");
  if (!idRegistro) {
    console.error("No se encontró id_registro en localStorage");
    return;
  }

  try {
    const response = await fetch("/logout", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id_registro: idRegistro }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Respuesta del servidor:", data);
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("id_registro");
      window.location.href = "/auth/login.html";
    } else {
      const errorData = await response.json();
      console.error("Error al cerrar sesión:", errorData);
    }
  } catch (error) {
    console.error("Error de red:", error);
  }
});

document.getElementById("listpqrs").addEventListener("click", function (event) {
  event.preventDefault();
  window.location.href = "/official/listpqrs.html";
});

function updateTrazabilidad(pagina) {
  fetch("/update-trazabilidad", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id_registro: idRegistro, pagina }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al actualizar trazabilidad");
      }
    })
    .catch((error) => {
      console.error("Error al actualizar trazabilidad:", error);
    });
}

// Actualizar trazabilidad para todos los enlaces
document.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = e.target.getAttribute("href");
    if (href && href !== "#") {
      updateTrazabilidad(href);
    }
  });
});