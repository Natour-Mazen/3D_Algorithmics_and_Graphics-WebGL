// src/view/boundingBoxUIMenu.js
/**
 * @type {Object}
 */
const boundingBoxElements = {
    toggle: doc.getElementById('boundingBox_checkbox'),
    switch: doc.getElementById('boundingBox_switch'),
    heightMapTextureSelector: doc.getElementById('boundingBox_heightMap_texture_selector'),
};

/**
 * @type {Boolean}
 */
let isThereBoundingBox = false;

/**
 * @type {Boolean}
 */
let isWireFrameActiveBoundingBox = false;

/**
 * @type {String}
 */
let selectedHeightMapTextureBoundingBox = "None";

/**
 * @constant {string[]}
 */
const boundingBoxheightMapLoader = ['texture1.png', 'texture2.png', 'texture3.png', 'texture4.png'];


/**
 * Initializes the UI components for the height map.
 */
function initBoundingBoxUIComponents() {

    initSelector(boundingBoxElements.heightMapTextureSelector, boundingBoxheightMapLoader, function () {
        selectedHeightMapTextureBoundingBox = this.value;
        console.log("Selected height map texture: " + selectedHeightMapTextureBoundingBox);
    });

    initToggle(boundingBoxElements.toggle, isThereBoundingBox = false, function () {
        isThereBoundingBox = this.checked;
    });

    initSwitch(boundingBoxElements.switch, isWireFrameActiveBoundingBox = false, function () {
        isWireFrameActiveBoundingBox = this.checked;
    });

}

initBoundingBoxUIComponents();