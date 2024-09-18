/**
 * @type {WebGLTexture|null}
 */
let bumpMap = null;

/**
 * @type {WebGLTexture|null}
 */
let texture_ForBump = null;

const BumpMapSelector = doc.getElementById('bump_map_selector');
const BumpMapColorPicker = doc.getElementById('bump_map_color');
const BumpMapTexture = doc.getElementById('bump_map_texture_selector');

// Loaders
const BumpMapLoader = ['brick.jpg', 'waves.jpg', 'cercle.png'];
const BumpMapTextureLoader = [ 'water.png', 'water.jpg'];

/**
 * Populate the bump map selector with options.
 */
function populateBumpMapSelector() {
    BumpMapLoader.forEach(function (bumpMapName) {
        const option = doc.createElement('option');
        const nameWithoutExtension = bumpMapName.split('.')[0];
        option.value = bumpMapName;
        option.textContent = nameWithoutExtension;
        BumpMapSelector.appendChild(option);
    });
}

/**
 * Initialize the bump map selector with event listeners.
 */
function initBumpMapSelector() {
    BumpMapSelector.addEventListener('change', function () {
        const selectedBumpMap = this.value;
        if (selectedBumpMap !== 'None') {
            const texturePath = `res/bumpMaps/${selectedBumpMap}`;
            bumpMap = loadTexture(gl, texturePath);
            main_plane.setShaderName('glsl/lambertBumpMap');
            main_plane.setColor(Color.hextoRGB(BumpMapColorPicker.value).toArray());
        } else {
            bumpMap = null;
            main_plane.setShaderName('glsl/plane');
        }
    });
}

/**
 * Initialize the color picker with event listeners.
 */
function initColorPicker() {
    BumpMapColorPicker.addEventListener('input', function () {
        main_plane.setColor(Color.hextoRGB(this.value).toArray());
    });
}

/**
 * Populate the bump map texture selector with options.
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

/**
 * Initialize the bump map texture selector with event listeners.
 */
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
 * Initialize all UI components.
 */
function initUIComponents() {
    populateBumpMapSelector();
    populateBumpMapTextureSelector();
    initBumpMapSelector();
    initBumpMapTextureSelector();
    initColorPicker();
}

// Initialize UI components
initUIComponents();