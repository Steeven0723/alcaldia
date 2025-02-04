// deno-lint-ignore-file no-inner-declarations
// public/js/listUsers.js
import { showAlert } from "./alert.js";

document.addEventListener("DOMContentLoaded", async () => {
  const tableBody = document.getElementById("userTableBody");
  const paginationContainer = document.getElementById("pagination");
  const searchInput = document.getElementById("searchCedula"); // Campo de búsqueda

  let currentPage = 1;
  const usersPerPage = 10;
  let users = []; // Guardar todos los usuarios para realizar la búsqueda

  try {
    const response = await fetch("/listUsers");
    const result = await response.json();

    if (result.success) {
      users = result.data; // Almacenar los usuarios en la variable 'users'
      const totalPages = Math.ceil(users.length / usersPerPage);

      // Función para renderizar la tabla con los usuarios filtrados
      function renderPage(page, filteredUsers) {
        tableBody.innerHTML = "";

        const start = (page - 1) * usersPerPage;
        const end = page * usersPerPage;
        const paginatedUsers = filteredUsers.slice(start, end);

        paginatedUsers.forEach((user) => {
          const row = document.createElement("tr");
          row.setAttribute("data-id", user.id_usuario);
          row.innerHTML = `
              <td class="px-1 py-1 text-xs bg-white border-b border-gray-200 border-r border-gray-200">
                <input name="cedula" class="bg-transparent border-none text-gray-900 whitespace-no-wrap w-20" value="${
                  user.cedula || "Sin Asignar"
                }" readonly />
              </td>
              <td class="px-1 py-1 text-xs bg-white border-b border-gray-200 border-r border-gray-200">
                <input name="nombre" class="bg-transparent border-none text-gray-900 whitespace-no-wrap w-20" value="${
                  user.nombre
                }" readonly />
              </td>
              <td class="px-1 py-1 text-xs bg-white border-b border-gray-200 border-r border-gray-200">
                <input name="email" class="bg-transparent border-none text-gray-900 whitespace-no-wrap w-25" value="${
                  user.email
                }" readonly />
              </td>
              <td class="px-1 py-1 text-xs bg-white border-b border-gray-200 border-r border-gray-200">
                <input name="telefono" class="bg-transparent border-none text-gray-900 whitespace-no-wrap w-20" value="${
                  user.telefono || "N/A"
                }" readonly />
              </td>
              <td class="px-1 py-1 text-xs bg-white border-b border-gray-200 border-r border-gray-200">
                  <input name="nombre_dependencia" class="bg-transparent border-none text-gray-900 whitespace-no-wrap w-20" 
                      value="${
                        user.nombre_dependencia || "Sin Asignar"
                      }" readonly />
                  <input type="hidden" name="id_dependencia" value="${
                    user.id_dependencia
                  }">
              </td>
              <td class="px-1 py-1 text-xs bg-white border-b border-gray-200 border-r border-gray-200">
                <input name="role" class="bg-transparent border-none text-gray-900 whitespace-no-wrap w-5" value="${
                  user.role || "Sin Asignar"
                }" readonly />
              </td>
              <td class="px-1 py-1 text-xs bg-white border-b border-gray-200 border-r border-gray-200">
                <span class="relative inline-block px-3 py-1 font-semibold leading-tight ${
                  user.estado ? "text-green-900" : "text-red-900"
                }">
                  <span aria-hidden="true" class="absolute inset-0 ${
                    user.estado ? "bg-green-200" : "bg-red-200"
                  } rounded-full"></span>
                  <span class="relative">${
                    user.estado ? "Activo" : "Inactivo"
                  }</span>
                </span>
              </td>
              <td class="px-1 py-1 text-xs bg-white border-b border-gray-200 border-r border-gray-200">
                <p class="text-gray-900 whitespace-no-wrap">${
                  user.totp_secret
                }</p>
              </td>
              <td class="px-1 py-1 text-xs bg-white border-b border-gray-200 border-r border-gray-200">
                <p class="text-gray-900 whitespace-no-wrap">${new Date(
                  user.created_at
                ).toLocaleString()}</p>
              </td>
              <td class="px-1 py-1 text-xs bg-white border-b border-gray-200">
                <i class="fas fa-edit text-blue-600 cursor-pointer" onclick="enableEdit(this)"></i>
                <i class="fas fa-times text-red-600 cursor-pointer hidden" onclick="cancelEdit(this)"></i>
                <i class="fas fa-check text-green-600 cursor-pointer hidden" onclick="saveEdit(this)"></i>
              </td>
            `;
          tableBody.appendChild(row);
        });

        // Recalcular totalPages basado en el tamaño de los usuarios filtrados
        const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
        renderPagination(page, totalPages, filteredUsers);
      }
      // Filtrar usuarios por cédula
      function filterUsers() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        const filteredUsers = users.filter((user) => {
          return user.cedula && user.cedula.toLowerCase().includes(searchTerm);
        });

        currentPage = 1; // Reiniciar a la primera página
        renderPage(currentPage, filteredUsers);
      }

      // Función para renderizar la paginación
      function renderPagination(page, totalPages, filteredUsers) {
        paginationContainer.innerHTML = "";

        const prevButton = document.createElement("button");
        prevButton.textContent = "Anterior";
        prevButton.disabled = page === 1;
        prevButton.addEventListener("click", () => {
          currentPage = page - 1; // Actualiza currentPage
          renderPage(currentPage, filteredUsers);
        });

        const nextButton = document.createElement("button");
        nextButton.textContent = "Siguiente";
        nextButton.disabled = page === totalPages;
        nextButton.addEventListener("click", () => {
          currentPage = page + 1; // Actualiza currentPage
          renderPage(currentPage, filteredUsers);
        });

        paginationContainer.appendChild(prevButton);
        paginationContainer.appendChild(
          document.createTextNode(` Página ${page} de ${totalPages} `)
        );
        paginationContainer.appendChild(nextButton);
      }

      // Renderizar la primera página con todos los usuarios
      renderPage(currentPage, users);

      // Escuchar el evento de búsqueda por cédula
      searchInput.addEventListener("input", filterUsers);
    } else {
      tableBody.innerHTML = `
        <tr>
          <td colspan="8" class="px-5 py-5 text-sm bg-white border-b border-gray-200 text-center">
            <p class="text-gray-900 whitespace-no-wrap">Error al obtener los usuarios: ${result.message}</p>
          </td>
        </tr>
      `;
    }
  } catch (error) {
    console.error("Error al obtener la lista de usuarios:", error);
    tableBody.innerHTML = `
      <tr>
        <td colspan="8" class="px-5 py-5 text-sm bg-white border-b border-gray-200 text-center">
          <p class="text-gray-900 whitespace-no-wrap">Error al conectar con el servidor.</p>
        </td>
      </tr>
    `;
  }
});

