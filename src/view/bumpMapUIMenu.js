let bumpTexture = null;

const bumpMapSelector = doc.getElementById('bump_map_selector');
const BumpMapColorPicker = doc.getElementById('bump_map_color');


// Loaders
const BumpMapLoader = ['flower.jpg', 'cube.jpg', 'brickwall.jpg', 'moon.jpg', 'water.jpg'];


function populateBumpMapSelector() {
    BumpMapLoader.forEach(function (bumpMapName) {
        const option = doc.createElement('option');
        const nameWithoutExtension = bumpMapName.split('.')[0];
        option.value = bumpMapName;
        option.textContent = nameWithoutExtension;
        bumpMapSelector.appendChild(option);
    });
}

function loadBumpTexture(textureName) {
    const texturePath = `res/textures/bumpMaps/${textureName}`;
    bumpTexture = loadTexture(gl, texturePath);
}

function initBumpMapSelector() {
    bumpMapSelector.addEventListener('change', function () {
        const selectedBumpMap = this.value;
        if (selectedBumpMap !== 'None') {
            loadBumpTexture(selectedBumpMap);
            main_plane.setShaderName('glsl/lambertBumpMap');
            main_plane.setColor( Color.hextoRGB(BumpMapColorPicker.value).toArray());
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
        //console.log(Color.hextoRGB(this.value).toArray());
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