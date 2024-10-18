precision mediump float;

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;

uniform mat4 uMVMatrix;  // Matrice modèle-vue
uniform mat4 uRMatrix;   // Matrice de rotation
uniform mat4 uPMatrix;   // Matrice de projection

varying vec3 vVertexPosition;        // Position 3D du vertex
varying vec4 vVertexPositionSpace;   // Position projetée dans l'espace caméra

void main(void) {
    // Position originale du vertex (non projetée) pour les calculs dans le fragment shader
    vVertexPosition = aVertexPosition;

    // Calcul de la position du vertex dans l'espace projeté (clip space)
    vVertexPositionSpace = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);

    // Assigner la position finale du vertex pour l'affichage
    gl_Position = vVertexPositionSpace;
}