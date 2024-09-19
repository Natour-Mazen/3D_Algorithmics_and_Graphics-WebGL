// src/view/utilsUI.js

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
 * Initialize a selector with options and an event listener.
 * @param {HTMLElement} selector - The selector element.
 * @param {Array} options - The options to populate the selector with.
 * @param {Function} onChange - The event listener for the change event.
 */
function initSelector(selector, options, onChange) {
    options.forEach(function (optionName) {
        const option = document.createElement('option');
        const nameWithoutExtension = optionName.split('.')[0];
        option.value = optionName;
        option.textContent = nameWithoutExtension;
        selector.appendChild(option);
    });
    selector.addEventListener('change', onChange);
}

/**
 * Initialize a color picker with an event listener.
 * @param {HTMLElement} colorPicker - The color picker element.
 * @param {Function} onInput - The event listener for the input event.
 */
function initColorPicker(colorPicker, onInput) {
    colorPicker.addEventListener('input', onInput);
}

/**
 * Initialize a slider with an event listener.
 * @param {HTMLElement} slider - The slider element.
 * @param {Function} onInput - The event listener for the input event.
 * @param {number} defaultValue - The default value for the slider.
 */
function initSlider(slider, onInput, defaultValue = 0) {
    slider.addEventListener('input', onInput);
    slider.value = defaultValue;
}



