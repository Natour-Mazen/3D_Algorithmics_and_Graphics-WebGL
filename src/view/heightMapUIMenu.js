
let heightMapColorTexturePath = 'res/heightMaps/texture1.png';
let heightMap_texturePathMap = null;
let isThereHeightMap = false;

const heightMapToggle = doc.getElementById('heightMap_checkbox');
const heightMapSelector = doc.getElementById('heightMap_selector');
const heightMapTextureSelector = doc.getElementById('heightMap_texture_selector');
const heightMapColorPicker = doc.getElementById('heightMap_color');
const heightMapScaleSlider = doc.getElementById('heightMap_scale_slider');
const heightMapScaleValueDisplay = doc.getElementById('heightMap_scale_value');

const heightMapLoader = ['texture1.png', 'texture2.png', 'texture3.png', 'texture4.png'];

/**
 * Initialize the plane toggle
 */
function initHeightMapToggle() {
    heightMapToggle.checked = isThereHeightMap = false;
    heightMapToggle.addEventListener('input', function () {
        isThereHeightMap = this.checked;
    });
}

/**
 * Initialize the color picker
 */
function initHeightMapColorPicker() {
    heightMapColorPicker.addEventListener('input', function () {
        obj.setColor(Color.hextoRGB(this.value).toArray());
    });
}

/**
 * Populate the bump map selector with options.
 */
function populateHeightMapSelector() {
    heightMapLoader.forEach(function (heightMapName) {
        const option = doc.createElement('option');
        const nameWithoutExtension = heightMapName.split('.')[0];
        option.value = heightMapName;
        option.textContent = nameWithoutExtension;
        heightMapSelector.appendChild(option);
    });
}

/**
 * Initialize the bump map selector with event listeners.
 */
function initHeightMapSelector() {
    heightMapSelector.addEventListener('change', function () {
        const selectedHeightMap = this.value;
        main_objectsToDraw = main_objectsToDraw.filter(obj => obj instanceof plane); // Keep only the plane
        if (selectedHeightMap !== 'None') {
            heightMapColorTexturePath = `res/heightMaps/${selectedHeightMap}`;
            obj = new heightMap();
            main_objectsToDraw.push(obj);
            obj.setColor(Color.hextoRGB(heightMapColorPicker.value).toArray());
            let scaleSliderValue = heightMapScaleSlider.value;
            if (scaleSliderValue === '0') {
                updateScaleHeightMap(DEFAULT_SCALE);
            } else {
                updateScaleHeightMap(parseInt(scaleSliderValue));
            }
        }
    });
}

/**
 * Update the scale of the object
 * @param {number} scale - The new scale value
 */
function updateScaleHeightMap(scale) {
    heightMapScaleValueDisplay.textContent = String(scale);
    heightMapScaleSlider.value = scale;
    obj.setScale(scale);
}

/**
 * Initialize the scale slider
 */
function initScaleSliderHeightMap() {
    heightMapScaleSlider.addEventListener('input', function () {
        updateScaleHeightMap(this.value);
    });
    heightMapScaleSlider.value = 0;
}

/**
 * Populate the bump map selector with options.
 */
function populateHeightMapTextureSelector() {
    heightMapLoader.forEach(function (heightMapName) {
        const option = doc.createElement('option');
        const nameWithoutExtension = heightMapName.split('.')[0];
        option.value = heightMapName;
        option.textContent = nameWithoutExtension;
        heightMapTextureSelector.appendChild(option);
    });
}

/**
 * Initialize the bump map selector with event listeners.
 */
function initHeightMapTextureSelector() {
    heightMapTextureSelector.addEventListener('change', function () {
        const selectedHeightMapTexture = this.value;
        main_objectsToDraw = main_objectsToDraw.filter(obj => obj instanceof plane); // Keep only the plane
        if (selectedHeightMapTexture !== 'None') {
            heightMap_texturePathMap = `res/heightMaps/${selectedHeightMapTexture}`;
            obj = new heightMap();
            main_objectsToDraw.push(obj);
            obj.setColor(Color.hextoRGB(heightMapColorPicker.value).toArray());
            let scaleSliderValue = heightMapScaleSlider.value;
            if (scaleSliderValue === '0') {
                updateScaleHeightMap(DEFAULT_SCALE);
            } else {
                updateScaleHeightMap(parseInt(scaleSliderValue));
            }
        }
    });
}


/**
 * Initialize all UI components.
 */
function initUIComponents() {
    populateHeightMapSelector()
    populateHeightMapTextureSelector()
    initHeightMapSelector();
    initHeightMapTextureSelector();
    initHeightMapToggle();
    initHeightMapColorPicker();
    initScaleSliderHeightMap();
}

// Initialize UI components
initUIComponents();