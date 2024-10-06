// src/view/bumpMapUIMenu.js
let bumpMap = null;
let texture_ForBump = null;

const bumpMapElements = {
    selector: doc.getElementById('bump_map_selector'),
    shaderSelector: doc.getElementById('bump_map_shader_selector'),
    textureSelector: doc.getElementById('bump_map_texture_selector')
};

const bumpMapLoader = ["brickNM2.png", "circleNM.png", "bumpWaterNM.jpg", "brickWallNM.jpg", "waterReelNM.jpg"];
const bumpMapTextureLoader = ["white.png",'circle.png', "bumpWater.jpg", "brickWall.jpg", "waterReel.jpg"];
const bumpMapShaderLoader = ['Lambert', 'Blinn-Phong'];

let selectedBumpMap = "None";
let selectedTexture = "None";
let selectedShader = "None";


function handleShader() {
    if (selectedShader === "None" || selectedTexture === "None") {
        bumpMap = null;
        texture_ForBump = null;
        main_plane.setShaderName('glsl/plane');
    }
    else // We have a texture and a shader.
    {
        // Load the texture.
        const texturePath = `res/textures/${selectedTexture}`;
        texture_ForBump = loadTexture(gl, texturePath);

        // If a bump map is selected, we load it.
        if(selectedBumpMap !== "None")
        {
            const bumpMapPath = `res/bumpMaps/${selectedBumpMap}`;
            bumpMap = loadTexture(gl, bumpMapPath);
        }
        // The bind the right shader.
        if (selectedShader === "Lambert") {
            main_plane.setShaderName('glsl/lambertNormalMap');
        } else if (selectedShader === "Blinn-Phong") {
            main_plane.setShaderName('glsl/blinnPhongNormalMap');
        } else {
            window.alert("Please select a shader");
        }
    }
}

function initBumpMapUIComponents() {
    initSelector(bumpMapElements.selector, bumpMapLoader, function () {
        selectedBumpMap = this.value;
        if (selectedTexture !== "None") {
            handleShader();
        }
    });

    initSelector(bumpMapElements.textureSelector, bumpMapTextureLoader, function () {
        selectedTexture = this.value;
        handleShader();
    });

    initSelector(bumpMapElements.shaderSelector, bumpMapShaderLoader, function () {
        selectedShader = this.value;
        handleShader();
    });

}

initBumpMapUIComponents();