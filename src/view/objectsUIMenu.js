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
const DEFAULT_SCALE = 8;
const ObjectLoader = ['bunny', 'mustang', 'porsche', 'sphere'];


function handleObjectSelection(selectedObject) {
    main_objectsToDraw = main_objectsToDraw.filter(obj => !(obj instanceof objmesh));
    if (selectedObject !== 'None') {
        let objName = 'res/obj/' + selectedObject + '.obj';
        obj = new objmesh(objName);
        main_objectsToDraw.push(obj);
        obj.setColor(Color.hextoRGB(objectsElements.colorPicker.value).toArray());
        let scaleSliderValue = objectsElements.scaleSlider.value;
        if (scaleSliderValue === '0') {
            updateScaleOBJ(DEFAULT_SCALE);
        } else {
            updateScaleOBJ(parseInt(scaleSliderValue));
        }
    }
}

function updateScaleOBJ(scale) {
    objectsElements.scaleValueDisplay.textContent = String(scale);
    objectsElements.scaleSlider.value = scale;
    obj.setScale(scale);
}

function initUIComponents() {
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

initUIComponents();