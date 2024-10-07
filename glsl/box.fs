precision mediump float;

uniform vec4 uColor;

varying vec4 vVertexPostion;
varying vec3 vVertexNormal;

// ==============================================
void main(void)
{
    gl_FragColor = uColor;
}