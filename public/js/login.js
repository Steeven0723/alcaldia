document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
  
    const response = await fetch("/login", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    const result = await response.json();
    alert(result.message);
    if (response.ok) {
      window.location.href = "/dashboard.html";
      localStorage.setItem("token", result.token); // Guardar el token
    } else {
      alert(result.message || "Error al iniciar sesión");
    }
  });
  