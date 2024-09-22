// src/view/bumpMapUIMenu.js
let bumpMap = null;
let texture_ForBump = null;

const BumpMapSelector = doc.getElementById('bump_map_selector');
const BumpMapShaderSelector = doc.getElementById('bump_map_shader_selector');
const BumpMapColorPicker = doc.getElementById('bump_map_color');
const BumpMapTexture = doc.getElementById('bump_map_texture_selector');

const BumpMapLoader = ['brickBM.jpg', 'wavesBM.jpg', "brickNM.png", "circleNM.png", "brickNM2.png",
    "testNM.png", "bumpWaterNM.jpg", "brickWallNM.jpg", "waterReelNM.jpg"];
const BumpMapTextureLoader = ['brickBM.jpg', 'poolWater.png', 'seaWater.jpg', 'circle.png', "white.png", "bumpWater.jpg",
    "brickWall.jpg", "waterReel.jpg"];

const BumpMapShaderLoader = ['Lambert', 'Blinn-Phong'];

let selectedBumpMap = "None";
let selectedTexture = "None";
let selectedShader = "None";

function initUIComponents() {
    initSelector(BumpMapSelector, BumpMapLoader, function () {
        selectedBumpMap = this.value;
        if(selectedTexture !== "None") {
            handleShader();
        }
        main_plane.setColor(Color.hextoRGB(BumpMapColorPicker.value).toArray());
    });

    initSelector(BumpMapTexture, BumpMapTextureLoader, function () {
        selectedTexture = this.value;
        handleShader();
        main_plane.setColor(Color.hextoRGB(BumpMapColorPicker.value).toArray());
    });

    initSelector(BumpMapShaderSelector, BumpMapShaderLoader, function () {
        selectedShader = this.value;
        handleShader();
    });

    initColorPicker(BumpMapColorPicker, function () {
        main_plane.setColor(Color.hextoRGB(this.value).toArray());
    });
}

function handleShader()
{
    // If wwe don't have a texture.
    if (selectedTexture === "None")
    {
        bumpMap = null;
        texture_ForBump = null;
        main_plane.setShaderName('glsl/plane');
    }
    else // We have a texture.
    {
        // We load it.
        const texturePath = `res/textures/${selectedTexture}`;
        texture_ForBump = loadTexture(gl, texturePath);
        // Not bumpMap, we just display the texture.
        if(selectedBumpMap === "None" || selectedShader === "None")
        {
            bumpMap = null;
            main_plane.setShaderName('glsl/planeTexture');
        }
        else // We display the bumpMap with the texture.
        {
            const bumpMapPath = `res/bumpMaps/${selectedBumpMap}`;
            bumpMap = loadTexture(gl, bumpMapPath);
            if(selectedShader === "Lambert")
            {
                main_plane.setShaderName('glsl/lambertNormalMap');
            }else if(selectedShader === "Blinn-Phong"){
                main_plane.setShaderName('glsl/blinnPhongNormalMap');
            }else {
               // pop up a message
                window.alert("Please select a shader");
            }
        }
    }
}


initUIComponents();