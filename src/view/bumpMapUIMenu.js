// src/view/bumpMapUIMenu.js
/**
 * @type {Object}
 */
const bumpMapElements = {
    selector: doc.getElementById('bump_map_selector'),
    textureSelector: doc.getElementById('bump_map_texture_selector'),
};

/**
 * @type {string|null}
 */
let bumpMapType = null;

/**
 * @type {WebGLTexture|null}
 */
let texture_ForBump = null;

/**
 * @type {BumpMap|null}
 */
let theBumpMap = null;

/**
 * @type {string[]}
 */
const bumpMapLoader = ["brickNM2.png", "circleNM.png", "bumpWaterNM.jpg", "brickWallNM.jpg", "waterReelNM.jpg", "testNM.png"];

/**
 * @type {string[]}
 */
const bumpMapTextureLoader = ["white.png",'circle.png', "bumpWater.jpg", "brickWall.jpg", "waterReel.jpg"];

/**
 * @type {string}
 */
let selectedBumpMap = "None";

/**
 * @type {string}
 */
let selectedBumpMapTexture = "None";

/**
 * Handles the creation of the bump map.
 */
function handleBumpMapCreation() {
    resetBumpMap();
    if (selectedBumpMapTexture === "None") {
        resetBumpMapSettings();
    } else {
        loadBumpMapTextures();
        bindShader();
        main_objectsToDraw.push(theBumpMap);
    }
}

/**
 * Resets the bump map.
 */
function resetBumpMap() {
    main_objectsToDraw = main_objectsToDraw.filter(obj => !(obj instanceof BumpMap));
}

/**
 * Resets the bump map settings.
 */
function resetBumpMapSettings() {
    bumpMapType = null;
    texture_ForBump = null;
    setPlaneState(true);
}

/**
 * Loads the textures for the bump map.
 */
function loadBumpMapTextures() {
    const texturePath = `res/textures/${selectedBumpMapTexture}`;
    texture_ForBump = loadTexture(gl, texturePath);

    if (selectedBumpMap !== "None") {
        const bumpMapPath = `res/bumpMaps/${selectedBumpMap}`;
        bumpMapType = loadTexture(gl, bumpMapPath);
    }
}

/**
 * Binds the shader for the bump map.
 */
function bindShader() {
    if(isTherePlane){
        setPlaneState(false)
    }
    theBumpMap = new BumpMap();
}


/**
 * Initializes the UI components for the bump map.
 */
function initBumpMapUIComponents() {
    initSelector(bumpMapElements.selector, bumpMapLoader, function () {
        selectedBumpMap = this.value;
        if (selectedBumpMapTexture !== "None") {
            handleBumpMapCreation();
        }
    });

    initSelector(bumpMapElements.textureSelector, bumpMapTextureLoader, function () {
        selectedBumpMapTexture = this.value;
        handleBumpMapCreation();
    });
}

initBumpMapUIComponents();