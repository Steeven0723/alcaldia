// public/js/dependencias.js
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
        option.value = dependencia.id_dependencia;
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