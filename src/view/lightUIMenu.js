// src/view/lightUIMenu.js
const lightElements = {
    lightingColorPicker: doc.getElementById('light_color'),
    lightIntensitySlider: doc.getElementById('lightIntensity_slider'),
    lightIntensityValue: doc.getElementById('lightIntensity_value'),
};

/**
 * update the default intensity value of the light slider.
 * @param value
 */
function updateTheDefaultLightIntensitySliderValue(value){
    lightElements.lightIntensitySlider.value = value;
    lightElements.lightIntensityValue.textContent = value;
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

}

initLightUIComponents()