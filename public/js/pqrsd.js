// public/js/pqrsd.js

document.getElementById("pqrsd-form").addEventListener("submit", async function (event) {
    event.preventDefault();
  
    const token = localStorage.getItem("token");
    const formData = new FormData(event.target);
    const pqrsdData = Object.fromEntries(formData.entries());

    pqrsdData.diasHabiles = parseInt(pqrsdData.diasHabiles);

    try {
      const response = await fetch("/pqrsd", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(pqrsdData),
      });

      const result = await response.json();
  
      if (result.success) {
        alert("PQRSD registrada exitosamente, ID: ");
        // document.getElementById("pqrsd-form").reset();
      } else {
        const errorData = await response.json();
        alert("Error al registrar PQRSD: " + errorData.message);
      }
    } catch (error) {
      console.error("Error al registrar PQRSD:", error);
      alert("Error al registrar PQRSD", error);
    }
  });
  