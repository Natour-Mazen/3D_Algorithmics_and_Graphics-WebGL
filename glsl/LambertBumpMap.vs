attribute vec3 aVertexPosition;
attribute vec2 aTexCoords;
attribute vec3 aVertexNormal;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat3 uNMatrix;

varying vec2 texCoords;
varying vec3 vTransformedNormal;
varying vec4 vPosition;

void main(void) {
    texCoords = aTexCoords;
    vPosition = uMVMatrix * vec4(aVertexPosition, 1.0);
    vTransformedNormal = uNMatrix * aVertexNormal;

    gl_Position = uPMatrix * vPosition;
}