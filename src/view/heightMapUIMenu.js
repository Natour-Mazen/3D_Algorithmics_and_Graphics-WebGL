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
 * @type {Object[]}
 */
const heightMapLoader = [
    { value: 'texture1.png', name: 'texture1'},
    { value: 'texture2.png', name: 'texture2'},
    { value: 'texture3.png', name: 'texture3'},
    { value: 'texture4.png', name: 'texture4'},
    { value: 'texture10.png', name: 'texture5'},
    { value: 'texture11.png', name: 'texture6'},
    { value: 'texture12.png', name: 'texture7'},
    { value: 'texture13.png', name: 'texture8'},
    { value: 'texture14.png', name: 'texture9'},
    { value: 'texture15.png', name: 'texture10'},
];

/**
 * @type {string[]}
 */
const heightMapTextureLoader = ['poolWater.png', 'seaWater.jpg', 'circle.png', "bumpWater.jpg", "brickWall.jpg", "waterReel.jpg"];

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
 *
 * @type {string}
 */
let lastSelectedHeightMapTexturePath = "";


/**
 * Handles the creation of a new height map.
 */
function handleCreateHeightMap() {
    main_objectsToDraw = main_objectsToDraw.filter(obj => !(obj instanceof HeightMap));
    theHeightMap = new HeightMap();

    main_objectsToDraw.push(theHeightMap);

    if(isTherePlane) {
        setPlaneState(false);
    }
}


/**
 * Handles the selection of a height map.
 * @param {string} selectedHeightMap - The selected height map.
 * @param {string} selectionType - The type of selection ('type' or 'texture').
 */
function handleHeightMapSelection(selectedHeightMap, selectionType) {
    if (selectedHeightMap === 'None') {
        resetHeightMapSelection(selectionType);
        return;
    }

    const path = selectionType === 'type' ? `res/heightMaps/${selectedHeightMap}` : `res/textures/${selectedHeightMap}`;

    if (selectionType === 'type') {
        heightMapType = path;
        heightMap_texturePathMap = lastSelectedHeightMapTexturePath ? lastSelectedHeightMapTexturePath : path;
    } else {
        lastSelectedHeightMapTexturePath = path;
        heightMap_texturePathMap = path;
    }

    if (heightMapType !== null) {
        handleCreateHeightMap();
        let scaleSliderValue = heightMapElements.scaleSlider.value;
        updateScaleHeightMap(scaleSliderValue);
    }
}

/**
 * Resets the height map selection.
 * @param {string} selectionType - The type of selection ('type' or 'texture').
 */
function resetHeightMapSelection(selectionType) {
    if (selectionType === 'type') {
        main_objectsToDraw = main_objectsToDraw.filter(obj => !(obj instanceof HeightMap));
        heightMapType = null;
        if(!isTherePlane) {
            setPlaneState(true);
        }
    } else {
        lastSelectedHeightMapTexturePath = "";
        heightMap_texturePathMap = heightMapType ?`res/heightMaps/${heightMapElements.selector.value}` : null;
        if(heightMapType !== null) {
            handleCreateHeightMap();
            let scaleSliderValue = heightMapElements.scaleSlider.value;
            updateScaleHeightMap(scaleSliderValue);
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
    } else {
        heightMapTextureSelectorItem.style.display = 'block';
    }

    if (heightMapType !== null) {
        heightMap_texturePathMap = lastSelectedHeightMapTexturePath === "" ?
            `res/heightMaps/${heightMapElements.selector.value}` : lastSelectedHeightMapTexturePath;
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

    initGenericObjectSelector(
        heightMapElements.selector,
        heightMapLoader,
        function () {
            handleHeightMapSelection(this.value, 'type');
        },
        'value', // Property to use for option value
        'name', // Property to use for option text content
        { } // Additional data attributes
    );

    
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