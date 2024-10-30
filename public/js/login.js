// deno-lint-ignore-file no-window
// document.getElementById("login-form").addEventListener("submit", async (e) => {
//   e.preventDefault();
//   const formData = new FormData(e.target);
//   const data = Object.fromEntries(formData);

//   const response = await fetch("/login", {
//     method: "POST",
//     body: JSON.stringify(data),
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
  
  
//   const result = await response.json();

//     // alert(result.message);
//     // if (result.ok) {
//     //   // deno-lint-ignore no-window
//     //   window.location.href = "/dashboard";
//     // }

  
//   alert(result.message);
//   if (response.status === 200) {
//     localStorage.setItem("token", response.data.token); // Guardar el token
//     window.location.href = "/dashboard.html";
    
//   } else {
//     alert(response.data.message); // Muestra el mensaje de error específico
//   }
// });

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  
  const response = await fetch('/login', {
      method: 'POST',
      body: JSON.stringify(Object.fromEntries(formData)),
      headers: {
          'Content-Type': 'application/json'
      }
  });
  const data = await response.json();
  alert(data.message);
  if (response.ok) {
      window.location.href = '/dashboard.html';
  }
});

