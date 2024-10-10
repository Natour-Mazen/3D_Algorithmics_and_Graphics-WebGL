// src/view/bumpMapUIMenu.js
/**
 * @type {Object}
 */
const bumpMapElements = {
    selector: doc.getElementById('bump_map_selector'),
    shaderSelector: doc.getElementById('bump_map_shader_selector'),
    textureSelector: doc.getElementById('bump_map_texture_selector'),
    lightBrightnessSlider: doc.getElementById('heightMap_lightBrightness_slider'),
    lightBrightnessValue: doc.getElementById('heightMap_lightBrightness_value'),
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
 * @type {string[]}
 */
const bumpMapShaderLoader = ['Lambert', 'Blinn-Phong'];

/**
 * @type {string}
 */
let selectedBumpMap = "None";

/**
 * @type {string}
 */
let selectedTexture = "None";

/**
 * @type {string}
 */
let selectedShader = "None";


/**
 * Updates the default light brightness slider value.
 * @param value
 */
function updateTheDefaultLightBrightnessSliderValue(value) {
    bumpMapElements.lightBrightnessSlider.value = value;
    bumpMapElements.lightBrightnessValue.textContent = value;
}


/**
 * Handles the creation of the bump map.
 */
function handleBumpMapCreation() {
    resetBumpMap();
    if (selectedShader === "None" || selectedTexture === "None") {
        resetBumpMapSettings();
    } else {
        loadTextures();
        bindShader();
        main_objectsToDraw.push(theBumpMap);
    }
}

/**
 * Resets the bump map.
 */
function resetBumpMap() {
    main_objectsToDraw = main_objectsToDraw.filter(obj => !(obj instanceof BumpMap));
    handleDisplayLightBrightnessSlider('none');
}

/**
 * Resets the bump map settings.
 */
function resetBumpMapSettings() {
    bumpMapType = null;
    texture_ForBump = null;
    setPlaneState(true);
    handleDisplayLightBrightnessSlider('none');
}

/**
 * Loads the textures for the bump map.
 */
function loadTextures() {
    const texturePath = `res/textures/${selectedTexture}`;
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
    if (selectedShader === "Lambert") {
        theBumpMap = new BumpMap('glsl/lambertNormalMap');
        setPlaneState(false);
        handleDisplayLightBrightnessSlider('none');
    } else if (selectedShader === "Blinn-Phong") {
        theBumpMap = new BumpMap('glsl/blinnPhongNormalMap');
        setPlaneState(false);
        handleDisplayLightBrightnessSlider('block');
        theBumpMap.setLightBrightness(bumpMapElements.lightBrightnessSlider.value);
        updateTheDefaultLightBrightnessSliderValue(theBumpMap.getLightBrightness());
    } else {
        window.alert("Please select a shader");
    }
}

/**
 * Handles the display of the light brightness slider.
 * @param {string} value - The display value (e.g., 'block', 'none').
 */
function handleDisplayLightBrightnessSlider(value) {
    const bumpMapElementsLightBrightnessSlide = bumpMapElements.lightBrightnessSlider.closest('.row');
    bumpMapElementsLightBrightnessSlide.style.display = value;
}

/**
 * Initializes the UI components for the bump map.
 */
function initBumpMapUIComponents() {
    initSelector(bumpMapElements.selector, bumpMapLoader, function () {
        selectedBumpMap = this.value;
        if (selectedTexture !== "None") {
            handleBumpMapCreation();
        }
    });

    initSelector(bumpMapElements.textureSelector, bumpMapTextureLoader, function () {
        selectedTexture = this.value;
        handleBumpMapCreation();
    });

    initSelector(bumpMapElements.shaderSelector, bumpMapShaderLoader, function () {
        selectedShader = this.value;
        handleBumpMapCreation();
    });

    initSlider(bumpMapElements.lightBrightnessSlider, function () {
        if (theBumpMap !== null) {
            theBumpMap.setLightBrightness(this.value);
            bumpMapElements.lightBrightnessValue.textContent = this.value;
        }
    });

    handleDisplayLightBrightnessSlider('none');
}

initBumpMapUIComponents();