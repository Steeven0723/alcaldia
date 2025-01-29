// document.getElementById("downloadBtn").addEventListener("click", () => {
//     const tableRows = document.querySelectorAll("#userTableBody tr");
//     const data = [];
    
//     // Obtener los encabezados de las columnas
//     const headers = ["Cédula", "Nombre", "Email", "Teléfono", "Dependencia", "Rol", "Estado", "Fecha de Registro"];
//     data.push(headers);
  
//     // Recorrer las filas de la tabla y extraer los datos
//     tableRows.forEach(row => {
//       const rowData = [];
//       row.querySelectorAll("input, p").forEach(cell => {
//         rowData.push(cell.value || cell.textContent);
//       });
//       data.push(rowData);
//     });
  
//     // Crear el libro de Excel
//     const ws = XLSX.utils.aoa_to_sheet(data);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Usuarios");
  
//     // Generar el archivo y descargarlo
//     XLSX.writeFile(wb, "usuarios.xlsx");
//   });

document.getElementById("downloadBtn").addEventListener("click", async () => {
    try {
        const response = await fetch("/listUsers");
        const result = await response.json();

        if (result.success) {
            const users = result.data; // Obtener todos los usuarios

            const data = [];
            // Obtener los encabezados de las columnas
            const headers = ["Cédula", "Nombre", "Email", "Teléfono", "Dependencia", "Rol", "Estado", "Fecha de Registro"];
            data.push(headers);

            // Recorrer los usuarios y extraer los datos
            users.forEach(user => {
                const rowData = [];
                rowData.push(user.cedula || "Sin Asignar");
                rowData.push(user.nombre);
                rowData.push(user.email);
                rowData.push(user.telefono || "N/A");
                rowData.push(user.id_dependencia || "Sin Asignar");
                rowData.push(user.role || "Sin Asignar");
                rowData.push(user.estado ? "Activo" : "Inactivo");
                rowData.push(new Date(user.created_at).toLocaleString());
                data.push(rowData);
            });

            // Crear el libro de Excel
            const ws = XLSX.utils.aoa_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Usuarios");

            // Generar el archivo y descargarlo
            XLSX.writeFile(wb, "usuarios.xlsx");
        } else {
            alert("Error al obtener los usuarios: " + result.message);
        }
    } catch (error) {
        console.error("Error al obtener la lista de usuarios:", error);
        alert("Error al conectar con el servidor.");
    }
});

  