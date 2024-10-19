// src/view/boundingBoxUIMenu.js
/**
 * @type {Object}
 */
const boundingBoxElements = {
    toggle: doc.getElementById('boundingBox_checkbox'),
    switch: doc.getElementById('boundingBox_switch'),
    heightMapTypeSelector: doc.getElementById('boundingBox_heightMap_type_selector'),
    heightMapTextureSelector: doc.getElementById('boundingBox_heightMap_texture_selector'),
    heightMapScaleSlider: doc.getElementById('boundingBox_heightMap_scale_slider'),
    heightMapScaleValueDisplay: doc.getElementById('boundingBox_heightMap_scale_value'),
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
const boundingBoxHeightMapTypeLoader = ['texture1.png', 'texture2.png', 'texture3.png', 'texture4.png'];

/**
 * @type {string[]}
 */
const boundingBoxHeightMapTextureLoader = ['poolWater.png', 'seaWater.jpg', 'circle.png', "bumpWater.jpg", "brickWall.jpg", "waterReel.jpg"];

/**
 * @type {string|null}
 */
let boundingBoxHeightMapType = null;

/**
 * @type {string|null}
 */
let boundingBoxHeightMapTexture = null;

/**
 * @type {number}
 */
let flattenFactorBoundingBoxHeightMap = 1;

/**
 * @constant {string}
 */
const DEFAULT_BOUNDINGBOX_HEIGHTMAP_TEXTURE = 'res/textures/white.png';

/**
 * @constant {string}
 */
const DEFAULT_BOUNDINGBOX_HEIGHTMAP_TYPE = 'res/heightMaps/texture1.png';

/**
 * @constant {number}
 */
const DEFAULT_BOUNDINGBOX_HEIGHTMAP_SCALE = 1;

function handleBoundingBoxHeightMapSelection(selectedHeightMap, selectionType) {
    if (selectedHeightMap !== 'None') {
        if (selectionType === 'type') {
            const boundingBoxHeightMapPath = `res/heightMaps/${selectedHeightMap}`;
            boundingBoxHeightMapType = loadTexture(gl, boundingBoxHeightMapPath);
        } else if (selectionType === 'texture') {
            const boundingBoxHeightMapTexturePath = `res/textures/${selectedHeightMap}`;
            boundingBoxHeightMapTexture = loadTexture(gl, boundingBoxHeightMapTexturePath);
        }

        if (boundingBoxHeightMapTexture === null) {
            boundingBoxHeightMapTexture = loadTexture(gl, DEFAULT_BOUNDINGBOX_HEIGHTMAP_TEXTURE);
        }
    } else {
        if (selectionType === 'type') {
            boundingBoxHeightMapType = null;
           // boundingBoxHeightMapType = loadTexture(gl, DEFAULT_BOUNDINGBOX_HEIGHTMAP_TYPE);
        } else if (selectionType === 'texture') {
            boundingBoxHeightMapTexture = null;
           // boundingBoxHeightMapTexture = loadTexture(gl, DEFAULT_BOUNDINGBOX_HEIGHTMAP_TEXTURE);
            //boundingBoxHeightMapTexture = DEFAULT_BOUNDINGBOX_HEIGHTMAP_TEXTURE;
        }

    }
}


/**
 * Initializes the UI components for the height map.
 */
function initBoundingBoxUIComponents() {

    initSelector(boundingBoxElements.heightMapTypeSelector, boundingBoxHeightMapTypeLoader, function () {
        console.log("Selected height map type: " + this.value);
        handleBoundingBoxHeightMapSelection(this.value, 'type');
    });

    initSelector(boundingBoxElements.heightMapTextureSelector, boundingBoxHeightMapTextureLoader, function () {
        console.log("Selected height map texture: " + this.value);
        handleBoundingBoxHeightMapSelection(this.value, 'texture');
    });

    initToggle(boundingBoxElements.toggle,false, function () {
        if(this.checked){
            theBoundingBox = new BoundingBox();
            main_objectsToDraw.push(theBoundingBox);
        }else {
            main_objectsToDraw = main_objectsToDraw.filter(obj => obj !== theBoundingBox);
            theBoundingBox = null;
        }
    });

    initSwitch(boundingBoxElements.switch, isWireFrameActiveBoundingBox = false, function () {
        isWireFrameActiveBoundingBox = this.checked;
    });

}

initBoundingBoxUIComponents();