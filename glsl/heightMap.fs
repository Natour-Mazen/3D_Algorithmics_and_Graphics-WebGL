// Fragment Shader
precision mediump float;

uniform sampler2D uSampler;
uniform vec3 uColor; // Not used here.
uniform bool uIsColor; // true we display the shader color, false otherwise.
uniform vec4 uAmbientLight; // The ambiant light.
uniform vec4 uLightColor; // The color light.
uniform vec3 uLightPosition; // Position of the light.
uniform float uPI;
uniform float uLightIntensity; // The light intensity.
uniform vec4 uLightSpecular;
uniform float uLightShininess;
uniform bool uIsPhongShader; // true if the shader is a phong shader, false otherwise.

varying vec4 vVertexPosition;
varying vec3 vVertexNormal;
varying vec2 vTexCoord;
varying float vHeight;

void main(void)
{
    // We normalize the normals.
    vec3 normal = normalize(vVertexNormal);

    // Light direction.
    vec3 lightDir = normalize(uLightPosition - vVertexPosition.xyz);
    // Weight of the color.
    float weight = max(dot(normal, lightDir), 0.0);

    vec4 finalColor = vec4(0., 0., 0., 1.);

    // If we use the pre-defined color.
    if(uIsColor)
    {
        vec4 sandColor = vec4(0.9, 0.9, 0.3, 1.);
        vec4 planeColor = vec4(0.2, 0.7, 0.15, 1.);
        vec4 forestColor = vec4(0.2, 0.45, 0.1, 1.);
        vec4 stoneColor = vec4(0.5, 0.5, 0.5, 1.);
        vec4 snowColor = vec4(1.0, 1.0, 1.0, 1.);
        vec4 waterColor = vec4(0.0, 0.0, 1.0, 1.);

        // The height need to be between 0 and 1.
        // The z-axis is equal to the y-axis.
        float heightNorm = clamp(vHeight, 0.0, 1.0);

        // Transition between colors.
        if(heightNorm < 0.01) {
            //water
            finalColor = waterColor;
        }
        else if (heightNorm < 0.02) { // 0.0 / 0.02 > 0.02
            finalColor = sandColor;
        }
        else if (heightNorm < 0.05) { // 0.02 / 0.5 > 0.03
            float factor = (heightNorm - 0.02) / 0.03;
            finalColor = mix(sandColor, planeColor, factor);
        }
        else if (heightNorm < 0.1) { // 0.05 / 0.1 > 0.05
            finalColor = planeColor;
        }
        else if (heightNorm < 0.15) { // 0.1 / 0.15 > 0.05
            float factor = (heightNorm - 0.1) / 0.05;
            finalColor = mix(planeColor, forestColor, factor);
        }
        else if (heightNorm < 0.25) { // 0.15 / 0.25 > 0.1
            finalColor = forestColor;
        }
        else if (heightNorm < 0.35) { // 0.25 / 0.35 > 0.1
            float factor = (heightNorm - 0.25) / 0.1;
            finalColor = mix(forestColor, stoneColor, factor);
        }
        else if(heightNorm < 0.7) { // 0.35 / 0.7 > 0.35
            finalColor = stoneColor;
        }
        else if (heightNorm < 0.8){ // 0.7 / 0.8 > 0.1
            float factor = (heightNorm - 0.7) / 0.1;
            finalColor = mix(stoneColor, snowColor, factor);
        }
        else {
            finalColor = snowColor;
        }
        finalColor = finalColor;
    }
    else // We use the texture color.
    {
        vec4 textureColor = texture2D(uSampler, vTexCoord);
        finalColor = textureColor;
    }

    // OLD Formula.
    //vec3 fragColor = finalColor * (uAmbientLight.rgb + weight * uLightColor.rgb);

    vec3 fragColor;
    // Course Formula.
    if(uIsPhongShader){
        fragColor = phongLighting( // phongLighting function from glsl/common.glsl
            uLightShininess, // shininess
            lightDir, // lightDir
            uLightSpecular, // lightSpecular
            uLightColor, // lightColor
            finalColor, // texColor or the color of the material
            uPI, // PI
            weight, // weight
            normal // normal
        );
    }else{
        fragColor = lambertLighting( // lambertLighting function from glsl/common.glsl
            uLightIntensity, // lightIntensity
            uLightColor, // lightColor
            finalColor, // texColor or the color of the material
            weight, // weight
            uPI // PI
        );
    }

    gl_FragColor = vec4(fragColor, 1.0);
}