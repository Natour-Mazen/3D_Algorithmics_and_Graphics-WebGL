precision mediump float;

uniform vec4 uColor; // Color of the material.
uniform vec4 uAmbientLight; // The ambiant light.
uniform vec4 uLightColor; // The color light.
uniform float uLightIntensity; // The light intensity.
uniform float uPI;

uniform sampler2D uHeightMapTypeSampler;
uniform sampler2D uHeightMapTextureSampler;

uniform mat4 uinvRMatrix;   // Matrice inverse de rotation
uniform mat4 uinvMVMatrix;  // Matrice inverse modèle-vue
uniform mat4 uinvPMatrix;   // Matrice inverse de projection

const int MAX_ITERATIONS = 1000;  // Constante d'itérations maximum (si nécessaire)
const float SCALE = 10.5;
const float BOUNDING_BOX_SIZE = 10.5;
const float FLATTEN = 10.5;

const float DIAGO = sqrt(sqrt(10.5 * 10.5 + 10.5 * 10.5) * sqrt(10.5 * 10.5 + 10.5 * 10.5) + 10.5 * 10.5);
const float PAS = DIAGO / sqrt(512. * 512. + 512. * 512.) * 2.;

varying vec3 vVertexPositionMV;
varying vec3 vVertexPosition;        // Position 3D du vertex
varying vec4 vVertexPositionSpace;   // Position projetée dans l'espace caméra
varying mat4 viMVMatrix;
varying vec3 vVertexNormal;

vec3 RGB2Lab(vec3 rgb);

void main(void)
{
    // Couleur par défaut (gris clair)
    vec3 color = vec3(0.7, 0.7, 0.7);

    // Conversion des coordonnées du vertex dans l'espace écran (normé)
    vec2 pixel = vVertexPositionSpace.xy / vVertexPositionSpace.w;

    // Calcul de la direction du rayon dans l'espace caméra
    vec3 dirCam = vec3(pixel, -2.41);

    // Transformation du rayon dans l'espace objet
    vec3 dirPixelObj = normalize((viMVMatrix * vec4(dirCam, 1.0)).xyz);

    //loat t = 0.005;
    float t = PAS;
    vec3 position = vVertexPosition + t * dirPixelObj;

    vec4 texHeightMap = texture2D(uHeightMapTypeSampler, ((position.xy / SCALE) + 1.) / 2.);
    //float heightMapL = RGB2Lab(texHeightMap.xyz).x;
    float heightMapL = texHeightMap.x * FLATTEN;

    for (int i = 0; i < MAX_ITERATIONS; i++)
    {
        if(abs(heightMapL - position.z) < 0.2)
        {
            vec4 texColor = texture2D(uHeightMapTextureSampler, ((position.xy / SCALE) + 1.) / 2.);
            color = texColor.xyz;
            //color = vec3(1., 0., 0.);
            break;
        }
        if(heightMapL > position.z || position.x >= BOUNDING_BOX_SIZE || position.x <= -BOUNDING_BOX_SIZE
        || position.y >= BOUNDING_BOX_SIZE || position.y <= -BOUNDING_BOX_SIZE)
        {
            discard;
            break;
        }

        //t += 0.005;
        t += PAS;
        position = vVertexPosition + t * dirPixelObj;
        texHeightMap = texture2D(uHeightMapTypeSampler, ((position.xy / SCALE) + 1.) / 2.);
        //heightMapL = RGB2Lab(texHeightMap.xyz).x;
        heightMapL =  texHeightMap.x * FLATTEN;
    }

    /*
    // Calcul de la valeur de `t` pour l'intersection avec le plan z = 0
    float t = -(vVertexPosition.z / dirPixelObj.z);

    // Calcul de la position du point d'intersection
    vec3 position = vVertexPosition + t * dirPixelObj;

    // Si le point est dans les bornes du plan (boîte englobante)
    if(position.x >= 10.0 || position.x <= -10.0 || position.y >= 10.0 || position.y <= -10.0)
    {
        discard;
    }
    // On change la couleur du plan en rouge
    color = vec3(1.0, 0.0, 0.0);

    vec3 normal = vVertexNormal;

    // Light direction
    vec3 lightDir = normalize(vec3(0., 0., 0.) - vVertexPositionMV);
    // Weight of the color.
    float weight = max(dot(normal, lightDir), 0.0);
    */

    // Course Formula.
    //vec3 fragColor = uLightColor.rgb * color * (1.0 / uPI) * weight * uLightIntensity;

    // Sortie de la couleur du fragment
    gl_FragColor = vec4(color, 1.0);
}

vec3 RGB2Lab(vec3 rgb)
{
    float R = rgb.x;
    float G = rgb.y;
    float B = rgb.z;
    // threshold
    float T = 0.008856;

    float X = R * 0.412453 + G * 0.357580 + B * 0.180423;
    float Y = R * 0.212671 + G * 0.715160 + B * 0.072169;
    float Z = R * 0.019334 + G * 0.119193 + B * 0.950227;

    // Normalize for D65 white point
    X = X / 0.950456;
    Y = Y;
    Z = Z / 1.088754;

    bool XT, YT, ZT;
    XT = false; YT=false; ZT=false;
    if(X > T) XT = true;
    if(Y > T) YT = true;
    if(Z > T) ZT = true;

    float Y3 = pow(Y,1.0/3.0);
    float fX, fY, fZ;
    if(XT){ fX = pow(X, 1.0/3.0);} else{ fX = 7.787 * X + 16.0/116.0; }
    if(YT){ fY = Y3; } else{ fY = 7.787 * Y + 16.0/116.0 ; }
    if(ZT){ fZ = pow(Z,1.0/3.0); } else{ fZ = 7.787 * Z + 16.0/116.0; }

    float L; if(YT){ L = (116.0 * Y3) - 16.0; }else { L = 903.3 * Y; }
    float a = 500.0 * ( fX - fY );
    float b = 200.0 * ( fY - fZ );

    return vec3(L,a,b);
}