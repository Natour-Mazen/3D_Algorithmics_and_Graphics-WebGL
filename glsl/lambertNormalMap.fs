precision mediump float;

uniform sampler2D uSampler; // Texture.
uniform sampler2D uBumpSampler; // Texture for the bump map.
uniform vec4 uColor; // Color of the material.
uniform vec4 uAmbientLight; // The ambiant light.
uniform vec4 uLightColor; // The color light.
uniform mat4 uRMatrix; // Normal Matrix.
uniform vec3 uLightPosition; // Position of the light.

varying vec2 vTexCoords;
varying vec4 vVertexPosition;

void main(void) {
    // Use the normal from the bump map.
    vec3 normal = texture2D(uBumpSampler, vTexCoords).rgb;
    //normal = normalize(vec3(normal.x * 2.0 - 1.0, normal.y * 2.0 - 1.0, normal.z));
    //normal = normalize(vec3(normal.x * 2.0 - 1.0, normal.y, normal.z * 2.0 - 1.0));
    normal = normal * 2.0 - 1.0;
    normal = (uRMatrix * vec4(normal, 1.0)).xyz;
    normal = normalize(normal);

    // Light direction
    vec3 lightDir = normalize(uLightPosition - vVertexPosition.xyz);
    // Weight of the color.
    float weight = max(dot(normal, lightDir), 0.0);

    // Texture color.
    vec4 texColor = texture2D(uSampler, vTexCoords);

    // Lambertian reflection.
    vec3 fragColor = texColor.rgb * weight * (uAmbientLight.rgb + weight * uLightColor.rgb);

    gl_FragColor = vec4(fragColor, 1.0);
}