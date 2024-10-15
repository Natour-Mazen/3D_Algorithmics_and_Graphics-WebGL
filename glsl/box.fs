precision mediump float;

//uniform vec4 uColor; // Color of the material.
//uniform vec4 uAmbientLight; // The ambiant light.
//uniform vec4 uLightColor; // The color light.
//uniform vec3 uLightPosition; // Position of the light.
//uniform float uPI;
//uniform float uLightIntensity; // The light intensity.

const int MAX_ITERATIONS = 500;

varying vec3 vVertexPosition;
varying vec3 vVertexNormal;
varying mat4 vMVMatrix;
varying mat4 vPMatrix;
varying vec3 vPlanePointMax;

// Fonction pour calculer la direction du rayon dans l'espace de vue
vec3 computeRayDirection(vec2 fragCoord, vec2 resolution) {
    vec2 ndc = (fragCoord / resolution) * 2.0 - 1.0; // Normalized Device Coordinates
    float fov = 45.;
    float aspectRatio = resolution.x / resolution.y;

    // Calcul du FOV (champ de vision) et ajustement à l'aspect ratio
    float tanFov = tan(radians(fov * 0.5));

    // Calcul de la direction du rayon en espace vue
    vec3 rayDir = normalize(vec3(ndc.x * aspectRatio * tanFov, ndc.y * aspectRatio * tanFov, -1.0));

    return rayDir;
}

void main(void) {
    vec2 resolution = vec2(1280.0 - 18., 720.0 - 18.); // Résolution de l'écran (à adapter selon ton canvas)
    vec2 fragCoord = gl_FragCoord.xy; // Coordonnées du fragment (pixel actuel)

    // Calculer la direction du rayon
    vec3 rayDir = computeRayDirection(fragCoord, resolution);

    // Position initiale du rayon (position de la caméra)
    vec3 rayOrigin = vec3(0., 0., 0.);

    // The void color.
    vec3 color = vec3(0.7, 0.7, 0.7);

    float multiplier = 1.;
    vec3 point = rayOrigin + rayDir * multiplier;
    if(point.x > 0.)
    {
        point.x = 1.;
    }
    if(point.y > 0.)
    {
        point.y = 1.;
    }
    color = point;

    gl_FragColor = vec4(color, 1.0);
}