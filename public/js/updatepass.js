// deno-lint-ignore-file no-window
import { showAlert } from './alert.js';

document.getElementById('updatepass-form').addEventListener('submit', async (event) => { 
  event.preventDefault(); // Evita recargar la página

  const formData = new FormData(event.target);
  const passwordData = Object.fromEntries(formData.entries());


  try {
    const response = await fetch('/updatepass', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(passwordData),
    });

    if (response.ok) {
      showAlert('Contraseña actualizada con éxito', 'success');
      document.getElementById('updatepass-form').reset();
    } else {
      const errorData = await response.json();
      console.error('Error al actualizar contraseña:', errorData.message);
      showAlert('Error al actualizar contraseña: ' + errorData.message, 'error');
    }
  } catch (error) {
    console.error('Error al actualizar contraseña:', error);
    showAlert('Error al actualizar contraseña: ' + error, 'error');
  }
});

// Función para alternar entre mostrar y ocultar la contraseña
document.getElementById('togglePassword').addEventListener('click', function () {
  const passwordField = document.getElementById('newPassword');
  const icon = this.querySelector('i');
  
  // Alternar tipo de campo de contraseña
  if (passwordField.type === 'password') {
      passwordField.type = 'text';
      icon.classList.remove('fa-eye');
      icon.classList.add('fa-eye-slash');
  } else {
      passwordField.type = 'password';
      icon.classList.remove('fa-eye-slash');
      icon.classList.add('fa-eye');
  }
});

window.showAlert = showAlert;