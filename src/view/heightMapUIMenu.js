const heightMapElements = {
    toggle: doc.getElementById('heightMap_checkbox'),
    selector: doc.getElementById('heightMap_selector'),
    textureSelector: doc.getElementById('heightMap_texture_selector'),
    colorPicker: doc.getElementById('heightMap_color'),
    scaleSlider: doc.getElementById('heightMap_scale_slider'),
    scaleValueDisplay: doc.getElementById('heightMap_scale_value'),
    flattenSlider: doc.getElementById('heightMap_flatten_slider'),
    flattenValueDisplay: doc.getElementById('heightMap_flatten_value'),
    switch: document.getElementById('heightMap_switch'),
};

const heightMapLoader = ['texture1.png', 'texture2.png', 'texture3.png', 'texture4.png'];
const heighMapTextureLoader = ['poolWater.png', 'seaWater.jpg', 'circle.png', "white.png", "bumpWater.jpg", "brickWall.jpg", "waterReel.jpg"];

let theHeightMap = null;
let heightMapType = null;
let heightMap_texturePathMap = null;
let isWireFrameActiveHeightMap = false;
let flattenFactorHeightMap = 1;
const DEFAULT_HEIGHTMAP_TEXTURE = 'res/textures/white.png';

function initHeightMapToggle() {
    initToggle(heightMapElements.toggle, isWireFrameActiveHeightMap = false, function () {
        isWireFrameActiveHeightMap = this.checked;
    });
}

function handleCreateHeightMap() {
    main_objectsToDraw = main_objectsToDraw.filter(obj => !(obj instanceof heightMap));
    theHeightMap = new heightMap();
    if(heightMapElements.switch.checked) {
        theHeightMap.setColor(Color.hextoRGB(heightMapElements.colorPicker.value).toArray());
    }else {
        theHeightMap.setColor(Color.WHITE);
    }

    main_objectsToDraw.push(theHeightMap);
}

function handleHeightMapSelection(selectedHeightMap, selectionType) {
    main_objectsToDraw = main_objectsToDraw.filter(obj => !(obj instanceof heightMap));
    if (selectedHeightMap !== 'None') {
        if (selectionType === 'type') {
            heightMapType = `res/heightMaps/${selectedHeightMap}`;
        } else if (selectionType === 'texture') {
            heightMap_texturePathMap = `res/textures/${selectedHeightMap}`;
        }

        if (heightMap_texturePathMap === null) {
            heightMap_texturePathMap = DEFAULT_HEIGHTMAP_TEXTURE;
        }
    } else {
        if (selectionType === 'type') {
            heightMapType = null;
        } else if (selectionType === 'texture') {
            heightMap_texturePathMap = DEFAULT_HEIGHTMAP_TEXTURE;
        }
    }

    if (heightMapType !== null) {
        handleCreateHeightMap();
        let scaleSliderValue = heightMapElements.scaleSlider.value;
        if (scaleSliderValue === '0') {
            updateScaleHeightMap(DEFAULT_SCALE);
        } else {
            updateScaleHeightMap(parseInt(scaleSliderValue));
        }
    }
}

function initHeightMapSelector() {
    initSelector(heightMapElements.selector, heightMapLoader, function () {
        handleHeightMapSelection(this.value, 'type');
    });
}

function initHeightMapTexturePathMapSelector() {
    initSelector(heightMapElements.textureSelector, heighMapTextureLoader, function () {
        handleHeightMapSelection(this.value, 'texture');
    });
}

function updateScaleHeightMap(scale) {
    if (theHeightMap !== null) {
        heightMapElements.scaleValueDisplay.textContent = String(scale);
        heightMapElements.scaleSlider.value = scale;
        theHeightMap.setScale(scale);
    }
}

function handleHeightMapSwitch() {
    const heightMapTextureSelectorItem = heightMapElements.textureSelector.closest('.row');
    const heightMapColorItem = heightMapElements.colorPicker.closest('.row');


    if (heightMapElements.switch.checked) {
        heightMapColorItem.style.display = 'block';
        heightMapTextureSelectorItem.style.display = 'none';
        heightMapElements.textureSelector.value = 'None';
    } else {
        heightMapColorItem.style.display = 'none';
        heightMapTextureSelectorItem.style.display = 'block';
        heightMapElements.colorPicker.value = '#ffffff';
    }

    if (heightMapType !== null) {
        heightMap_texturePathMap = DEFAULT_HEIGHTMAP_TEXTURE;
        handleCreateHeightMap();
        updateScaleHeightMap(heightMapElements.scaleSlider.value);
    }
}

heightMapElements.switch.addEventListener('change', handleHeightMapSwitch);

function initUIComponents() {
    initHeightMapToggle();
    initHeightMapSelector();
    initHeightMapTexturePathMapSelector();
    initColorPicker(heightMapElements.colorPicker, function () {
        theHeightMap.setColor(Color.hextoRGB(this.value).toArray());
    });
    initSlider(heightMapElements.scaleSlider, function () {
        updateScaleHeightMap(this.value);
    });

    initSlider(heightMapElements.flattenSlider, function () {
        heightMapElements.flattenValueDisplay.textContent = this.value;
        flattenFactorHeightMap = this.value;
        if (heightMapType !== null) {
            handleCreateHeightMap();
            updateScaleHeightMap(heightMapElements.scaleSlider.value);
        }
    });
    handleHeightMapSwitch();
}

initUIComponents();