// src/view/lightUIMenu.js
const lightElements = {
    lightingColorPicker: doc.getElementById('light_color'),
};

/**
 * Initializes the UI components for the Light.
 */
function initLightUIComponents(){
    initColorPicker(lightElements.lightingColorPicker,function(){
        if(main_light !== null){
            main_light.setLightColor(Color.hextoRGB(this.value).toArray());
        }
    });

}

initLightUIComponents()