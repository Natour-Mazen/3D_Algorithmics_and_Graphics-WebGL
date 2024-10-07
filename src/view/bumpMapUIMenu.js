// src/view/bumpMapUIMenu.js
/**
 * @type {Object}
 */
const bumpMapElements = {
    selector: doc.getElementById('bump_map_selector'),
    shaderSelector: doc.getElementById('bump_map_shader_selector'),
    textureSelector: doc.getElementById('bump_map_texture_selector'),
    lightIntensitySlider: doc.getElementById('heightMap_lightIntensity_slider'),
    lightIntensityValue: doc.getElementById('heightMap_lightIntensity_value'),
    lightBrightnessSlider: doc.getElementById('heightMap_lightBrightness_slider'),
    lightBrightnessValue: doc.getElementById('heightMap_lightBrightness_value'),
    lightingColorPicker: doc.getElementById('bump_map_lightColor'),
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
 * @type {bumpMap|null}
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
 * Handles the creation of the bump map.
 */
function handleBumpMapCreation() {
    resetBumpMap();
    updateLightColor(bumpMapElements.lightingColorPicker.value);
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
    main_objectsToDraw = main_objectsToDraw.filter(obj => !(obj instanceof bumpMap));
    handleDisplayLightBrightnessSlider('none');
}

/**
 * Updates the light color.
 * @param {string} value - The hex value of the color.
 */
function updateLightColor(value) {
    main_lightColor = Color.hextoRGB(value).toArray();
}

/**
 * Resets the bump map settings.
 */
function resetBumpMapSettings() {
    bumpMapType = null;
    texture_ForBump = null;
    setPlaneState(true);
    handleDisplayLightIntensitySlider('none');
    handleDisplayLightBrightnessSlider('none');
    updateLightColor('#ffffff');
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
        theBumpMap = new bumpMap('glsl/lambertNormalMap');
        setPlaneState(false);
        handleDisplayLightIntensitySlider('block');
        handleDisplayLightBrightnessSlider('none');
        theBumpMap.setLightIntensity(bumpMapElements.lightIntensitySlider.value);
    } else if (selectedShader === "Blinn-Phong") {
        theBumpMap = new bumpMap('glsl/blinnPhongNormalMap');
        setPlaneState(false);
        handleDisplayLightIntensitySlider('none');
        handleDisplayLightBrightnessSlider('block');
        theBumpMap.setLightBrightness(bumpMapElements.lightBrightnessSlider.value);
    } else {
        window.alert("Please select a shader");
    }
}

/**
 * Handles the display of the light intensity slider.
 * @param {string} value - The display value (e.g., 'block', 'none').
 */
function handleDisplayLightIntensitySlider(value) {
    const bumpMapElementsLightIntensitySlide = bumpMapElements.lightIntensityValue.closest('.row');
    bumpMapElementsLightIntensitySlide.style.display = value;
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

    initSlider(bumpMapElements.lightIntensitySlider, function () {
        if (theBumpMap !== null) {
            theBumpMap.setLightIntensity(this.value);
            bumpMapElements.lightIntensityValue.textContent = this.value;
        }
    });

    initSlider(bumpMapElements.lightBrightnessSlider, function () {
        if (theBumpMap !== null) {
            theBumpMap.setLightBrightness(this.value);
            bumpMapElements.lightBrightnessValue.textContent = this.value;
        }
    });

    initColorPicker(bumpMapElements.lightingColorPicker, function () {
        if (theBumpMap !== null) {
            updateLightColor(this.value);
        }
    });

    handleDisplayLightIntensitySlider('none');
    handleDisplayLightBrightnessSlider('none');
}

initBumpMapUIComponents();