precision mediump float;

uniform vec4 uColor; // Color of the material.
uniform vec4 uAmbientLight; // The ambiant light.
uniform vec4 uLightColor; // The color light.
uniform float uLightIntensity; // The light intensity.
uniform float uPI;
uniform float uScale;
uniform float uFlatten;

uniform sampler2D uHeightMapTypeSampler;
uniform sampler2D uHeightMapTextureSampler;

const int MAX_ITERATIONS = 1000;  // Constante d'itérations maximum (si nécessaire)

float DIAGO = sqrt(sqrt(uScale * uScale + uScale * uScale) * sqrt(uScale * uScale + uScale * uScale) + uScale * uScale);
float PAS = DIAGO / sqrt(512. * 512. + 512. * 512.) * 2.;


varying vec3 vVertexPositionMV;
varying vec3 vVertexPosition;        // Position 3D du vertex
varying vec4 vVertexPositionSpace;   // Position projetée dans l'espace caméra
varying mat4 viMVMatrix;
varying vec3 vVertexNormal;

vec3 RGB2Lab(vec3 rgb);

vec2 goodTexCoord(vec2 tex)
{
    tex.x = max(0., min(tex.x, 1.));
    // To have the ray marching height map in the same direction as the classic height map.
    tex.y = 1. - max(0., min(tex.y, 1.));
    return tex;
}

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



    float t = PAS;
    vec3 position = vVertexPosition + t * dirPixelObj;

    vec4 texHeightMap = texture2D(uHeightMapTypeSampler, goodTexCoord(((position.xy / uScale) + 1.) / 2.));
    //float heightMapL = RGB2Lab(texHeightMap.xyz).x;
    float heightMapL = texHeightMap.x * uScale * uFlatten;

    vec3 lastPosition = position;
    bool above = false;
    bool below = false;
    bool lastAbove = false;

    for (int i = 0; i < MAX_ITERATIONS; i++)
    {
        // If the point is outside of the box.
        if(position.z < -0.1 || position.x >= uScale || position.x <= -uScale
        || position.y >= uScale || position.y <= -uScale)
        {
//            if(below && lastAbove)
//            {
//                vec4 texColor = texture2D(uHeightMapTextureSampler, goodTexCoord(((lastPosition.xy / uScale) + 1.) / 2.));
//                color = texColor.xyz;
//                break;
//            }
            discard;
            break;
        }
        if(above)
        {
            lastAbove = true;
        }
        // The pixel is above.
        if(heightMapL < position.z)
        {
            above = true;
            below = false;
        }
        // The pixel is bolow.
        else if(heightMapL >= position.z)
        {
            // If it was above before.
            if(above)
            {
                vec4 texColor = texture2D(uHeightMapTextureSampler, goodTexCoord(((lastPosition.xy / uScale) + 1.) / 2.));
                color = texColor.xyz;
                break;
            }
            below = true;
            above = false;
        }

        //t += 0.005;
        t += PAS;
        lastPosition = position;
        position = vVertexPosition + t * dirPixelObj;
        texHeightMap = texture2D(uHeightMapTypeSampler, goodTexCoord(((position.xy / uScale) + 1.) / 2.));
        //heightMapL = RGB2Lab(texHeightMap.xyz).x;
        heightMapL =  texHeightMap.x * uScale * uFlatten;
    }


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