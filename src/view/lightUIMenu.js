// src/view/lightUIMenu.js
const lightElements = {
    lightingColorPicker: doc.getElementById('light_color'),
    lightIntensitySlider: doc.getElementById('lightIntensity_slider'),
    lightIntensityValue: doc.getElementById('lightIntensity_value'),
    shaderSelector: doc.getElementById('light_shaderType_selector'),
    lightShininessSlider: doc.getElementById('lightShininess_slider'),
    lightShininessValue: doc.getElementById('lightShininess_value'),
};

/**
 * @type {string[]}
 */
const shaderTypeLoader = ['Lambert', 'Blinn-Phong'];


/**
 * update the default intensity value of the light slider.
 * @param value
 */
function updateTheDefaultLightIntensitySliderValue(value){
    lightElements.lightIntensitySlider.value = value;
    lightElements.lightIntensityValue.textContent = value;
}

/**
 * update the default shininess value of the light slider.
 * @param value
 */
function updateTheDefaultLightShininessSliderValue(value){
    lightElements.lightShininessSlider.value = value;
    lightElements.lightShininessValue.textContent = value;
}

/**
 * Handles the display of the light brightness slider.
 * @param {string} value - The display value (e.g., 'block', 'none').
 */
function handleDisplayLightShininessSlider(value) {
    const lightElementsLightShininessSlide = lightElements.lightShininessSlider.closest('.row');
    lightElementsLightShininessSlide.style.display = value;
}

/**
 * Handles the display of the light intensity slider.
 * @param value - The display value (e.g., 'block', 'none').
 */
function handleDisplayLightIntensitySlider(value) {
    const lightElementsLightIntensitySlide = lightElements.lightIntensitySlider.closest('.row');
    lightElementsLightIntensitySlide.style.display = value;
}

/**
 * Initializes the UI components for the Light.
 */
function initLightUIComponents(){
    initColorPicker(lightElements.lightingColorPicker,function(){
        if(main_light !== null){
            main_light.setLightColor(Color.hextoRGB(this.value).toArray());
        }
    });

    initSlider(lightElements.lightIntensitySlider, function () {
        if (main_light !== null) {
            main_light.setLightIntensity(this.value);
            lightElements.lightIntensityValue.textContent = this.value;
        }
    });

    initSelector(lightElements.shaderSelector, shaderTypeLoader, function () {
        if(this.value === "Blinn-Phong") {
            handleDisplayLightShininessSlider('block');
            handleDisplayLightIntensitySlider('none');
            main_light.setIsPhongShader(true);
        }
        else {
            handleDisplayLightShininessSlider('none');
            handleDisplayLightIntensitySlider('block');
            main_light.setIsPhongShader(false);
        }
    });

    initSlider(lightElements.lightShininessSlider, function () {
        if (main_light !== null) {
            main_light.setLightShininess(this.value);
            lightElements.lightShininessValue.textContent = this.value;
        }
    });
    // Set default value to "Lambert"
    lightElements.shaderSelector.value = shaderTypeLoader[0];
    handleDisplayLightShininessSlider('none');
}

initLightUIComponents()