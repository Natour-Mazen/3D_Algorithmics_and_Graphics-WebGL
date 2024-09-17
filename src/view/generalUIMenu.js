// src/view/generalUIMenu.js
let doc = document;

// Selectors
const openMenuBtn = doc.getElementById('open_menu_btn');
const menu = doc.getElementById('menu__content');
/**
 * Open the Menu
 */
function openMenu() {
    toggleMenuVisibility(true);
}

/**
 * Close the Menu
 */
function closeMenu() {
    toggleMenuVisibility(false);
}

/**
 * Toggle Menu Visibility
 * @param {boolean} isVisible - Whether the menu should be visible
 */
function toggleMenuVisibility(isVisible) {
    openMenuBtn.style.display = isVisible ? 'none' : 'block';
    menu.classList.toggle('active', isVisible);
}

/**
 * Open / Close a dropdown menu
 * @param {Event} evt - The on-click event
 */
function toggleDropdown(evt) {
    const header = evt.target;
    const dropdown = header.closest('.dropdown');
    const caret = header.querySelector('.caret');
    dropdown.classList.toggle('active');
    caret.classList.toggle('up', dropdown.classList.contains('active'));
    caret.classList.toggle('down', !dropdown.classList.contains('active'));
}