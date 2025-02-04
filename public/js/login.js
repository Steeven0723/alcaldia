// deno-lint-ignore-file no-window
// public/js/login.js
import { showAlert } from './alert.js';

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);


  try {
    const response = await fetch("/login", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(formData)),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    if (response.ok) {

      

      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('role', data.role);
      sessionStorage.setItem("id_registro", data.id_registro); // Agregar este paso
      sessionStorage.setItem("nombre", data.nombre);

      if (data.role === "Administrador") {  // Administrador
        window.location.href = "/admin/dashboard.html";
      } else if (data.role === "Funcionario") {  // Funcionario
        window.location.href = "/official/dashboard.html";
      }else if (data.role === "Recepcionista") {  // Funcionario
        window.location.href = "/reception/dashboard.html";
      }
    } else {
      // alert(data.message);
      showAlert(data.message, 'error');

    }
  } catch (error) {
    console.error("Error:", error);
    showAlert("Ocurrió un error durante el inicio de sesión", 'error');
  }

  
});
