// src/view/bumpMapUIMenu.js
let bumpMapType = null;
let texture_ForBump = null;
let theBumpMap = null;

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


function handleBumpMapCreation() {
    main_objectsToDraw = main_objectsToDraw.filter(obj => !(obj instanceof bumpMap));
    if (selectedShader === "None" || selectedTexture === "None") {
        bumpMapType = null;
        texture_ForBump = null;
        setPlaneState(true);
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
            bumpMapType = loadTexture(gl, bumpMapPath);
        }

        // The bind the right shader.
        if (selectedShader === "Lambert") {
            theBumpMap = new bumpMap('glsl/lambertNormalMap');
            setPlaneState(false);
        } else if (selectedShader === "Blinn-Phong") {
            theBumpMap = new bumpMap('glsl/blinnPhongNormalMap');
            setPlaneState(false);
        } else {
            window.alert("Please select a shader");
        }
        main_objectsToDraw.push(theBumpMap);
    }
}

function initBumpMapUIComponents() {
    initSelector(bumpMapElements.selector, bumpMapLoader, function () {
        selectedBumpMap = this.value;
        if (selectedTexture !== "None") {
            handleBumpMapCreation();
        }
    });

    initSelector(bumpMapElements.textureSelector, bumpMapTextureLoader, function () {
        selectedTexture = this.value;
        handleBumpMapCreation();
    });

    initSelector(bumpMapElements.shaderSelector, bumpMapShaderLoader, function () {
        selectedShader = this.value;
        handleBumpMapCreation();
    });

}

initBumpMapUIComponents();