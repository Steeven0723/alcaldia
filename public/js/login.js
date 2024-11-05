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
    alert(data.message);

    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      
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
      alert(data.message);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Ocurrió un error durante el inicio de sesión");
  }
});