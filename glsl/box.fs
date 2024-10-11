precision mediump float;

uniform vec4 uColor; // Color of the material.
uniform vec4 uAmbientLight; // The ambiant light.
uniform vec4 uLightColor; // The color light.
uniform vec3 uLightPosition; // Position of the light.
uniform float uPI;
uniform float uLightIntensity; // The light intensity.

varying vec3 vVertexPosition;
varying vec3 vVertexNormal;
varying float vLambda;
varying vec2 vTexturePosition;

// ==============================================
void main(void)
{
    // We normalize the normals.
    vec3 normal = normalize(vVertexNormal);

    // Light direction.
    vec3 lightDir = normalize(uLightPosition - vVertexPosition);
    // Weight of the color.
    float weight = max(dot(normal, lightDir), 0.0);

    vec3 color = uColor.rgb;
    if(vLambda < 0.)
    {
        color = vec3(0.7, 0.7, 0.7);
    }

    vec3 fragColor = uLightColor.rgb * color * (1.0 / uPI) * weight * uLightIntensity;

    gl_FragColor = vec4(fragColor, 1.0);
}