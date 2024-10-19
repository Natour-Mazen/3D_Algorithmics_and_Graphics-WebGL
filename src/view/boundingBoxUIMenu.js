// src/view/boundingBoxUIMenu.js
/**
 * @type {Object}
 */
const boundingBoxElements = {
    toggle: doc.getElementById('boundingBox_checkbox'),
    switch: doc.getElementById('boundingBox_switch'),
    sizeSlider: doc.getElementById('boundingBox_size_slider'),
    sizeValueDisplay: doc.getElementById('boundingBox_size_value'),
    heightMapTypeSelector: doc.getElementById('boundingBox_heightMap_type_selector'),
    heightMapTextureSelector: doc.getElementById('boundingBox_heightMap_texture_selector'),
    heightMapFlattenSlider: doc.getElementById('boundingBox_heightMap_flatten_slider'),
    heightMapFlattenValueDisplay: doc.getElementById('boundingBox_heightMap_flatten_value'),
};

/**
 * @type {BoundingBox|null}
 */
let theBoundingBox = null;

/**
 * @type {Boolean}
 */
let isWireFrameActiveBoundingBox = false;

/**
 * @constant {string[]}
 */
const boundingBoxHeightMapTypeLoader = ['texture1.png', 'texture2.png', 'texture3.png', 'texture4.png', "texture2Colored.png"];

/**
 * @type {string[]}
 */
const boundingBoxHeightMapTextureLoader = ['poolWater.png', 'seaWater.jpg', 'circle.png', "bumpWater.jpg", "brickWall.jpg", "waterReel.jpg", "texture2Colored.png"];

/**
 * @type {string|null}
 */
let boundingBoxHeightMapType = null;

/**
 * @type {string|null}
 */
let boundingBoxHeightMapTexture = null;

/**
 *
 * @type {string}
 */
let lastSelectedBoundingBoxHeightMapTexturePath = "";


/**
 * Handles the bounding box height map selection.
 * @param {string} selectedHeightMap - The selected height map.
 * @param {string} selectionType - The selection type ('type' or 'texture').
 */
function handleBoundingBoxHeightMapSelection(selectedHeightMap, selectionType) {
    if (selectedHeightMap === 'None') {
        resetBoundingBoxHeightMapSelection(selectionType);
        return;
    }

    const path = selectionType === 'type' ? `res/heightMaps/${selectedHeightMap}` : `res/textures/${selectedHeightMap}`;
    const texture = loadTexture(gl, path);

    if (selectionType === 'type') {
        boundingBoxHeightMapType = texture;
        boundingBoxHeightMapTexture = lastSelectedBoundingBoxHeightMapTexturePath ? loadTexture(gl, lastSelectedBoundingBoxHeightMapTexturePath) : texture;
    } else {
        lastSelectedBoundingBoxHeightMapTexturePath = path;
        boundingBoxHeightMapTexture = texture;
    }
}

/**
 * Resets the bounding box height map selection.
 * @param {string} selectionType - The selection type ('type' or 'texture').
 */
function resetBoundingBoxHeightMapSelection(selectionType) {
    if (selectionType === 'type') {
        boundingBoxHeightMapType = null;
        if(lastSelectedBoundingBoxHeightMapTexturePath === ""){
            boundingBoxHeightMapTexture = null;
        }

    } else {
        lastSelectedBoundingBoxHeightMapTexturePath = "";
        boundingBoxHeightMapTexture = boundingBoxHeightMapType ? loadTexture(gl, `res/heightMaps/${boundingBoxElements.heightMapTypeSelector.value}`) : null;
    }
}

/**
 * Updates the bounding box size.
 * @param {number} value - The new size value.
 * @returns {Promise} {Promise<void>} - A promise that resolves when the bounding box has been updated.
 */
async function handleUpdateBoundingBoxSize(value) {
    if (theBoundingBox !== null) {
        theBoundingBox.setBoundingBoxHeightSize(value);
        await theBoundingBox.initAll();
    }
}


/**
 * Initializes the UI components for the height map.
 */
function initBoundingBoxUIComponents() {

    initSelector(boundingBoxElements.heightMapTypeSelector, boundingBoxHeightMapTypeLoader, function () {
        handleBoundingBoxHeightMapSelection(this.value, 'type');
    });

    initSelector(boundingBoxElements.heightMapTextureSelector, boundingBoxHeightMapTextureLoader, function () {
        handleBoundingBoxHeightMapSelection(this.value, 'texture');
    });

    initToggle(boundingBoxElements.toggle,false, async function () {
        if (this.checked) {
            theBoundingBox = new BoundingBox();
            await handleUpdateBoundingBoxSize(boundingBoxElements.sizeSlider.value);
            theBoundingBox.setBoundingBoxHeightMapFlattenFactor(boundingBoxElements.heightMapFlattenSlider.value);
            main_objectsToDraw.push(theBoundingBox);
        } else {
            main_objectsToDraw = main_objectsToDraw.filter(obj => obj !== theBoundingBox);
            theBoundingBox = null;
        }
    });

    initSwitch(boundingBoxElements.switch, isWireFrameActiveBoundingBox = false, function () {
        isWireFrameActiveBoundingBox = this.checked;
    });

    initSlider(boundingBoxElements.sizeSlider, async function () {
        await handleUpdateBoundingBoxSize(this.value);
        boundingBoxElements.sizeValueDisplay.innerHTML = this.value;
    });

    initSlider(boundingBoxElements.heightMapFlattenSlider, function () {
        if(theBoundingBox !== null){
            theBoundingBox.setBoundingBoxHeightMapFlattenFactor(this.value);
            boundingBoxElements.heightMapFlattenValueDisplay.innerHTML = this.value;
        }
    });

    // Set the Parent Style for this specific element switch
    const switchElementParent = boundingBoxElements.switch.parentElement;
    if (switchElementParent) {
        switchElementParent.style.margin = '0 62px';
    }
}

initBoundingBoxUIComponents();