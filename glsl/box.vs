attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;

uniform mat4 uRMatrix;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

varying vec4 vVertexPostion;
varying vec3 vVertexNormal;

void main(void) {
    vVertexPostion = uMVMatrix * vec4(aVertexPosition,1.0);
    vVertexNormal = vec3(uRMatrix * vec4(aVertexNormal,1.0));
    gl_Position = uPMatrix * vVertexPostion;
}