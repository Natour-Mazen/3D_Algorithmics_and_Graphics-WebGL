// Vertex Shader
attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTexCoord;

uniform mat4 uRMatrix;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

varying vec4 vVertexPosition;
varying vec3 vVertexNormal;
varying vec2 vTexCoord;
varying float vHeight;

void main(void) {
    vVertexPosition = uMVMatrix * vec4(aVertexPosition,1.0);
    vVertexNormal = vec3(uRMatrix * vec4(aVertexNormal,1.0));
    vTexCoord = aTexCoord;
    vHeight = aVertexPosition.z;
    gl_Position = uPMatrix * vVertexPosition;
}