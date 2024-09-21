attribute vec3 aVertexPosition;
attribute vec2 aTexCoords;
attribute vec3 aVertexNormal;

uniform mat4 uRMatrix;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

varying vec4 pos3D;
varying vec2 vTexCoords;

void main(void)
{
    pos3D = uMVMatrix * vec4(aVertexPosition, 1.0);
    vTexCoords = aTexCoords;
    gl_Position = uRMatrix * pos3D;
}