//precision mediump float;
//
//uniform vec4 uColor; // Color of the material.
//uniform vec4 uAmbientLight; // The ambiant light.
//uniform vec4 uLightColor; // The color light.
//uniform vec3 uLightPosition; // Position of the light.
//uniform float uPI;
//uniform float uLightIntensity; // The light intensity.
//
//varying vec3 vVertexPosition;
//varying vec3 vVertexNormal;
//varying vec3 sVertexPosition;
//varying vec3 vPlanePointMin;
//varying vec3 vPlanePointMax;
//varying vec3 vDirectionRay;
//
const int MAX_ITERATIONS = 1000;

precision mediump float;

varying vec3 vVertexPosition;
varying vec3 vVertexNormal;
varying mat4 vMVMatrix;
varying mat4 vPMatrix;

const int MAX_STEPS = 100;
const float MAX_DIST = 100.0;
const float SURFACE_DIST = 0.01; // Précision du raymarching

// Fonction de distance signée pour un cube centré à l'origine avec des dimensions 1x1x1
float sdfCube(vec3 p, vec3 size) {
    vec3 d = abs(p) - size;
    return min(max(d.x, max(d.y, d.z)), 0.0) + length(max(d, 0.0));
}

// Fonction de raymarching depuis l'intérieur du cube
float rayMarch(vec3 ro, vec3 rd, out vec3 hitNormal) {
    float dO = 0.0; // Distance parcourue par le rayon
    for (int i = 0; i < MAX_STEPS; i++) {
        vec3 p = ro + rd * dO; // Position actuelle du rayon
        vec3 cubeSize = vec3(1.0); // Taille du cube (1x1x1 autour de l'origine)
        float dist = sdfCube(p, cubeSize); // Calcul de la distance au cube
        if (dist < SURFACE_DIST) {
            vec3 absP = abs(p);
            if (absP.x > absP.y && absP.x > absP.z) hitNormal = vec3(sign(p.x), 0.0, 0.0); // Côté X
            else if (absP.y > absP.x && absP.y > absP.z) hitNormal = vec3(0.0, sign(p.y), 0.0); // Côté Y
            else hitNormal = vec3(0.0, 0.0, sign(p.z)); // Côté Z
            return dO; // Retourner la distance parcourue si intersection trouvée
        }
        dO += dist; // Avancer le rayon
        if (dO > MAX_DIST) break; // Si trop loin, arrêter
    }
    return MAX_DIST; // Si pas d'intersection, retourner une grande distance
}


// Fonction pour calculer la direction du rayon dans l'espace de vue
vec3 computeRayDirection(vec2 fragCoord, vec2 resolution) {
    vec2 ndc = (fragCoord / resolution) * 2.0 - 1.0; // Normalized Device Coordinates
    float fov = 45.;
    float aspectRatio = resolution.x / resolution.y;

    // Calcul du FOV (champ de vision) et ajustement à l'aspect ratio
    float tanFov = tan(radians(fov * 0.5));

    // Calcul de la direction du rayon en espace vue
    vec3 rayDir = normalize(vec3(ndc.x * aspectRatio * tanFov, ndc.y * tanFov, -1.0));

    return rayDir;
}

void main(void) {
    vec2 resolution = vec2(1280.0, 720.0); // Résolution de l'écran (à adapter selon ton canvas)
    vec2 fragCoord = gl_FragCoord.xy; // Coordonnées du fragment (pixel actuel)

    // Calculer la direction du rayon
    vec3 rayDir = computeRayDirection(fragCoord, resolution);

    // Position initiale du rayon (position de la caméra)
    vec3 rayOrigin = vec3(0., 0., 10.);

    // The void color.
    vec3 color = vec3(0.7, 0.7, 0.7);

    float multiplier = 1.;
    vec3 point = rayOrigin + rayDir * multiplier;

    for (int i = 0; i < MAX_ITERATIONS; i++)
    {
        if (point.z <= 0.)
        {
            /*
            if (vPlanePointMin.x < point.x && point.x < vPlanePointMax.x
            && vPlanePointMin.y < point.y && point.y < vPlanePointMax.y)
            if (vPlanePointMin.y < point.y && point.y < vPlanePointMax.y
                || vPlanePointMin.y > point.y &&  point.y > vPlanePointMax.y)
            */
            if(point.y > 1.5)
            {
                vec3 pink = vec3(1., 0., 1.);
                color = pink;
            }
            if(point.x < -1.5)
            {
                vec3 red = vec3(1., 0., 0.);
                //color = uColor.rgb;
                color = red;
            }
            if(point.x > 1.5)
            {
                vec3 green = vec3(0., 1., 0.);
                color = green;
            }
            /*
            if(vPlanePointMin.z < point.z &&  point.z < vPlanePointMax.z)
            {
                vec3 green = vec3(0., 1., 0.);
                //color = uColor.rgb;
                color = green;
            }
            */
            break;
        }
        multiplier += 0.01;
        point = rayOrigin + rayDir * multiplier;
    }

//    // We normalize the normals.
//    vec3 normal = normalize(vVertexNormal);
//
//    // Light direction.
//    vec3 lightDir = normalize(uLightPosition - vVertexPosition);
//    // Weight of the color.
//    float weight = max(dot(normal, lightDir), 0.0);

    //vec3 fragColor = uLightColor.rgb * color * (1.0 / uPI) * weight * uLightIntensity;

    //gl_FragColor = vec4(fragColor, 1.0);
    gl_FragColor = vec4(color, 1.0);

//    // Lancer le raymarching et obtenir la normale de la face touchée
//    vec3 hitNormal;
//    float dist = rayMarch(rayOrigin, rayDir, hitNormal);
//
//    // Si le rayon touche le cube, colorer selon la face touchée
//    if (dist < MAX_DIST) {
//        vec3 color;
//        if (hitNormal.x != 0.0) color = vec3(1.0, 0.0, 0.0); // Face X en rouge
//        else if (hitNormal.y != 0.0) color = vec3(0.0, 1.0, 0.0); // Face Y en vert
//        else color = vec3(0.0, 0.0, 1.0); // Face Z en bleu
//        gl_FragColor = vec4(color, 1.0); // Coloration du fragment
//    } else {
//        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); // Arrière-plan noir
//    }
}

