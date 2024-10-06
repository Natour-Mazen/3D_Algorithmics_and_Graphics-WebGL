// Object vertex shader.
attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;

uniform mat4 uRMatrix;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

varying vec4 vVertexPosition;
varying vec3 vVertexNormal;
varying vec3 vLightPos;

void main(void) {
	vVertexPosition = uMVMatrix * vec4(aVertexPosition,1.0);
	vVertexNormal = vec3(uRMatrix * vec4(aVertexNormal,1.0));
	//vVertexNormal = aVertexNormal;
	gl_Position = uPMatrix * vVertexPosition;
}
