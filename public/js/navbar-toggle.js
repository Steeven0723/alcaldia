document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.getElementById("sidebar");
    const sidebarToggle = document.getElementById("sidebarToggle");

    if (sidebarToggle) {
        sidebarToggle.addEventListener("click", () => {
            sidebar.classList.toggle("hidden");
        });
    } else {
        console.error("El botón #sidebarToggle no se encontró en el DOM.");
    }

    const userMenuButton = document.getElementById("userMenuButton");
    const userMenuDropdown = document.getElementById("userMenuDropdown");

    if (userMenuButton) {
        userMenuButton.addEventListener("click", () => {
            userMenuDropdown.classList.toggle("hidden");
        });

        document.addEventListener("click", (event) => {
            if (
                !userMenuButton.contains(event.target) &&
                !userMenuDropdown.contains(event.target)
            ) {
                userMenuDropdown.classList.add("hidden");
            }
        });
    }
});
