// deno-lint-ignore-file no-inner-declarations
// public/js/listUsers.js
document.addEventListener("DOMContentLoaded", async () => {
  const tableBody = document.getElementById("userTableBody");
  const paginationContainer = document.getElementById("pagination");

  let currentPage = 1;
  const usersPerPage = 5;

  try {
    const response = await fetch("/listUsers");
    const result = await response.json();

    if (result.success) {
      const users = result.data;
      const totalPages = Math.ceil(users.length / usersPerPage);

      function renderPage(page) {
        // Limpiar la tabla
        tableBody.innerHTML = "";

        // Calcular el índice de inicio y fin de los usuarios para esta página
        const start = (page - 1) * usersPerPage;
        const end = page * usersPerPage;

        // Insertar las filas correspondientes a la página actual
        users.slice(start, end).forEach((user) => {
          const row = document.createElement("tr");
          row.setAttribute("data-id", user.id_usuario);
          row.innerHTML = `
            <td class="px-1 py-1 text-xs bg-white border-b border-gray-200 border-r border-gray-200">
              <input name="cedula" class="bg-transparent border-none text-gray-900 whitespace-no-wrap w-20" value="${user.cedula || "Sin Asignar"}" readonly />
            </td>
            <td class="px-1 py-1 text-xs bg-white border-b border-gray-200 border-r border-gray-200">
              <input name="nombre" class="bg-transparent border-none text-gray-900 whitespace-no-wrap w-20" value="${user.nombre}" readonly />
            </td>
            <td class="px-1 py-1 text-xs bg-white border-b border-gray-200 border-r border-gray-200">
              <input name="email" class="bg-transparent border-none text-gray-900 whitespace-no-wrap w-25" value="${user.email}" readonly />
            </td>
            <td class="px-1 py-1 text-xs bg-white border-b border-gray-200 border-r border-gray-200">
              <input name="telefono" class="bg-transparent border-none text-gray-900 whitespace-no-wrap w-20" value="${user.telefono || "N/A"}" readonly />
            </td>
            <td class="px-1 py-1 text-xs bg-white border-b border-gray-200 border-r border-gray-200">
              <input name="id_dependencia" class="bg-transparent border-none text-gray-900 whitespace-no-wrap w-20" value="${user.id_dependencia  || "Sin Asignar"}" readonly />
            </td>
            <td class="px-1 py-1 text-xs bg-white border-b border-gray-200 border-r border-gray-200">
              <input name="role" class="bg-transparent border-none text-gray-900 whitespace-no-wrap w-5" value="${user.role || "Sin Asignar"}" readonly />
            </td>
            <td class="px-1 py-1 text-xs bg-white border-b border-gray-200 border-r border-gray-200">
              <span class="relative inline-block px-3 py-1 font-semibold leading-tight ${user.estado ? "text-green-900" : "text-red-900"}">
                <span aria-hidden="true" class="absolute inset-0 ${user.estado ? "bg-green-200" : "bg-red-200"} rounded-full"></span>
                <span class="relative">${user.estado ? "Activo" : "Inactivo"}</span>
              </span>
            </td>
            <td class="px-1 py-1 text-xs bg-white border-b border-gray-200 border-r border-gray-200">
              <p class="text-gray-900 whitespace-no-wrap">${new Date(user.created_at).toLocaleString()}</p>
            </td>
            <td class="px-1 py-1 text-xs bg-white border-b border-gray-200">
              <i class="fas fa-edit text-blue-600 cursor-pointer" onclick="enableEdit(this)"></i>
              <i class="fas fa-times text-red-600 cursor-pointer hidden" onclick="cancelEdit(this)"></i>
              <i class="fas fa-check text-green-600 cursor-pointer hidden" onclick="saveEdit(this)"></i>
            </td>
          `;
          tableBody.appendChild(row);
        });

        // Mostrar la paginación
        renderPagination(page, totalPages);
      }

      function renderPagination(page, totalPages) {
        paginationContainer.innerHTML = "";

        const prevButton = document.createElement("button");
        prevButton.textContent = "Anterior";
        prevButton.disabled = page === 1;
        prevButton.addEventListener("click", () => renderPage(page - 1));

        const nextButton = document.createElement("button");
        nextButton.textContent = "Siguiente";
        nextButton.disabled = page === totalPages;
        nextButton.addEventListener("click", () => renderPage(page + 1));

        paginationContainer.appendChild(prevButton);
        paginationContainer.appendChild(document.createTextNode(` Página ${page} de ${totalPages} `));
        paginationContainer.appendChild(nextButton);
      }

      // Renderizar la primera página
      renderPage(currentPage);
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
  const row = icon.closest("tr");
  const inputs = row.querySelectorAll("input, select");

// Cambiar el campo de dependencia por un select
const dependenciaInput = row.querySelector("input[name='id_dependencia']");
if (dependenciaInput) {
  const select = document.createElement("select");
  select.name = dependenciaInput.name;
  select.classList.add("bg-transparent", "border", "border-gray-300", "p-1");
  select.removeAttribute("readonly");

  // Crear las opciones para el select de dependencias
  fetch("/dependencias")
  .then(response => response.json())
  .then(dependencias => {
    dependencias.forEach(dependencia => {
      const option = document.createElement("option");
      option.value = dependencia.id_dependencia;
      option.textContent = dependencia.nombre_dependencia;
      select.appendChild(option);
    });
    // Preseleccionar la opción correspondiente a la dependencia actual
    const selectedOption = select.querySelector(`option[value="${dependenciaInput.value}"]`);
    if (selectedOption) {
      selectedOption.selected = true;
    }
  })
  .catch(error => {
    console.error("Error al cargar las dependencias:", error);
  });

// Reemplazar el input por el select
dependenciaInput.replaceWith(select);
}

// Cambiar el estado a un select
const estadoSpan = row.querySelector("span.relative");
if (estadoSpan) {
  const select = document.createElement("select");
  select.name = "estado";
  select.classList.add("bg-transparent", "border", "border-gray-300", "p-1");
  select.removeAttribute("readonly");

  const activeOption = document.createElement("option");
  activeOption.value = "1";
  activeOption.textContent = "Activo";
  const inactiveOption = document.createElement("option");
  inactiveOption.value = "0";
  inactiveOption.textContent = "Inactivo";

  select.appendChild(activeOption);
  select.appendChild(inactiveOption);

  // Preseleccionar la opción correspondiente al estado actual
  select.value = estadoSpan.textContent.trim() === "Activo" ? "1" : "0";
  
  // Reemplazar el span por el select
  estadoSpan.replaceWith(select);
}

  // Habilitar los campos para edición
  inputs.forEach((input) => {
    input.removeAttribute("readonly");
    input.classList.add("border", "border-gray-300", "p-1");
  });

  // Mostrar los íconos de cancelar y guardar
  icon.classList.add("hidden");
  row.querySelector(".fa-times").classList.remove("hidden");
  row.querySelector(".fa-check").classList.remove("hidden");
}


function cancelEdit(icon) {
  const row = icon.closest("tr");
  const inputs = row.querySelectorAll("input");

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
  const row = icon.closest("tr");
  const inputs = row.querySelectorAll("input, select"); // Cambiar 'input' por 'input, select'
  const id_usuario = row.getAttribute("data-id");
  const updatedData = {}; // Inicializa un objeto vacío

  inputs.forEach((input) => {
    if (input.name) { // Verifica que el input o select tenga el atributo 'name'
      updatedData[input.name] = input.value; // Guarda el valor usando input.name como clave
    }
  });

  alert(JSON.stringify(updatedData)); // Muestra los datos que se enviarán

  try {
    const response = await fetch(`/updateUser/${id_usuario}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });

    const result = await response.json();
    if (result.success) {
      alert("Datos actualizados correctamente");
      // Deshabilitar edición y restaurar iconos
      row.querySelectorAll("input, select").forEach((input) => {
        input.setAttribute("readonly", "true");
        input.classList.remove("border", "border-gray-300", "p-1");
      });
      row.querySelector(".fa-times").classList.add("hidden");
      row.querySelector(".fa-check").classList.add("hidden");
      row.querySelector(".fa-edit").classList.remove("hidden");
    } else {
      alert("Error al actualizar los datos: " + result.message);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error al realizar la solicitud");
  }
}

