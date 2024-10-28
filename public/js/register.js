//  public/js/register.js
document
  .getElementById("register-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const userData = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (result.success) {
        document.getElementById("totp-secret").style.display = "block";
        document.getElementById("register-form").style.display = "none";
      }
      if (result.totpSecret) {
        document.getElementById("totpSecret").innerHTML = `
            <p>Tu secreto TOTP es: ${result.totpSecret}</p>
            <p>Por favor, guárdalo y úsalo para configurar Google Authenticator.</p>
        `;
      } else {
        console.error("Mensaje:", result.message);
        alert("Mensaje: " + result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Ocurrió un error durante el registro");
    }
  });
