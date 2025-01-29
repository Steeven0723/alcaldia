const sidebar = document.getElementById("sidebar");
const toggleSidebar = document.getElementById("toggleSidebar");
const sidebarToggle = document.getElementById("sidebarToggle");

toggleSidebar.addEventListener("click", () => {
    sidebar.classList.toggle("lg:w-64");
    sidebar.classList.toggle("lg:w-16");
    document
        .querySelectorAll("#sidebar a span, #sidebar h1")
        .forEach((el) => el.classList.toggle("lg:hidden"));
    toggleSidebar.querySelector("i").classList.toggle("fa-chevron-left");
    toggleSidebar.querySelector("i").classList.toggle("fa-chevron-right");
});

sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("hidden");
});

const userMenuButton = document.getElementById("userMenuButton");
const userMenuDropdown = document.getElementById("userMenuDropdown");

userMenuButton.addEventListener("click", () => {
    userMenuDropdown.classList.toggle("hidden");
});

// Close the dropdown when clicking outside
document.addEventListener("click", (event) => {
    if (
        !userMenuButton.contains(event.target) &&
        !userMenuDropdown.contains(event.target)
    ) {
        userMenuDropdown.classList.add("hidden");
    }
});
