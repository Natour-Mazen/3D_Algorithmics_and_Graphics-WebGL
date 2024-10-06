precision mediump float;

uniform sampler2D uSampler; // Texture.
uniform vec4 uColor; // Color of the material.
uniform vec4 uAmbientLight; // The ambiant light.
uniform vec4 uLightColor; // The color light.
uniform vec3 uLightPosition; // Position of the light.

varying vec2 vTexCoords;
varying vec4 vVertexPosition;
varying vec3 vVertexNormal;

void main(void) {

    // Texture color.
    vec4 texColor = texture2D(uSampler, vTexCoords);

    // Light direction
    vec3 lightDir = normalize(uLightPosition - vVertexPosition.xyz);
    // Weight of the color.
    float weight = max(dot(vVertexNormal, lightDir), 0.0);

    // Lambertian reflection.
    vec3 fragColor = texColor.xyz * (uAmbientLight.xyz + weight * uLightColor.xyz);

    gl_FragColor = vec4(fragColor, 1.0);
}