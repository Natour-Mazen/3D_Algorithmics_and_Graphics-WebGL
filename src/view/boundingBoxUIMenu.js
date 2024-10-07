// src/view/boundingBoxUIMenu.js

const boundingBoxElements = {
    toggle: doc.getElementById('boundingBox_checkbox'),
    switch: doc.getElementById('boundingBox_switch'),
    heightMapTextureSelector: doc.getElementById('boundingBox_heightMap_texture_selector'),
};


let isThereBoundingBox = false;
let isWireFrameActiveBoundingBox = false;
let selectedHeightMapTextureBoundingBox = "None";

const boundingBoxheightMapLoader = ['texture1.png', 'texture2.png', 'texture3.png', 'texture4.png'];


/**
 * Initializes the UI components for the height map.
 */
function initBoundingBoxUIComponents() {

    initSelector(boundingBoxElements.heightMapTextureSelector, boundingBoxheightMapLoader, function () {
        selectedHeightMapTextureBoundingBox = this.value;
        console.log("Selected height map texture: " + heightMapTextureBoundingBox);
    });

    initToggle(boundingBoxElements.toggle, isThereBoundingBox = false, function () {
        isThereBoundingBox = this.checked;
    });

    initSwitch(boundingBoxElements.switch, isWireFrameActiveBoundingBox = false, function () {
        isWireFrameActiveBoundingBox = this.checked;
    });

}

initBoundingBoxUIComponents();