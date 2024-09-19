let theHeightMap = null;
let heightMapColorTexturePath = null;
let heightMap_texturePathMap = null;
let isThereHeightMap = false;
let flattenFactorHeightMap = 1;

const heightMapToggle = doc.getElementById('heightMap_checkbox');
const heightMapSelector = doc.getElementById('heightMap_selector');
const heightMapTextureSelector = doc.getElementById('heightMap_texture_selector');
const heightMapColorPicker = doc.getElementById('heightMap_color');
const heightMapScaleSlider = doc.getElementById('heightMap_scale_slider');
const heightMapScaleValueDisplay = doc.getElementById('heightMap_scale_value');
const heightMapFlattenSlider = doc.getElementById('heightMap_flatten_slider');
const heightMapFlattenValueDisplay = doc.getElementById('heightMap_flatten_value');

const heightMapLoader = ['texture1.png', 'texture2.png', 'texture3.png', 'texture4.png'];

function initHeightMapToggle() {
    heightMapToggle.checked = isThereHeightMap = false;
    heightMapToggle.addEventListener('input', function () {
        isThereHeightMap = this.checked;
    });
}

function handleHeightMapSelection(selectedHeightMap, textureType) {
    main_objectsToDraw = main_objectsToDraw.filter(obj => !(obj instanceof heightMap));
    if (selectedHeightMap !== 'None') {
        if (textureType === 'color') {
            heightMapColorTexturePath = `res/heightMaps/${selectedHeightMap}`;
        } else if (textureType === 'texture') {
            heightMap_texturePathMap = `res/heightMaps/${selectedHeightMap}`;
        }

        if (heightMapColorTexturePath !== null && heightMap_texturePathMap !== null) {
            theHeightMap = new heightMap();
            main_objectsToDraw.push(theHeightMap);
            theHeightMap.setColor(Color.hextoRGB(heightMapColorPicker.value).toArray());
            let scaleSliderValue = heightMapScaleSlider.value;
            if (scaleSliderValue === '0') {
                updateScaleHeightMap(DEFAULT_SCALE);
            } else {
                updateScaleHeightMap(parseInt(scaleSliderValue));
            }
        }
    }
}

function initHeightMapSelector() {
    initSelector(heightMapSelector, heightMapLoader, function () {
        handleHeightMapSelection(this.value, 'color');
    });
}

function initHeightMapTexturePathMapSelector() {
    initSelector(heightMapTextureSelector, heightMapLoader, function () {
        handleHeightMapSelection(this.value, 'texture');
    });
}

function updateScaleHeightMap(scale) {
    heightMapScaleValueDisplay.textContent = String(scale);
    heightMapScaleSlider.value = scale;
    theHeightMap.setScale(scale);
}

function initUIComponents() {
    initHeightMapToggle();
    initHeightMapSelector();
    initHeightMapTexturePathMapSelector();
    initColorPicker(heightMapColorPicker, function () {
        theHeightMap.setColor(Color.hextoRGB(this.value).toArray());
    });
    initSlider(heightMapScaleSlider, function () {
        updateScaleHeightMap(this.value);
    });

    initSlider(heightMapFlattenSlider, function () {
        heightMapFlattenValueDisplay.textContent = this.value;
        flattenFactorHeightMap = this.value ;
        if (heightMapColorTexturePath !== null && heightMap_texturePathMap !== null) {
            main_objectsToDraw = main_objectsToDraw.filter(obj => !(obj instanceof heightMap));
            theHeightMap = new heightMap();
            theHeightMap.setColor(Color.hextoRGB(this.value).toArray());
            main_objectsToDraw.push(theHeightMap);
            updateScaleHeightMap(heightMapScaleSlider.value);
        }

    });
}

initUIComponents();
