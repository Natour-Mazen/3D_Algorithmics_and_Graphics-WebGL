// Lambert Fragment shader.
precision mediump float;

#define PI 3.1415926535897932384626433832795

uniform sampler2D uSampler; // Texture.
uniform sampler2D uBumpSampler; // Texture for the bump map.
uniform vec4 uColor; // Color of the material.
uniform vec4 uAmbientLight; // The ambiant light.
uniform vec4 uLightColor; // The color light.
uniform bool uBumMap; // true if the bump map is activeted, false otherwise.
uniform float uLightIntensity; // The light intensity.

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

    // Course Formula.
    vec3 fragColor = uLightColor.rgb * texColor.rgb * (1.0 / PI) * weight * uLightIntensity;

    gl_FragColor = vec4(fragColor, 1.0);
}