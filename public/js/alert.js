// public/js/alert.js
export function showAlert(message, type) {
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
    }, 4000);
}
