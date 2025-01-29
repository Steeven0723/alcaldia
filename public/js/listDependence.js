// deno-lint-ignore-file no-inner-declarations
// public/js/listDependence.js
document.addEventListener("DOMContentLoaded", async () => {
    const tableBody = document.getElementById("dependenceTableBody");
    const paginationContainer = document.getElementById("pagination");
  
    let currentPage = 1;
    const dependencesPerPage = 5;
  
    try {
      const response = await fetch("/listDependence");
      const result = await response.json();
  
      if (result.success) {
        const dependences = result.data;
        const totalPages = Math.ceil(dependences.length / dependencesPerPage);
  
        function renderPage(page) {
          // Limpiar la tabla
          tableBody.innerHTML = "";
  
          // Calcular el índice de inicio y fin de los usuarios para esta página
          const start = (page - 1) * dependencesPerPage;
          const end = page * dependencesPerPage;
  
          // Insertar las filas correspondientes a la página actual
          dependences.slice(start, end).forEach((dependence) => {
            const row = document.createElement("tr");
            row.setAttribute("data-id", dependence.id_dependencia);
            row.innerHTML = `
              <td class="px-1 py-1 text-xs bg-white border-b border-gray-200 border-r border-gray-200">
                <input name="id_dependencia" class="bg-transparent border-none text-gray-900 whitespace-no-wrap" value="${dependence.id_dependencia || "Sin Asignar"}" readonly />
              </td>
              <td class="px-1 py-1 text-xs bg-white border-b border-gray-200 border-r border-gray-200">
                <input name="nombre_dependencia" class="bg-transparent border-none text-gray-900 whitespace-no-wrap" value="${dependence.nombre_dependencia}" readonly />
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
    const inputs = row.querySelectorAll("input");
  
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
    const inputs = row.querySelectorAll("input");
    const id_dependencia = row.getAttribute("data-id");
    const updatedData = {}; // Inicializa un objeto vacío
  
    inputs.forEach((input) => {
      if (input.name) { // Verifica que el input o select tenga el atributo 'name'
        updatedData[input.name] = input.value; // Guarda el valor usando input.name como clave
      }
    });
  
    alert(JSON.stringify(updatedData)); // Muestra los datos que se enviarán
  
    try {
      const response = await fetch(`/updateDependence/${id_dependencia}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
  
      const result = await response.json();
      if (result.success) {
        alert("Datos actualizados correctamente");
        // Deshabilitar edición y restaurar iconos
        row.querySelectorAll("input").forEach((input) => {
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
  
  