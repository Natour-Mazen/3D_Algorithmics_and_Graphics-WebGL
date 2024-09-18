// Vertex Shader
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
    // Passe les coordonnées de texture au fragment shader
    texCoords = aTexCoords;

    // Transforme la position du sommet dans l'espace du modèle
    vPosition = uMVMatrix * vec4(aVertexPosition, 1.0);

    // Transforme la normale du sommet en utilisant la matrice normale
    vTransformedNormal = uNMatrix * aVertexNormal;

    // Calcule la position finale du sommet
    gl_Position = uPMatrix * vPosition;
}
