attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTexCoords;

uniform mat4 uMVMatrix; // Model View Matrix.
uniform mat4 uPMatrix; // Projection Matrix.
uniform mat4 uRMatrix; // Normal Matrix.

varying vec2 vTexCoords;
varying vec4 vVertexPosition;
varying vec3 vVertexNormal;

void main(void) {
    vVertexPosition = uMVMatrix * vec4(aVertexPosition, 1.0);
    vTexCoords = aTexCoords;
    //vVertexNormal = normalize((uRMatrix * vec4(aVertexNormal, 1.0)).xyz);
    vVertexNormal = aVertexNormal;
    gl_Position = uPMatrix * vVertexPosition;
}