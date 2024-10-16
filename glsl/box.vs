attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;

uniform mat4 uMVMatrix;
uniform mat4 uRMatrix;
uniform mat4 uPMatrix;

varying vec3 vVertexPosition;
varying vec3 vVertexNormal;
varying mat4 vMVMatrix;
varying mat4 vPMatrix;

varying vec3 vPlanePointMin;
varying vec3 vPlanePointMax;
varying vec3 vCameraPosition;

void main(void) {
    vec4 vertexPosition = uMVMatrix * vec4(aVertexPosition, 1.0);
    vVertexPosition = vertexPosition.xyz;
    vVertexNormal = vec3(uRMatrix * vec4(aVertexNormal,1.0));

    vMVMatrix = uMVMatrix;
    vPMatrix = uPMatrix;

    vCameraPosition = (uMVMatrix * vec4(0., 0., 0., 1.)).xyz;
    vPlanePointMin = (uMVMatrix * vec4(-5.5, -5.5, 0., 1.)).xyz;
    vPlanePointMax = (uMVMatrix * vec4(5.5, 5.5, 0., 1.)).xyz;
    vPlanePointMax = (uMVMatrix * vec4(10.5, 10.5, 0., 1.)).xyz;

    gl_Position = uPMatrix * vertexPosition;
}


// TODO : Faire le shader de lambert
// TODO : Faire le calcul pour savoir si le ray touche la boite
// TODO : Dans le Frag, regarder si le point d'intersection avec la boite est en dessous ou au dessus de la bump map
// TODO : Dans le Frag, (si non on affiche rien, la couleur du fond), si oui on fait Bresenham pour avoir la ligne sur la height map.
// TODO : Dnas le Frag, passer par tout les points de la ligne et voir si en avançant le point en même temps que la ligne
// si on est à la même hauteur que la height map.
