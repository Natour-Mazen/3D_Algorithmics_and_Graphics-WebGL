attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTexCoords;

uniform mat4 uMVMatrix; // Model View Matrix.
uniform mat4 uPMatrix; // Projection Matrix.

varying vec4 vVertexPosition;
varying vec3 vVertexNormal;
varying vec2 vTexCoords;

void main(void)
{
    vVertexPosition = uMVMatrix * vec4(aVertexPosition, 1.0);
    vVertexNormal = aVertexNormal;
    vTexCoords = aTexCoords;
    gl_Position = uPMatrix * vVertexPosition;
}