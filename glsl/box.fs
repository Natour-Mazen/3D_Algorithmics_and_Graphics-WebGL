precision mediump float;

//uniform vec4 uColor; // Color of the material.
//uniform vec4 uAmbientLight; // The ambiant light.
//uniform vec4 uLightColor; // The color light.
//uniform vec3 uLightPosition; // Position of the light.
//uniform float uPI;
//uniform float uLightIntensity; // The light intensity.

uniform mat4 uinvRMatrix;
uniform mat4 uinvMVMatrix;
uniform mat4 uinvPMatrix;

const int MAX_ITERATIONS = 1000;

varying vec3 vVertexPosition;
varying vec3 vVertexNormal;
varying mat4 vMVMatrix;
varying mat4 vPMatrix;

varying vec3 vPlanePointMin;
varying vec3 vPlanePointMax;
varying vec3 vCameraPosition;

// Fonction pour calculer la direction du rayon dans l'espace de vue
vec3 computeRayDirection(vec2 fragCoord, vec2 resolution) {
    vec2 ndc = (fragCoord / resolution) * 2.0 - 1.0; // Normalized Device Coordinates
    //float fov = 45.;
    //float aspectRatio = resolution.x / resolution.y;

    // Calcul de la direction du rayon en espace vue
    //vec3 rayDir = normalize(vec3(ndc.x * aspectRatio * fov, ndc.y * aspectRatio * fov, -1.0));

    //rayDir = (vPMatrix * vec4(rayDir, 1.0)).xyz;

    vec4 clipSpace = vec4(ndc, -1.0, 1.0); // Clip space position
    vec4 viewSpace = uinvPMatrix * clipSpace; // Pass to view space

    viewSpace /= viewSpace.w; // Normalize the perspective division

    // Calculer la direction en espace monde en utilisant l'inverse de la matrice modèle-vue
    vec3 rayWorld = (uinvMVMatrix * vec4(viewSpace.xyz, 0.0)).xyz;
    rayWorld = normalize(rayWorld);

    return rayWorld;

    //return rayDir;
}

void main(void) {
    vec2 resolution = vec2(1280.0 - 18., 720.0 - 18.); // Résolution de l'écran (à adapter selon ton canvas)
    vec2 fragCoord = gl_FragCoord.xy; // Coordonnées du fragment (pixel actuel)

    // Calculer la direction du rayon
    vec3 rayDir = computeRayDirection(fragCoord, resolution);

    // Position initiale du rayon (position de la caméra)
    //vec3 rayOrigin = vec3(0., 0., 0.);
    vec3 rayOrigin = vVertexPosition;

    // The void color.
    vec3 color = vec3(0.7, 0.7, 0.7);


    float multiplier = 0.;
    vec3 point = rayOrigin + rayDir * multiplier;

    for (int i = 0; i < MAX_ITERATIONS; i++)
    {
        if (point.z <= 0.)
        {
            float xMin = vPlanePointMax.x - 10.;
            float xMax = vPlanePointMax.x;
            float yMin = vPlanePointMax.y - 10.;
            float yMax = vPlanePointMax.y;

            if(xMin <= point.x && point.x <= xMax
            && yMin <= point.y && point.y <= yMax)
            {
                vec3 red = vec3(1., 0., 0.);
                //color = uColor.rgb;
                color = red;
            }

            break;
        }

        multiplier += 0.1;
        point = rayOrigin + rayDir * multiplier;
    }
    if(rayDir.x > 0.)
    {
        rayDir.x = 1.;
    }
    if(rayDir.y > 0.)
    {
        rayDir.y = 1.;
    }
    color = rayDir;

    gl_FragColor = vec4(color, 1.0);
}
