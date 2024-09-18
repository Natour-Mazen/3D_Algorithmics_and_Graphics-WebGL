let bumpMap = null;
let texture_ForBump = null;

const BumpMapSelector = doc.getElementById('bump_map_selector');
const BumpMapColorPicker = doc.getElementById('bump_map_color');
const BumpMapTexture = doc.getElementById('bump_map_texture_selector');


// Loaders
const BumpMapLoader = ['cercle.png', 'brick.jpg'];
const BumpMapTextureLoader = ['brick.jpg'];

function populateBumpMapSelector() {
    BumpMapLoader.forEach(function (bumpMapName) {
        const option = doc.createElement('option');
        const nameWithoutExtension = bumpMapName.split('.')[0];
        option.value = bumpMapName;
        option.textContent = nameWithoutExtension;
        BumpMapSelector.appendChild(option);
    });
}

function loadBumpTexture(textureName) {

}

function initBumpMapSelector() {
    BumpMapSelector.addEventListener('change', function () {
        const selectedBumpMap = this.value;
        if (selectedBumpMap !== 'None') {
            const texturePath = `res/bumpMaps/${selectedBumpMap}`;
            bumpMap = loadTexture(gl, texturePath);
            main_plane.setShaderName('glsl/lambertBumpMap');
            main_plane.setColor( Color.hextoRGB(BumpMapColorPicker.value).toArray());
        } else {
            bumpMap = null;
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
 * Populate the bump map texture selector
 */
function populateBumpMapTextureSelector() {
    BumpMapTextureLoader.forEach(function (textureName) {
        const option = document.createElement('option');
        const nameWithoutExtension = textureName.split('.')[0];
        option.value = textureName;
        option.textContent = nameWithoutExtension;
        BumpMapTexture.appendChild(option);
    });
}

function initBumpMapTextureSelector() {
    BumpMapTexture.addEventListener('change', function () {
        const selectedTexture = this.value;
        if (selectedTexture !== 'None') {
            const texturePath = `res/textures/${selectedTexture}`;
            texture_ForBump = loadTexture(gl, texturePath);
        } else {
            texture_ForBump = null;
        }
    });
}


/**
 * Initialize UI components
 */
function initUIComponents() {
    populateBumpMapSelector();
    populateBumpMapTextureSelector();
    initBumpMapSelector();
    initColorPicker()
}

// Initialize UI components
initUIComponents();