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
 * @type {String}
 */
let selectedHeightMapTypeBoundingBox = "None";

/**
 * @type {String}
 */
let selectedHeightMapTextureBoundingBox = "None";

/**
 * @constant {string[]}
 */
const boundingBoxHeightMapTypeLoader = ['texture1.png', 'texture2.png', 'texture3.png', 'texture4.png'];

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
let boundingBoxHeightMap_texturePathMap = null;

/**
 * @type {number}
 */
let flattenFactorBoundingBoxHeightMap = 1;

/**
 * @constant {string}
 */
const DEFAULT_BOUNDINGBOX_HEIGHTMAP_TEXTURE = 'res/textures/white.png';

/**
 * @constant {number}
 */
const DEFAULT_BOUNDINGBOX_HEIGHTMAP_SCALE = 1;



/**
 * Initializes the UI components for the height map.
 */
function initBoundingBoxUIComponents() {

    initSelector(boundingBoxElements.heightMapTypeSelector, boundingBoxHeightMapTypeLoader, function () {
        selectedHeightMapTypeBoundingBox = this.value;
        console.log("Selected height map type: " + selectedHeightMapTypeBoundingBox);
    });

    initSelector(boundingBoxElements.heightMapTextureSelector, boundingBoxHeightMapTextureLoader, function () {
        selectedHeightMapTextureBoundingBox = this.value;
        console.log("Selected height map texture: " + selectedHeightMapTextureBoundingBox);
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