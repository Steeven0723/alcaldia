// deno-lint-ignore-file no-window
// js/login.js
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  // Imprimir el token antes de iniciar sesión
  const existingToken = localStorage.getItem("token");
  console.log("Token antes de iniciar sesión:", existingToken);

  const formData = new FormData(e.target);

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
    console.log("Token después de iniciar sesión:", data.token);
    localStorage.setItem('token', data.token); // Suponiendo que 'response.data.token' tiene el token
    window.location.href = "/dashboard.html";
  } else {
    alert(data.message); // Muestra el mensaje de error
  }
});
