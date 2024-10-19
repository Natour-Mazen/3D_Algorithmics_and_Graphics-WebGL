precision mediump float;

uniform vec4 uColor; // Color of the material.
uniform vec4 uAmbientLight; // The ambiant light.
uniform vec4 uLightColor; // The color light.
uniform float uLightIntensity; // The light intensity.
uniform float uPI; // 3.14...
uniform float uScale; // The scale factor.
uniform float uFlatten; // The flattering factor.
uniform float uImageWidth; // The image width.
uniform float uImageHeight; // The image height.
uniform bool uIsImageInColor; // If the image is in color (true) else (false).

uniform sampler2D uHeightMapTypeSampler; // The height map.
uniform sampler2D uHeightMapTextureSampler; // The texture.

const int MAX_ITERATIONS = 500; // For the ray marching.

float DIAGO = sqrt(sqrt(uScale * uScale + uScale * uScale) * sqrt(uScale * uScale + uScale * uScale) + uScale * uScale);
float PAS = DIAGO / sqrt(uImageWidth * uImageWidth + uImageHeight * uImageHeight) * 2.;


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

    // The value that we increment during the ray marching.
    float t = PAS;
    // The value of the height of the height map.
    float heightMapL = 0.;
    // To know if the last position was above.
    bool above = false;

    for (int i = 0; i < MAX_ITERATIONS; i++)
    {
        vec3 position = vVertexPosition + t * dirPixelObj;
        vec4 texHeightMap = texture2D(uHeightMapTypeSampler, goodTexCoord(((position.xy / uScale) + 1.) / 2.));

        if(uIsImageInColor) {
            // We use the L of the LAB color metric.
            heightMapL = RGB2Lab(texHeightMap.xyz).x * uFlatten * 0.1;
        }
        else {
            // We use the R of the RGB color metric.
            heightMapL =  texHeightMap.x * uScale * uFlatten;
        }

        t += PAS;

        // If the point is outside of the box.
        if(position.z < -0.1 || position.x >= uScale || position.x <= -uScale
        || position.y >= uScale || position.y <= -uScale)
        {
            discard;
            break;
        }
        // The pixel is above.
        if(heightMapL < position.z)
        {
            above = true;
        }
        // The pixel is bolow.
        else if(heightMapL >= position.z)
        {
            // If it was above before.
            if(above)
            {
                vec4 texColor = texture2D(uHeightMapTextureSampler, goodTexCoord(((position.xy / uScale) + 1.) / 2.));
                color = texColor.xyz;
                break;
            }
            above = false;
        }
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