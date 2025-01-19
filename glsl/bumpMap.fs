// Lambert Fragment shader.
precision mediump float;

uniform sampler2D uSampler; // Texture.
uniform sampler2D uBumpSampler; // Texture for the bump map.
uniform vec4 uAmbientLight; // The ambiant light.
uniform vec4 uLightColor; // The color light.
uniform bool uBumMap; // true if the bump map is activeted, false otherwise.
uniform float uLightIntensity; // The light intensity.
uniform float uPI;
uniform vec4 uLightSpecular;
uniform float uLightShininess;
uniform bool uIsPhongShader; // true if the shader is a phong shader, false otherwise.

varying vec2 vTexCoords;
varying vec3 vVertexNormal;
varying vec3 vTangentVertexPosition;
varying vec3 vTangentLightPos;

void main(void)
{
    vec3 normal = vVertexNormal;
    if(uBumMap)
    {
        // The normal from the bump map.
        normal = texture2D(uBumpSampler, vTexCoords).rgb;
        normal = normal * 2.0 - 1.0;
        normal = normalize(normal);
    }

    // Light direction
    vec3 lightDir = normalize(vTangentLightPos - vTangentVertexPosition);
    // Weight of the color.
    float weight = max(dot(normal, lightDir), 0.0);

    // Texture color.
    vec4 texColor = texture2D(uSampler, vTexCoords);

    // Lambert formula by MESEURE Philippe.
    // ColorFrag = (lightAmb + lightDiff * (normal . lightDir)) * colorMaterial
    // Lambertian reflection.
    //vec3 fragColor = texColor.rgb * weight * (uAmbientLight.rgb + weight * uLightColor.rgb);

    vec3 fragColor;
    // Course Formula.
    if(uIsPhongShader){
         fragColor = phongLighting( // phongLighting function from glsl/common.glsl
            uLightShininess, // shininess
            lightDir, // lightDir
            uLightSpecular, // lightSpecular
            uLightColor, // lightColor
            texColor, // texColor
            uPI, // PI
            weight, // weight
            normal // normal
        );
    }else{
         fragColor = lambertLighting( // lambertLighting function from glsl/common.glsl
            uLightIntensity, // lightIntensity
            uLightColor, // lightColor
            texColor, // texColor
            weight, // weight
            uPI // PI
        );
    }


    gl_FragColor = vec4(fragColor, 1.0);
}