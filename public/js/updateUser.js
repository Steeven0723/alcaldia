//  public/js/updateUser.js
// deno-lint-ignore-file no-window

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    window.userId = urlParams.get('id'); // Guardar userId en una variable global
  
    if (window.userId) {
      // Fetch user data based on userId
      try {
        const response = await fetch(`/getUser/${window.userId}`); // Usar window.userId
        const user = await response.json();
  
        if (user.success) {
          // Populate the form with user data
          document.getElementById('id_usuario').value = window.userId;
          document.getElementById('name').value = user.data.nombre;
          document.getElementById('email').value = user.data.email;
          document.getElementById('cedula').value = user.data.cedula;
          document.getElementById('telefono').value = user.data.telefono;
          document.getElementById('id_dependencia').value = user.data.id_dependencia;
          document.getElementById('role').value = user.data.role;
  
        } else {
          console.error("Error al recuperar los datos del usuario:", user.message);
          // Handle error, e.g., display an error message
        }
      } catch (error) {
        console.error("Error al recuperar los datos del usuario:", error);
      }
    } else {
      console.error("ID de usuario no facilitado.");
    }
  });
  
  document.getElementById('edit-user-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evitar que se recargue la página
  
    const formData = new FormData(event.target);
    const userData = Object.fromEntries(formData.entries());
  
    // Usar window.userId en lugar de userId
    try {
      const response = await fetch(`/updateUser/${window.userId}`, { // Ruta para actualizar usuario
        method: 'PUT', // Método PUT para actualizar
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData),
      });
  
      if (response.ok) {
        alert('Usuario actualizado con éxito');
        // Redirigir a la página de lista de usuarios o hacer alguna otra acción
        window.location.href = '/admin/user/index.html';
      } else {
        const errorData = await response.json();
        console.error('Error al actualizar usuario:', errorData.message);
        alert('Error al actualizar usuario: ' + errorData.message);
      }
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      alert('Error al actualizar usuario: ' + error);
    }
  });
  
