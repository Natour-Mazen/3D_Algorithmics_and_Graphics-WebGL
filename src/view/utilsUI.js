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
 * close all dropdowns and hide the collapse button
 * @param evt
 */
function closeAllDropdowns(evt) {
    evt.stopPropagation(); // Prevent the event from bubbling up to the header
    openDropdowns.forEach(dropdown => {
        const caret = dropdown.querySelector('.caret');
        dropdown.classList.remove('active');
        caret.classList.remove('up');
        caret.classList.add('down');
    });
    openDropdowns.length = 0; // Clear the array
    updateCollapseButtonVisibility();
}

/**
 * Update the visibility of the collapse button
 */
function updateCollapseButtonVisibility() {
    const collapseButton = document.getElementById('close_all_dropdowns_btn');
    collapseButton.style.display = openDropdowns.length > 0 ? 'block' : 'none';
}

/**
 * Initialize an event listener for the load event to update the visibility of the collapse button.
 */
window.addEventListener('load', updateCollapseButtonVisibility);

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

/**
 * Initialize a toggle with an event listener.
 * @param {HTMLElement} toggleElement - The toggle element.
 * @param {boolean} initialState - The initial state of the toggle.
 * @param {Function} onChange - The event listener for the input event.
 */
function initToggle(toggleElement, initialState, onChange) {
    toggleElement.checked = initialState;
    toggleElement.addEventListener('input', onChange);
}

/**
 * Initialize a switch with an event listener.
 * @param {HTMLElement} switchElement - The switch element.
 * @param {boolean} initialState - The initial state of the switch.
 * @param {Function} onChange - The event listener for the change event.
 */
function initSwitch(switchElement, initialState, onChange) {
   switchElement.checked = initialState;
   switchElement.addEventListener('change', onChange);
}