function enableEdit(icon) {
  const row = icon.closest("tr")
  const inputs = row.querySelectorAll("input, select")

  // Guardar el estado actual en un atributo de datos
  const estadoSpan = row.querySelector("span.relative")
  const estadoActual = estadoSpan ? (estadoSpan.textContent.trim() === "Activo" ? "1" : "0") : "0"
  row.setAttribute("data-estado", estadoActual)

  // Ocultar el input de nombre_dependencia
  const nombreDependenciaInput = row.querySelector("input[name='nombre_dependencia']")
  if (nombreDependenciaInput) {
    nombreDependenciaInput.style.display = "none" // Ocultar input visible
  }

  // Cambiar el campo de dependencia por un select
  const dependenciaInput = row.querySelector("input[name='id_dependencia']")
  if (dependenciaInput) {
    const select = document.createElement("select")
    select.name = dependenciaInput.name
    select.classList.add("bg-transparent", "border", "border-gray-300", "p-1")
    select.removeAttribute("readonly")

    // Crear las opciones para el select de dependencias
    fetch("/dependencias")
      .then((response) => response.json())
      .then((dependencias) => {
        dependencias.forEach((dependencia) => {
          const option = document.createElement("option")
          option.value = dependencia.id_dependencia
          option.textContent = dependencia.nombre_dependencia
          select.appendChild(option)
        })
        // Preseleccionar la opción correspondiente a la dependencia actual
        const selectedOption = select.querySelector(`option[value="${dependenciaInput.value}"]`)
        if (selectedOption) {
          selectedOption.selected = true
        }
      })
      .catch((error) => {
        console.error("Error al cargar las dependencias:", error)
      })

    // Reemplazar el input por el select
    dependenciaInput.replaceWith(select)
  }

  // Cambiar el estado a un select
  if (estadoSpan) {
    const select = document.createElement("select")
    select.name = "estado"
    select.classList.add("bg-transparent", "border", "border-gray-300", "p-1")
    select.removeAttribute("readonly")

    const activeOption = document.createElement("option")
    activeOption.value = "1"
    activeOption.textContent = "Activo"
    const inactiveOption = document.createElement("option")
    inactiveOption.value = "0"
    inactiveOption.textContent = "Inactivo"

    select.appendChild(activeOption)
    select.appendChild(inactiveOption)

    select.value = estadoActual
    estadoSpan.replaceWith(select)
  }

  // Habilitar los campos para edición
  inputs.forEach((input) => {
    input.removeAttribute("readonly")
    input.classList.add("border", "border-gray-300", "p-1")
  })

  // Mostrar los íconos de cancelar y guardar
  icon.classList.add("hidden")
  row.querySelector(".fa-times").classList.remove("hidden")
  row.querySelector(".fa-check").classList.remove("hidden")
}

