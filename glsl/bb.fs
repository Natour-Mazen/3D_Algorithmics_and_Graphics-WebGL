precision mediump float;

uniform mat4 uinvRMatrix;
uniform mat4 uinvMVMatrix;
uniform mat4 uinvPMatrix;

const int MAX_ITERATIONS = 1000;

varying vec3 vVertexPosition;
varying vec4 vVertexPositionSpace;


void main(void) {

    vec3 color = vec3(0.7, 0.7, 0.7);

    vec2 pixel = vVertexPositionSpace.xy / vVertexPositionSpace.w;
    vec3 dirCam = vec3(pixel, -2.41);
    vec3 dirPixelObj = (uinvMVMatrix * vec4(dirCam, 1.0)).xyz;

    float t = - (vVertexPosition.z / dirPixelObj.z);
    vec3 position = vVertexPosition + t * dirPixelObj;

    if(position.x <= 1. && position.x >= -1. && position.y <= 1. && position.y >= -1.)
    {
        vec3 red = vec3(1.0, 0., 0.);
        color = red;
    }

    gl_FragColor = vec4(color, 1.0);
}
