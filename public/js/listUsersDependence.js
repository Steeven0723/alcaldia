// deno-lint-ignore-file no-inner-declarations no-window
// public/js/listUsers.js
import { showAlert } from "./alert.js";

document.addEventListener("DOMContentLoaded", async () => {
  const tableBody = document.getElementById("userTableBody");
  const paginationContainer = document.getElementById("pagination");
  const searchInput = document.getElementById("id_dependencia"); // Campo de búsqueda

  let currentPage = 1;
  const usersPerPage = 10;
  let users = []; // Guardar todos los usuarios para realizar la búsqueda

  try {
    const response = await fetch("/listUsers");
    const result = await response.json();

    if (result.success) {
      users = result.data;

      // **Ordenar usuarios por dependencia (alfabéticamente)**
      users.sort((a, b) => {
        const depA = a.nombre_dependencia ? a.nombre_dependencia.toLowerCase() : "";
        const depB = b.nombre_dependencia ? b.nombre_dependencia.toLowerCase() : "";
        return depA.localeCompare(depB);
      });

      // Función para renderizar la tabla con los usuarios filtrados
      function renderPage(page, filteredUsers) {
        tableBody.innerHTML = "";

        // **Ordenar antes de paginar**
        filteredUsers.sort((a, b) => {
          const depA = a.nombre_dependencia ? a.nombre_dependencia.toLowerCase() : "";
          const depB = b.nombre_dependencia ? b.nombre_dependencia.toLowerCase() : "";
          return depA.localeCompare(depB);
        });

        const start = (page - 1) * usersPerPage;
        const end = page * usersPerPage;
        const paginatedUsers = filteredUsers.slice(start, end);

        paginatedUsers.forEach((user) => {
          const row = document.createElement("tr");
          row.setAttribute("data-id", user.id_usuario);
          row.innerHTML = `
            <td class="px-1 py-1 text-xs bg-white border-b border-gray-200 border-r border-gray-200">
                <p class="text-gray-900 whitespace-no-wrap">${
                  user.cedula || "N/A"
                }</p>
            </td>
            <td class="px-1 py-1 text-xs bg-white border-b border-gray-200 border-r border-gray-200">
                <p class="text-gray-900 whitespace-no-wrap">${user.nombre}</p>
            </td>
            <td class="px-1 py-1 text-xs bg-white border-b border-gray-200 border-r border-gray-200">
                <p class="text-gray-900 whitespace-no-wrap">${user.email}</p>
            </td>
            <td class="px-1 py-1 text-xs bg-white border-b border-gray-200 border-r border-gray-200">
                <p class="text-gray-900 whitespace-no-wrap">${
                  user.telefono || "N/A"
                }</p>
            </td>
            <td class="px-1 py-1 text-xs bg-white border-b border-gray-200 border-r border-gray-200">
                <p class="text-gray-900 whitespace-no-wrap">${
                  user.nombre_dependencia || "Sin Asignar"
                }</p>
            </td>
            <td class="px-1 py-1 text-xs bg-white border-b border-gray-200 border-r border-gray-200">
                <p class="text-gray-900 whitespace-no-wrap">${user.role}</p>
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
          `;
          tableBody.appendChild(row);
        });

        // Recalcular totalPages basado en el tamaño de los usuarios filtrados
        const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
        renderPagination(page, totalPages, filteredUsers);
      }

      // Filtrar usuarios por dependencia
      function filterUsers() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        const filteredUsers = users.filter((user) => {
          return user.nombre_dependencia && user.nombre_dependencia.toLowerCase().includes(searchTerm);
        });

        // **Ordenar antes de renderizar**
        filteredUsers.sort((a, b) => {
          const depA = a.nombre_dependencia ? a.nombre_dependencia.toLowerCase() : "";
          const depB = b.nombre_dependencia ? b.nombre_dependencia.toLowerCase() : "";
          return depA.localeCompare(depB);
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

      // Renderizar la primera página con todos los usuarios ordenados
      renderPage(currentPage, users);

      // Escuchar el evento de búsqueda por dependencia
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

document.addEventListener("DOMContentLoaded", async () => {
  const dependenciaSelect = document.getElementById("id_dependencia");

  try {
    const response = await fetch("/dependencias");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const dependencias = await response.json();
    if (!Array.isArray(dependencias)) {
      throw new Error("Received data is not an array");
    }

    dependencias.forEach(dependencia => {
      const option = document.createElement("option");
      option.value = dependencia.nombre_dependencia;
      option.textContent = dependencia.nombre_dependencia;
      dependenciaSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error al cargar dependencias:", error);
    const errorOption = document.createElement("option");
    errorOption.textContent = "Error al cargar dependencias";
    dependenciaSelect.appendChild(errorOption);
  }
});

window.showAlert = showAlert;
