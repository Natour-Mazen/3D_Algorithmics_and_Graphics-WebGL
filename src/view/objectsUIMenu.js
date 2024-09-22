// src/view/objectsUIMenu.js

const selects = doc.getElementsByClassName('selector');
const planeToggle = doc.getElementById('plane_checkbox');
const modelColorPicker = doc.getElementById('model_color');
const scaleSlider = doc.getElementById('scale_slider');
const scaleValueDisplay = doc.getElementById('scale_value');

let obj = null;
let isTherePlane = true;
const DEFAULT_SCALE = 8;

const ObjectLoader = ['bunny', 'mustang', 'porsche', 'sphere'];

function initPlaneToggle() {
    planeToggle.checked = isTherePlane = true;
    planeToggle.addEventListener('input', function () {
        isTherePlane = this.checked;
    });
}

function initObjectSelector() {
    initSelector(selects[0], ObjectLoader, function () {
        const selectedObject = this.value;
        main_objectsToDraw = main_objectsToDraw.filter(obj => !(obj instanceof objmesh));
        if (selectedObject !== 'None') {
            let objName = 'res/obj/' + selectedObject + '.obj';
            obj = new objmesh(objName);
            main_objectsToDraw.push(obj);
            obj.setColor(Color.hextoRGB(modelColorPicker.value).toArray());
            let scaleSliderValue = scaleSlider.value;
            if (scaleSliderValue === '0') {
                updateScaleOBJ(DEFAULT_SCALE);
            } else {
                updateScaleOBJ(parseInt(scaleSliderValue));
            }
        }
    });
}

function updateScaleOBJ(scale) {
    scaleValueDisplay.textContent = String(scale);
    scaleSlider.value = scale;
    obj.setScale(scale);
}

function initUIComponents() {
    initPlaneToggle();
    initColorPicker(modelColorPicker, function () {
        obj.setColor(Color.hextoRGB(this.value).toArray());
    });
    initObjectSelector();
    initSlider(scaleSlider, function () {
        if(obj !== null){
            updateScaleOBJ(this.value);
        }
    });
}

initUIComponents();