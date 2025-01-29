// deno-lint-ignore-file no-window
// public/js/login.js
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

      if (data.role === "1") {  // Administrador
        window.location.href = "/admin/dashboard.html";
      } else if (data.role === "2") {  // Funcionario
        window.location.href = "/official/dashboard.html";
      }else if (data.role === "3") {  // Funcionario
        window.location.href = "/reception/dashboard.html";
      }
      
      // let dashboardUrl;
      // switch (role) {
      //   case "1":
      //     dashboardUrl = "/admin/dashboard.html";
      //     break;
      //   case "2":
      //     dashboardUrl = "/official/dashboard.html";
      //     break;
      //   case "3":
      //     dashboardUrl = "/reception/dashboard.html";
      //     break;
      // }
      // alert(dashboardUrl)
      // window.location.href = dashboardUrl;
    } else {
      // alert(data.message);
      showAlert(data.message, 'error');

    }
  } catch (error) {
    console.error("Error:", error);
    showAlert("Ocurrió un error durante el inicio de sesión", 'error');
  }

  
});

function showAlert(message, type) {
  const alertContainer = document.getElementById('floating-alert-container');

  // Crear el elemento de la alerta
  const alert = document.createElement('div');
  alert.classList.add('alert', type === 'error' ? 'error' : 'success');
  alert.textContent = message;

  // Agregar al contenedor
  alertContainer.appendChild(alert);

  // Remover la alerta después de la animación (4s)
  setTimeout(() => {
      alert.remove();
  }, 4000); // Duración total de la animación + tiempo visible
}

