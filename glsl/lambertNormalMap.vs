attribute vec3 aVertexPosition;
attribute vec2 aTexCoords;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

varying vec4 pos3D;
varying vec2 vTexCoords;

void main(void)
{
    pos3D = uMVMatrix * vec4(aVertexPosition,1.0);
    vTexCoords = aTexCoords;
    gl_Position = uPMatrix * pos3D;
}