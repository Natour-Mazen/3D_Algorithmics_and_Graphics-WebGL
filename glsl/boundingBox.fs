precision mediump float;

uniform mat4 uinvRMatrix;   // Matrice inverse de rotation
uniform mat4 uinvMVMatrix;  // Matrice inverse modèle-vue
uniform mat4 uinvPMatrix;   // Matrice inverse de projection

const int MAX_ITERATIONS = 1000;  // Constante d'itérations maximum (si nécessaire)

varying vec3 vVertexPosition;        // Position 3D du vertex
varying vec4 vVertexPositionSpace;   // Position projetée dans l'espace caméra

void main(void) {
    // Couleur par défaut (gris clair)
    vec3 color = vec3(0.7, 0.7, 0.7);

    // Conversion des coordonnées du vertex dans l'espace écran (normé)
    vec2 pixel = vVertexPositionSpace.xy / vVertexPositionSpace.w;

    // Calcul de la direction du rayon dans l'espace caméra
    vec3 dirCam = vec3(pixel, -2.41);

    // Transformation du rayon dans l'espace objet
    vec3 dirPixelObj = (uinvMVMatrix * vec4(dirCam, 1.0)).xyz;

    // Calcul de la valeur de `t` pour l'intersection avec le plan z = 0
    float t = -(vVertexPosition.z / dirPixelObj.z);

    // Calcul de la position du point d'intersection
    vec3 position = vVertexPosition + t * dirPixelObj;

    // Si le point est dans les bornes du plan (boîte englobante)
    if(position.x >= 1.0 || position.x <= -1.0 || position.y >= 1.0 || position.y <= -1.0) {
        discard;
    }
    // On change la couleur du plan en rouge
    color = vec3(1.0, 0.0, 0.0);
    // Sortie de la couleur du fragment
    gl_FragColor = vec4(color, 1.0);


}