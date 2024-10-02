// Vertex Shader
attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTexCoord;

uniform mat4 uRMatrix;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

varying vec4 pos3D;
varying vec3 N;
varying vec2 vTexCoord;
varying float vHeight;

void main(void) {
    pos3D = uMVMatrix * vec4(aVertexPosition,1.0);
    N = vec3(uRMatrix * vec4(aVertexNormal,1.0));
    vTexCoord = aTexCoord;
    vHeight = aVertexPosition.z; // z = y
    gl_Position = uPMatrix * pos3D;
}