precision mediump float;

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;

uniform mat4 uMVMatrix;  // Matrice modèle-vue
uniform mat4 uRMatrix;   // Matrice de rotation
uniform mat4 uPMatrix;   // Matrice de projection

varying vec3 vVertexPositionMV;
varying vec3 vVertexPosition;        // Position 3D du vertex
varying vec4 vVertexPositionSpace;   // Position projetée dans l'espace caméra
varying mat4 viMVMatrix;
varying vec3 vVertexNormal;

mat4 transpose(mat4 m);

void main(void)
{
    vVertexPositionMV = (uMVMatrix * vec4(aVertexPosition, 1.0)).xyz;
    // Position originale du vertex (non projetée) pour les calculs dans le fragment shader
    vVertexPosition = aVertexPosition;
    vVertexNormal = vec3(uRMatrix * vec4(aVertexNormal,1.0));

    // Calcul de la position du vertex dans l'espace projeté (clip space)
    vVertexPositionSpace = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);

    viMVMatrix = transpose(uMVMatrix);

    // Assigner la position finale du vertex pour l'affichage
    gl_Position = vVertexPositionSpace;
}

mat4 transpose(mat4 m) {
    return mat4(
    m[0][0], m[1][0], m[2][0], m[3][0],
    m[0][1], m[1][1], m[2][1], m[3][1],
    m[0][2], m[1][2], m[2][2], m[3][2],
    m[0][3], m[1][3], m[2][3], m[3][3]
    );
}