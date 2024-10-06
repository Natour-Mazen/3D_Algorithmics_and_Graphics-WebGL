attribute vec3 aVertexPosition;
attribute vec2 aTexCoords;
attribute vec3 aVertexNormal;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

varying vec4 vVertexPosition;
varying vec2 vTexCoords;
varying vec3 vLightDir;

void main(void)
{
    vVertexPosition = uMVMatrix * vec4(aVertexPosition, 1.0);
    vTexCoords = aTexCoords;
    gl_Position = uPMatrix * vVertexPosition;
}