// src/view/bumpMapUIMenu.js
let bumpMap = null;
let texture_ForBump = null;

const BumpMapSelector = doc.getElementById('bump_map_selector');
const BumpMapColorPicker = doc.getElementById('bump_map_color');
const BumpMapTexture = doc.getElementById('bump_map_texture_selector');

const BumpMapLoader = ['brick.jpg', 'waves.jpg', 'cercle.png'];
const BumpMapTextureLoader = ['water.png', 'water.jpg'];

function initUIComponents() {
    initSelector(BumpMapSelector, BumpMapLoader, function () {
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

    initSelector(BumpMapTexture, BumpMapTextureLoader, function () {
        const selectedTexture = this.value;
        if (selectedTexture !== 'None') {
            const texturePath = `res/textures/${selectedTexture}`;
            texture_ForBump = loadTexture(gl, texturePath);
        } else {
            texture_ForBump = null;
        }
    });

    initColorPicker(BumpMapColorPicker, function () {
        main_plane.setColor(Color.hextoRGB(this.value).toArray());
    });
}

initUIComponents();