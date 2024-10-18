attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;

uniform mat4 uMVMatrix;
uniform mat4 uRMatrix;
uniform mat4 uPMatrix;

varying vec3 vVertexPosition;
varying vec4 vVertexPositionSpace;

void main(void) {
    vec4 vertexPosition = uMVMatrix * vec4(aVertexPosition, 1.0);
    vVertexPosition = aVertexPosition;

    vVertexPositionSpace = uPMatrix * vertexPosition;

    gl_Position = vVertexPositionSpace;

    vVertexPositionSpace.z / vVertexPositionSpace.w;
}



