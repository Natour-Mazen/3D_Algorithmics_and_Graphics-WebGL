// src/view/boundingBoxUIMenu.js
/**
 * @type {Object}
 */
const boundingBoxElements = {
    toggle: doc.getElementById('boundingBox_checkbox'),
    borderSelector: doc.getElementById('borderBoundingBox_selector'),
    sizeSlider: doc.getElementById('boundingBox_size_slider'),
    sizeValueDisplay: doc.getElementById('boundingBox_size_value'),
    heightMapTypeSelector: doc.getElementById('boundingBox_heightMap_type_selector'),
    heightMapTextureSelector: doc.getElementById('boundingBox_heightMap_texture_selector'),
    heightMapRenderingSwitch: doc.getElementById('boundingBox_heightMap_switch'),
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
 * @type {Boolean}
 */
let isOpaqueActiveBoundingBox = false;

/**
 * @type {Boolean}
 */
let isColoredBoundingBoxHeightMapType = false;

/**
 * @constant {Object[]}
 */
const boundingBoxHeightMapTypeLoader = [
    { value: 'texture1.png', name: 'texture1_RGB', isColor: false },
    { value: 'texture2.png', name: 'texture2_RGB', isColor: false },
    { value: 'texture3.png', name: 'texture3_RGB', isColor: false },
    { value: 'texture4.png', name: 'texture4_RGB', isColor: false },
    { value: 'texture5.png', name: 'texture5_LAB', isColor: true },
    { value: 'texture6.png', name: 'texture6_LAB', isColor: true },
    { value: 'texture7.png', name: 'texture7_LAB', isColor: true },
    { value: 'texture8.png', name: 'texture8_LAB', isColor: true },
    { value: 'texture14.png', name: 'texture9_LAB', isColor: true },
    { value: 'texture10.png', name: 'texture10_LAB', isColor: true },
    { value: 'texture10.png', name: 'texture10_RGB', isColor: false },
    { value: 'texture15.png', name: 'texture11_LAB', isColor: true },
    { value: 'hazelnut.png', name: 'hazelnut', isColor: true }
];

/**
 * @type {string[]}
 */
const boundingBoxHeightMapTextureLoader = ['poolWater.png', 'seaWater.jpg', 'circle.png', "bumpWater.jpg", "brickWall.jpg", "waterReel.jpg"];

/**
 * @type {string[]}
 */
const boundingBoxBorderLoader = ['WireFrame', 'Opaque'];

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
 * Handles the display of the height map texture selector.
 * @param {string} value - The display value ('block' or 'none').
 */
function handleDisplayBoundingBoxHeightMapTextureSelector(value) {
    const element = boundingBoxElements.heightMapTextureSelector.closest('.row');
    element.style.display = value;
}

/**
 * Initializes the UI components for the height map.
 */
function initBoundingBoxUIComponents() {

    initToggle(boundingBoxElements.toggle,false, async function () {
        if (this.checked) {
            theBoundingBox = new BoundingBox();
            await handleUpdateBoundingBoxSize(boundingBoxElements.sizeSlider.value);
            theBoundingBox.setBoundingBoxHeightMapFlattenFactor(boundingBoxElements.heightMapFlattenSlider.value);
            main_objectsToDraw.push(theBoundingBox);
            if(isTherePlane){
                setPlaneState(false);
            }
        } else {
            main_objectsToDraw = main_objectsToDraw.filter(obj => obj !== theBoundingBox);
            theBoundingBox = null;
            if(!isTherePlane){
                setPlaneState(true);
            }
        }
    });

    initSelector(boundingBoxElements.borderSelector, boundingBoxBorderLoader, function () {
        if(this.value === 'WireFrame'){
            isWireFrameActiveBoundingBox = true;
            isOpaqueActiveBoundingBox = false;
        } else if (this.value === 'Opaque'){
            isWireFrameActiveBoundingBox = false;
            isOpaqueActiveBoundingBox = true;
        } else {
            isWireFrameActiveBoundingBox = false;
            isOpaqueActiveBoundingBox = false;
        }
    });

    initSlider(boundingBoxElements.sizeSlider, async function () {
        await handleUpdateBoundingBoxSize(this.value);
        boundingBoxElements.sizeValueDisplay.innerHTML = this.value;
    });

    initGenericObjectSelector(
        boundingBoxElements.heightMapTypeSelector,
        boundingBoxHeightMapTypeLoader,
        function () {
            const selectedOption = this.options[this.selectedIndex];
            const isColor = selectedOption.dataset.isColor === 'true'; // Convert to boolean
            isColoredBoundingBoxHeightMapType = isColor;
            if (isColor || this.value === 'None') {
                lastSelectedBoundingBoxHeightMapTexturePath = "";
                boundingBoxElements.heightMapTextureSelector.value = 'None';
                handleDisplayBoundingBoxHeightMapTextureSelector('none');
            } else {
                handleDisplayBoundingBoxHeightMapTextureSelector('block');
            }
            handleBoundingBoxHeightMapSelection(this.value, 'type');
        },
        'value', // Property to use for option value
        'name', // Property to use for option text content
        { isColor: 'isColor' } // Additional data attributes
    );

    initSelector(boundingBoxElements.heightMapTextureSelector, boundingBoxHeightMapTextureLoader, function () {
        handleBoundingBoxHeightMapSelection(this.value, 'texture');
    });

    initSlider(boundingBoxElements.heightMapFlattenSlider, function () {
        if(theBoundingBox !== null){
            theBoundingBox.setBoundingBoxHeightMapFlattenFactor(this.value);
            boundingBoxElements.heightMapFlattenValueDisplay.innerHTML = this.value;
        }
    });

    handleDisplayBoundingBoxHeightMapTextureSelector('none');
}

initBoundingBoxUIComponents();