// src/view/objectsUIMenu.js

// doc is initialized as a reference to the document object in the global scope (aka generalUIMenu.js file).

const selects = doc.getElementsByClassName('selector');
const planeToggle = doc.getElementById('plane_checkbox');
const modelColorPicker = doc.getElementById('model_color');
const scaleSlider = doc.getElementById('scale_slider');
const scaleValueDisplay = doc.getElementById('scale_value');

// Variables
let obj = null;
let isTherePlane = true;
const DEFAULT_SCALE = 8;

// Loaders
const ObjectLoader = ['bunny', 'mustang', 'porsche', 'sphere']; // 3D Models


/**
 * Initialize the plane toggle
 */
function initPlaneToggle() {
    planeToggle.checked = isTherePlane = true;
    planeToggle.addEventListener('input', function () {
        isTherePlane = this.checked;
    });
}

/**
 * Initialize the color picker
 */
function initColorPicker() {
    modelColorPicker.addEventListener('input', function () {
        obj.setColor(Color.hextoRGB(this.value).toArray());
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
        main_objectsToDraw = main_objectsToDraw.filter(obj => obj instanceof plane); // Keep only the plane
        if (selectedObject !== 'None') {
            let objName = 'res/obj/' + selectedObject + '.obj';
            obj = new objmesh(objName);
            main_objectsToDraw.push(obj);
            obj.setColor(Color.hextoRGB(modelColorPicker.value).toArray());
            let scaleSliderValue = scaleSlider.value;
            if (scaleSliderValue === '0') {
                updateScale(DEFAULT_SCALE);
            } else {
                updateScale(parseInt(scaleSliderValue));
            }
        }
    });
}

/**
 * Update the scale of the object
 * @param {number} scale - The new scale value
 */
function updateScale(scale) {
    scaleValueDisplay.textContent = String(scale);
    scaleSlider.value = scale;
    obj.setScale(scale);
}

/**
 * Initialize the scale slider
 */
function initScaleSlider() {
    scaleSlider.addEventListener('input', function () {
        updateScale(this.value);
    });
    scaleSlider.value = 0;
}

/**
 * Initialize UI components
 */
function initUIComponents() {
    initPlaneToggle();
    initColorPicker();
    populateObjectSelector();
    initObjectSelector();
    initScaleSlider();

}

// Initialize UI components
initUIComponents();