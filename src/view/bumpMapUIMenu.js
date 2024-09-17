let bumpTexture = null;


const BumpMapColorPicker = doc.getElementById('bump_map_color');


// Loaders
const BumpMapLoader = ['flower', 'cube', 'brickwall', 'moon'];


function populateBumpMapSelector() {
    const bumpMapSelector = doc.getElementById('bump_map_selector');
    BumpMapLoader.forEach(function (bumpMapName) {
        const option = doc.createElement('option');
        option.value = bumpMapName;
        option.textContent = bumpMapName;
        bumpMapSelector.appendChild(option);
    });
}

function loadBumpTexture(textureName) {
    const texturePath = `res/textures/bumpMaps/${textureName}.jpg`;
    bumpTexture = loadTexture(gl, texturePath);
}

function initBumpMapSelector() {
    const bumpMapSelector = doc.getElementById('bump_map_selector');
    bumpMapSelector.addEventListener('change', function () {
        const selectedBumpMap = this.value;
        if (selectedBumpMap !== 'None') {
            loadBumpTexture(selectedBumpMap);
            main_plane.setShaderName('glsl/LambertBumpMap');
        } else {
            bumpTexture = null;
            main_plane.setShaderName('glsl/plane');
        }
    });
}

/**
 * Initialize the color picker
 */
function initColorPicker() {
    BumpMapColorPicker.addEventListener('input', function () {
        main_plane.setColor( Color.hextoRGB(this.value).toArray());
    });
}


/**
 * Initialize UI components
 */
function initUIComponents() {
    populateBumpMapSelector();
    initBumpMapSelector();
    initColorPicker()
}

// Initialize UI components
initUIComponents();