//void main(void)
//{
//    // The void color.
//    vec3 color = vec3(0.7, 0.7, 0.7);
//
//    float multiplier = 1.;
//    vec3 point = vDirectionRay;
//
//    for (int i = 0; i < MAX_ITERATIONS; i++)
//    {
//        if (point.z <= 0.)
//        {
//            if(point.y > 10.5)
//            {
//                vec3 pink = vec3(1., 0., 1.);
//                color = pink;
//            }
//            if(point.x < -10.5)
//            {
//                vec3 red = vec3(1., 0., 0.);
//                //color = uColor.rgb;
//                color = red;
//            }
//            if(point.x > 10.5)
//            {
//                vec3 green = vec3(0., 1., 0.);
//                color = green;
//            }
//            break;
//        }
//        multiplier += 0.01;
//        point = vDirectionRay * multiplier;
//    }
//
//    // We normalize the normals.
//    vec3 normal = normalize(vVertexNormal);
//
//    // Light direction.
//    vec3 lightDir = normalize(uLightPosition - vVertexPosition);
//    // Weight of the color.
//    float weight = max(dot(normal, lightDir), 0.0);
//
//    vec3 fragColor = uLightColor.rgb * color * (1.0 / uPI) * weight * uLightIntensity;
//
//    gl_FragColor = vec4(fragColor, 1.0);
//    //gl_FragColor = vec4(color, 1.0);
//}

//void main(void)
//{
//    // The void color.
//    vec3 color = vec3(0.7, 0.7, 0.7);
//
//    //vec3 cameraPos = vec3(0., 0., 0.);
//    vec3 cameraPos = sVertexPosition;
//
//    vec3 lightDirection = cameraPos + vDirectionRay;
//    lightDirection = normalize(lightDirection);
//    vec3 vertexNormal = normalize(vVertexNormal);
//
//    float division = dot(lightDirection, vertexNormal);
//    if(division < 0.)
//    {
//        float lambda = (dot(vVertexPosition, vertexNormal) - dot(cameraPos, vertexNormal)) / division;
//
//        vec3 point = cameraPos + lightDirection * lambda;
//        float multiplier = 1.;
//
//        for (int i = 0; i < MAX_ITERATIONS; i++)
//        {
//            if (point.z <= 0.)
//            {
//                /*
//                if (vPlanePointMin.x < point.x && point.x < vPlanePointMax.x
//                && vPlanePointMin.y < point.y && point.y < vPlanePointMax.y)
//                if (vPlanePointMin.y < point.y && point.y < vPlanePointMax.y
//                    || vPlanePointMin.y > point.y &&  point.y > vPlanePointMax.y)
//                */
//                if(point.y > 1.)
//                {
//                    vec3 pink = vec3(1., 0., 1.);
//                    color = pink;
//                }
//                if(point.x < -1.)
//                {
//                    vec3 red = vec3(1., 0., 0.);
//                    //color = uColor.rgb;
//                    color = red;
//                }
//                if(point.x > 1.)
//                {
//                    vec3 green = vec3(0., 1., 0.);
//                    color = green;
//                }
//                /*
//                if(vPlanePointMin.z < point.z &&  point.z < vPlanePointMax.z)
//                {
//                    vec3 green = vec3(0., 1., 0.);
//                    //color = uColor.rgb;
//                    color = green;
//                }
//                */
//                break;
//            }
//            multiplier += 0.01;
//            point = cameraPos + lightDirection * lambda * multiplier;
//        }
//    }
//
//    // We normalize the normals.
//    vec3 normal = normalize(vVertexNormal);
//
//    // Light direction.
//    vec3 lightDir = normalize(uLightPosition - vVertexPosition);
//    // Weight of the color.
//    float weight = max(dot(normal, lightDir), 0.0);
//
//    vec3 fragColor = uLightColor.rgb * color * (1.0 / uPI) * weight * uLightIntensity;
//
//    gl_FragColor = vec4(fragColor, 1.0);
//    //gl_FragColor = vec4(color, 1.0);
//}
