// src/view/objectsUIMenu.js

const objectsElements = {
    selector: doc.getElementById('models_select'),
    planeToggle: doc.getElementById('plane_checkbox'),
    colorPicker: doc.getElementById('model_color'),
    scaleSlider: doc.getElementById('scale_slider'),
    scaleValueDisplay: doc.getElementById('scale_value')
};

let obj = null;
let isTherePlane = true;
const DEFAULT_OBJSCALE = 8;
const ObjectLoader = ['bunny', 'mustang', 'porsche', 'sphere'];


/**
 * Handles the selection of an object from the dropdown.
 * @param {string} selectedObject - The name of the selected object.
 */
function handleObjectSelection(selectedObject) {
    main_objectsToDraw = main_objectsToDraw.filter(obj => !(obj instanceof objmesh));
    if (selectedObject !== 'None') {
        let objName = 'res/obj/' + selectedObject + '.obj';
        obj = new objmesh(objName);
        main_objectsToDraw.push(obj);
        obj.setColor(Color.hextoRGB(objectsElements.colorPicker.value).toArray());
        let scaleSliderValue = objectsElements.scaleSlider.value;
        if (typeof scaleSliderValue === 'string' || scaleSliderValue === 0) {
            updateScaleOBJ(DEFAULT_OBJSCALE);
        } else {
            updateScaleOBJ(scaleSliderValue);
        }
    }
}

/**
 * Updates the plane toggle checkbox to reflect the current state.
 */
function updatePlaneToggle() {
    objectsElements.planeToggle.checked = isTherePlane;
}


/**
 * Sets the state of the plane and updates the toggle checkbox.
 * @param {boolean} state - The new state of the plane.
 */
function setPlaneState(state) {
    isTherePlane = state;
    updatePlaneToggle();
}

/**
 * Updates the scale of the selected object.
 * @param {number} scale - The new scale value.
 */
function updateScaleOBJ(scale) {
    objectsElements.scaleValueDisplay.textContent = String(scale);
    objectsElements.scaleSlider.value = scale;
    obj.setScale(scale);
}

/**
 * Initializes the UI components for object manipulation.
 */
function initObjectsUIComponents() {
    initToggle(objectsElements.planeToggle, true, function () {
        isTherePlane = this.checked;
    });
    initColorPicker(objectsElements.colorPicker, function () {
        if (obj !== null) {
            obj.setColor(Color.hextoRGB(this.value).toArray());
        }
    });
    initSelector(objectsElements.selector, ObjectLoader, function () {
        handleObjectSelection(this.value);
    });
    initSlider(objectsElements.scaleSlider, function () {
        if (obj !== null) {
            updateScaleOBJ(this.value);
        }
    });
}

initObjectsUIComponents();