function cancelEdit(icon) {
  const row = icon.closest("tr");
  const inputs = row.querySelectorAll("input");

  // Restaurar el input de nombre_dependencia
  const nombreDependenciaInput = row.querySelector("input[value]");
  if (nombreDependenciaInput) {
    nombreDependenciaInput.style.display = ""; // Mostrar de nuevo el input
  }

  // Restaurar los valores originales
  inputs.forEach((input) => {
    input.value = input.defaultValue;
    input.setAttribute("readonly", "true");
    input.classList.remove("border", "border-gray-300", "p-1");
  });

  // Restaurar los íconos
  icon.classList.add("hidden");
  row.querySelector(".fa-check").classList.add("hidden");
  row.querySelector(".fa-edit").classList.remove("hidden");
}

async function saveEdit(icon) {
  const row = icon.closest("tr")
  const inputs = row.querySelectorAll("input, select")
  const id_usuario = row.getAttribute("data-id")
  const updatedData = {}

  const currentState = row.getAttribute("data-estado")

  inputs.forEach((input) => {
    if (input.name) {
      updatedData[input.name] = input.value
    }
  })

  const newState = updatedData["estado"]

  try {
    const response = await fetch(`/updateUser/${id_usuario}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    })

    const result = await response.json()
    if (result.success) {
      // Si el estado cambia de 1 (activo) a 0 (inactivo), registrar la Inactivacion
      if (currentState === "1" && newState === "0") {
        await registerInactivos(id_usuario)
      }

      showAlert("Datos actualizados correctamente", "success")

      // Actualizar el estado en la fila
      const estadoSelect = row.querySelector("select[name='estado']")
      if (estadoSelect) {
        const nuevoEstadoSpan = document.createElement("span")
        nuevoEstadoSpan.className = "relative inline-block px-3 py-1 font-semibold leading-tight"
        nuevoEstadoSpan.innerHTML = `
          <span aria-hidden="true" class="absolute inset-0 ${newState === "1" ? "bg-green-200" : "bg-red-200"} rounded-full"></span>
          <span class="relative">${newState === "1" ? "Activo" : "Inactivo"}</span>
        `
        estadoSelect.replaceWith(nuevoEstadoSpan)
      }

      row.querySelectorAll("input, select").forEach((input) => {
        input.setAttribute("readonly", "true")
        input.classList.remove("border", "border-gray-300", "p-1")
      })
      row.querySelector(".fa-times").classList.add("hidden")
      row.querySelector(".fa-check").classList.add("hidden")
      row.querySelector(".fa-edit").classList.remove("hidden")

      // Actualizar el atributo data-estado con el nuevo estado
      row.setAttribute("data-estado", newState)

      setTimeout(() => {
        location.reload()
      }, 3000)
    } else {
      showAlert("Error al actualizar los datos: " + result.message, "error")
    }
  } catch (error) {
    console.error("Error:", error)
    showAlert("Error al realizar la solicitud", "error")
  }
}

// Nueva función para registrar la Inactivacion
async function registerInactivos(id_usuario) {

  try {
    const response = await fetch("/disable", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_usuario,
      }),
    });

    const result = await response.json();

    if (result.success) {
      console.log("Inactivacion registrada correctamente.");
    } else {
      console.error("Error al registrar la inactivacion:", result.message);
    }
  } catch (error) {
    console.error("Error en la solicitud de inactivacion:", error);
  }
}

window.enableEdit = enableEdit;
window.cancelEdit = cancelEdit;
window.saveEdit = saveEdit;
window.showAlert = showAlert;
