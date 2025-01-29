function toggleAccordion(button, submenuId) {
    const submenu = document.getElementById(submenuId);
    const icon = button.querySelector('svg');
    
    // Cierra cualquier acordeón abierto
    const openSubmenus = document.querySelectorAll('.submenu:not(.hidden)');
    openSubmenus.forEach((openSubmenu) => {
        if (openSubmenu !== submenu) {
            openSubmenu.classList.add('hidden');
            openSubmenu.previousElementSibling.querySelector('svg').classList.remove('rotate-180');
        }
    });

    // Togglear el acordeón actual
    submenu.classList.toggle('hidden');
    icon.classList.toggle('rotate-180');
}