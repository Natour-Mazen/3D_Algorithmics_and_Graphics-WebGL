// src/view/heightMapUIMenu.js
/**
 * @type {Object}
 */
const heightMapElements = {
    toggle: doc.getElementById('heightMap_checkbox'),
    selector: doc.getElementById('heightMap_selector'),
    textureSelector: doc.getElementById('heightMap_texture_selector'),
    scaleSlider: doc.getElementById('heightMap_scale_slider'),
    scaleValueDisplay: doc.getElementById('heightMap_scale_value'),
    flattenSlider: doc.getElementById('heightMap_flatten_slider'),
    flattenValueDisplay: doc.getElementById('heightMap_flatten_value'),
    switch: document.getElementById('heightMap_switch'),
};

/**
 * @type {string[]}
 */
const heightMapLoader = ['texture1.png', 'texture2.png', 'texture3.png', 'texture4.png'];

/**
 * @type {string[]}
 */
const heightMapTextureLoader = ['poolWater.png', 'seaWater.jpg', 'circle.png', "bumpWater.jpg", "brickWall.jpg", "waterReel.jpg", "texture2Colored.png"];

/**
 * @type {HeightMap|null}
 */
let theHeightMap = null;

/**
 * @type {string|null}
 */
let heightMapType = null;

/**
 * @type {string|null}
 */
let heightMap_texturePathMap = null;

/**
 * @type {boolean}
 */
let isWireFrameActiveHeightMap = false;

/**
 * @type {number}
 */
let flattenFactorHeightMap = 1;

/**
 * @constant {string}
 */
const DEFAULT_HEIGHTMAP_TEXTURE = 'res/textures/white.png';

/**
 * @constant {number}
 */
const DEFAULT_HEIGHTMAP_SCALE = 1;


/**
 * Handles the creation of a new height map.
 */
function handleCreateHeightMap() {
    main_objectsToDraw = main_objectsToDraw.filter(obj => !(obj instanceof HeightMap));
    theHeightMap = new HeightMap();

    main_objectsToDraw.push(theHeightMap);
}


/**
 * Handles the selection of a height map.
 * @param {string} selectedHeightMap - The selected height map.
 * @param {string} selectionType - The type of selection ('type' or 'texture').
 */
function handleHeightMapSelection(selectedHeightMap, selectionType) {
    main_objectsToDraw = main_objectsToDraw.filter(obj => !(obj instanceof HeightMap));
    if (selectedHeightMap !== 'None') {
        if (selectionType === 'type') {
            heightMapType = `res/heightMaps/${selectedHeightMap}`;
        } else if (selectionType === 'texture') {
            heightMap_texturePathMap = `res/textures/${selectedHeightMap}`;
        }

        if (heightMap_texturePathMap === null) {
            heightMap_texturePathMap = DEFAULT_HEIGHTMAP_TEXTURE;
        }
    } else {
        if (selectionType === 'type') {
            heightMapType = null;
        } else if (selectionType === 'texture') {
            heightMap_texturePathMap = DEFAULT_HEIGHTMAP_TEXTURE;
        }
    }

    if (heightMapType !== null) {
        handleCreateHeightMap();
        let scaleSliderValue = heightMapElements.scaleSlider.value;
        if (scaleSliderValue === '0') {
            updateScaleHeightMap(DEFAULT_HEIGHTMAP_SCALE);
        } else {
            updateScaleHeightMap(parseInt(scaleSliderValue));
        }
    }
}

/**
 * Updates the scale of the height map.
 * @param {number} scale - The new scale value.
 */
function updateScaleHeightMap(scale) {
    if (theHeightMap !== null) {
        heightMapElements.scaleValueDisplay.textContent = String(scale);
        heightMapElements.scaleSlider.value = scale;
        theHeightMap.setScale(scale);
    }
}

/**
 * Handles the switch for the height map.
 */
function handleHeightMapSwitch() {
    const heightMapTextureSelectorItem = heightMapElements.textureSelector.closest('.row');

    if (heightMapElements.switch.checked) {
        heightMapTextureSelectorItem.style.display = 'none';
        heightMapElements.textureSelector.value = 'None';
    } else {
        heightMapTextureSelectorItem.style.display = 'block';
    }

    if (heightMapType !== null) {
        heightMap_texturePathMap = DEFAULT_HEIGHTMAP_TEXTURE;
        handleCreateHeightMap();
        updateScaleHeightMap(heightMapElements.scaleSlider.value);
    }
}

/**
 * Initializes the UI components for the height map.
 */
function initHeightMapUIComponents() {

    initToggle(heightMapElements.toggle, isWireFrameActiveHeightMap = false, function () {
        isWireFrameActiveHeightMap = this.checked;
    });

    initSelector(heightMapElements.selector, heightMapLoader, function () {
        handleHeightMapSelection(this.value, 'type');
    });

    initSelector(heightMapElements.textureSelector, heightMapTextureLoader, function () {
        handleHeightMapSelection(this.value, 'texture');
    });

    initSlider(heightMapElements.scaleSlider, function () {
        updateScaleHeightMap(this.value);
    });

    initSlider(heightMapElements.flattenSlider, function () {
        heightMapElements.flattenValueDisplay.textContent = this.value;
        flattenFactorHeightMap = this.value;
        if (heightMapType !== null) {
            handleCreateHeightMap();
            updateScaleHeightMap(heightMapElements.scaleSlider.value);
        }
    });

    initSwitch(heightMapElements.switch, false, function () {
        handleHeightMapSwitch();
    });

    // call the function to handle the switch state the first time, to display the right elements.
    handleHeightMapSwitch();
}

initHeightMapUIComponents();