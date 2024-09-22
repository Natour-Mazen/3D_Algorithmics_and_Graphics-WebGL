attribute vec3 aVertexPosition;
attribute vec2 aTexCoords;
attribute vec3 aVertexNormal;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uRMatrix;
uniform vec3 uLightDirection; // Position of the light
uniform vec3 uViewPosition; // Position of the camera

varying vec2 vTexCoords;
varying vec3 vLightDir;
varying vec3 vViewDir;
varying vec3 vNormal;

void main(void)
{
    vec4 pos3D = uMVMatrix * vec4(aVertexPosition, 1.0);
    vTexCoords = aTexCoords;
    vec3 lightPositionView = (uRMatrix * vec4(uLightDirection, 1.0)).xyz;
    vLightDir = normalize(lightPositionView - pos3D.xyz);
    vViewDir = normalize((uMVMatrix * vec4(uViewPosition, 1.0)).xyz - pos3D.xyz);
    vNormal = normalize((uMVMatrix * vec4(aVertexNormal, 0.0)).xyz);
    gl_Position = uPMatrix * pos3D;
}