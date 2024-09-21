attribute vec3 aVertexPosition;
attribute vec2 aTexCoords;
attribute vec3 aVertexNormal;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uRMatrix;
uniform vec3 uLightDirection; // Position of the light

varying vec2 vTexCoords;
varying vec3 vLightDir;

void main(void)
{
    vec4 pos3D = uMVMatrix * vec4(aVertexPosition, 1.0);
    vTexCoords = aTexCoords;
    vec3 lightPositionView = (uRMatrix * vec4(uLightDirection, 1.0)).xyz;
    vLightDir = normalize(lightPositionView - pos3D.xyz);
    gl_Position = uPMatrix * pos3D;
}