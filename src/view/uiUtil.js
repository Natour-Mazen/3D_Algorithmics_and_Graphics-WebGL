// src/view/uiUtil.js

let doc = document;

let openMenuBtn = doc.getElementById('open_menu_btn');
let menu = doc.getElementById('menu__content');

// Selectors / Mutators
let selects = doc.getElementsByClassName('selector');
let planeToggle = doc.getElementById('plane_checkbox');
let modelColorPicker = doc.getElementById('model_color');

// Loaders
const ObjectLoader = ['bunny', 'mustang', 'porsche', 'sphere']; // 3D Models

// Set initial color from color picker
CONTROLLER.setColor(modelColorPicker.value);


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
    dropdown.classList.toggle('active');
}

/**
 * Initialize the plane toggle
 */
function initPlaneToggle() {
    planeToggle.checked = CONTROLLER.isTherePlane = true;
    planeToggle.addEventListener('input', function () {
        CONTROLLER.isTherePlane = this.checked;
    });
}

/**
 * Initialize the color picker
 */
function initColorPicker() {
    modelColorPicker.addEventListener('input', function () {
        CONTROLLER.setColor(this.value);
    });
}

/**
 * Populate the object selector
 */
function populateObjectSelector() {
    if (ObjectLoader) {
        ObjectLoader.forEach(function (ObjName) {
            const option = doc.createElement('option');
            option.value = ObjName;
            option.textContent = ObjName;
            selects[0].appendChild(option);
        });
    }
}

/**
 * Initialize the object selector
 */
function initObjectSelector() {
    selects[0].addEventListener('change', function () {
        const selectedObject = this.value;
        objectsToDraw = objectsToDraw.filter(obj => obj instanceof plane); // Keep only the plane
        if (selectedObject !== 'None') {
            CONTROLLER.setObject('res/obj/' + selectedObject + '.obj');
            objectsToDraw.push(CONTROLLER.OBJECT);
            // Set initial scale value
            updateScale(8);
        } else {
            CONTROLLER.OBJECT = null;
        }
    });
}

/**
 * Update the scale of the object
 * @param {number} scale - The new scale value
 */
function updateScale(scale) {
    CONTROLLER.setScale(scale);
    document.getElementById('scale_value').textContent = String(scale);
}

// Initialize the scale slider with default value
document.getElementById('scale_slider').addEventListener('input', function () {
    updateScale(this.value);
});



// Initialize UI components
initPlaneToggle();
initColorPicker();
populateObjectSelector();
initObjectSelector();