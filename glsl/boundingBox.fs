precision mediump float;

uniform vec4 uColor; // Color of the material.
uniform vec4 uAmbientLight; // The ambiant light.
uniform vec4 uLightColor; // The color light.
uniform float uLightIntensity; // The light intensity.
uniform float uPI; // 3.14...
uniform float uBBSize; // The bounding box size factor.
uniform float uFlatten; // The flattering factor.
uniform float uImageWidth; // The image width.
uniform float uImageHeight; // The image height.
uniform bool uIsImageInColor; // If the image is in color (true) else (false).
uniform bool uIsWireFrame; // If the wireframe is displayed.
uniform bool uIsOpaque; // If the object is opaque.

uniform sampler2D uHeightMapTypeSampler; // The height map.
uniform sampler2D uHeightMapTextureSampler; // The texture.

const int MAX_ITERATIONS = 700; // For the ray marching.
const float BORDER_SIZE = 0.05;

float DIAGO = sqrt(sqrt(uBBSize * uBBSize + uBBSize * uBBSize) * sqrt(uBBSize * uBBSize + uBBSize * uBBSize) + uBBSize * uBBSize);
float PAS = DIAGO / sqrt(uImageWidth * uImageWidth + uImageHeight * uImageHeight) * 2. ;


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

vec3 borderColor(vec3 position);

vec3 intersectionBetweenLines(vec3 O1, vec3 d1, vec3 A, vec3 B) {
    vec3 d2 = normalize(B - A);  // Direction de la deuxième droite

    // Calcul de paramètres nécessaires
    vec3 w0 = O1 - A;
    float a = dot(d1, d1);  // d1·d1
    float b = dot(d1, d2);  // d1·d2
    float c = dot(d2, d2);  // d2·d2
    float d = dot(d1, w0);  // d1·w0
    float e = dot(d2, w0);  // d2·w0

    // Calcul des paramètres t et s
    float denominator = a * c - b * b;
    if (abs(denominator) < 0.000000001) {
        //return vec3(0.0); // Les droites sont presque parallèles, pas d'intersection
    }

    float t = (b * e - c * d) / denominator;
    float s = (a * e - b * d) / denominator;

    // Calcul du point d'intersection sur D1
    return O1 + t * d1;
}

void main(void)
{
    // Couleur par défaut (gris clair)
    vec3 color = vec3(0.7, 0.7, 0.7);

    vec3 borderColor = borderColor(vVertexPosition);
    if(borderColor.x != -1.)
    {
        gl_FragColor = vec4(borderColor, 1.0);
        return;
    }

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
    // The last position computed.
    vec3 lastPosition = vVertexPosition + t * dirPixelObj;
    float lastZ = 0.;

    for (int i = 0; i < MAX_ITERATIONS; i++)
    {
        vec3 position = vVertexPosition + t * dirPixelObj;
        vec4 texHeightMap = texture2D(uHeightMapTypeSampler, goodTexCoord(((position.xy / uBBSize) + 1.) / 2.));

        if(uIsImageInColor) {
            // We use the L of the LAB color metric.
            heightMapL = RGB2Lab(texHeightMap.xyz).x * uFlatten * 0.1;
        }
        else {
            // We use the R of the RGB color metric.
            heightMapL =  texHeightMap.x * uBBSize * uFlatten;
        }

        t += PAS;

        // If the point is outside of the box.
        if(position.z < -0.1 || position.x > uBBSize || position.x < -uBBSize
        || position.y > uBBSize || position.y < -uBBSize)
        {
            // If is opaque or in wire frame mode, the draw a color.
            if(uIsOpaque || uIsWireFrame) {
                if(position.z >= uBBSize) {
                    if(uIsWireFrame && position.z >= uBBSize + BORDER_SIZE) {
                        discard;
                    }
                    else{
                        color = vec3(1., 1., 0.);
                    }
                }
                else if(position.x > uBBSize) {
                    if(uIsWireFrame && !(position.y >= uBBSize - BORDER_SIZE) && !(position.y <= -uBBSize + BORDER_SIZE) &&
                    !(position.z >= uBBSize - BORDER_SIZE) && !(position.z <= -uBBSize + BORDER_SIZE)) {
                        discard;
                    }
                    else{
                        color = vec3(1., 0., 0.);
                    }
                }
                else if( position.x < -uBBSize) {
                    if(uIsWireFrame && !(position.y >= uBBSize - BORDER_SIZE) && !(position.y <= -uBBSize + BORDER_SIZE) &&
                    !(position.z >= uBBSize - BORDER_SIZE) && !(position.z <= -uBBSize + BORDER_SIZE)) {
                        discard;
                    }
                    else {
                        color = vec3(0., 1., 0.);
                    }
                }
                else if(position.y > uBBSize) {
                    if(uIsWireFrame && !(position.x >= uBBSize - BORDER_SIZE) && !(position.x <= -uBBSize + BORDER_SIZE) &&
                    !(position.z >= uBBSize - BORDER_SIZE) && !(position.z <= -uBBSize + BORDER_SIZE)) {
                        discard;
                    }
                    else{
                        color = vec3(0., 0., 1.);
                    }
                }
                else if(position.y < -uBBSize) {
                    if(uIsWireFrame && !(position.x >= uBBSize - BORDER_SIZE) && !(position.x <= -uBBSize + BORDER_SIZE) &&
                    !(position.z >= uBBSize - BORDER_SIZE) && !(position.z <= -uBBSize + BORDER_SIZE)) {
                        discard;
                    }
                    else {
                        color = vec3(1., 0., 1.);
                    }
                }
                else {
                    discard;
                }
                break;
            }
            else {
                discard;
                break;
            }
        }
        // The ray is above the map.
        if(heightMapL < position.z)
        {
            above = true;
        }
        // The ray is bolow the map.
        else if(heightMapL >= position.z)
        {
            // If it was above the map before.
            if(above)
            {
                vec3 positionZ = position;
                positionZ.z = heightMapL;
                vec3 lastPositionZ = lastPosition;
                lastPositionZ.z = lastZ;
                vec3 pointOnTheLine = intersectionBetweenLines(lastPosition, position, lastPositionZ, positionZ);

                vec4 texColor = texture2D(uHeightMapTextureSampler, goodTexCoord(((pointOnTheLine.xy / uBBSize) + 1.) / 2.));
                color = texColor.xyz;
                break;
            }
            above = false;
        }
        lastPosition = position;
        lastZ = heightMapL;
    }

    // Sortie de la couleur du fragment
    gl_FragColor = vec4(color, 1.0);
}

vec3 borderColor(vec3 position)
{
    vec3 color = vec3(-1.0, -1.0, -1.0);
    if(uIsWireFrame)
    {
        // Top Yellow
        if(position.z == uBBSize) {
            if(position.x >= uBBSize - BORDER_SIZE || position.x <= -uBBSize + BORDER_SIZE
            || position.y >= uBBSize - BORDER_SIZE || position.y <= -uBBSize + BORDER_SIZE) {
                color = vec3(1., 1., 0.);
            }
        }
        // Right Red
        else if(position.x == uBBSize) {
            if(position.y >= uBBSize - BORDER_SIZE || position.y <= -uBBSize + BORDER_SIZE
            || position.z >= uBBSize - BORDER_SIZE || position.z <= -uBBSize + BORDER_SIZE) {
                color = vec3(1., 0., 0.);
            }
        }
        // Left Green
        else if( position.x == -uBBSize) {
            if(position.y >= uBBSize - BORDER_SIZE || position.y <= -uBBSize + BORDER_SIZE
            || position.z >= uBBSize - BORDER_SIZE || position.z <= -uBBSize + BORDER_SIZE) {
                color = vec3(0., 1., 0.);
            }
        }
        // Front Blue
        else if(position.y == uBBSize) {
            if(position.x >= uBBSize - BORDER_SIZE || position.x <= -uBBSize + BORDER_SIZE
            || position.z >= uBBSize - BORDER_SIZE || position.z <= -uBBSize + BORDER_SIZE) {
                color = vec3(0., 0., 1.);
            }
        }
        // Back pink
        else if(position.y == -uBBSize) {
            if(position.x >= uBBSize - BORDER_SIZE || position.x <= -uBBSize + BORDER_SIZE
            || position.z >= uBBSize - BORDER_SIZE || position.z <= -uBBSize + BORDER_SIZE) {
                color = vec3(1., 0., 1.);
            }
        }
    }
    return color;
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

//void Bresenham3D(vec3 p1, vec3 p2){
//
//    int i, dx, dy, dz, l, m, n, x_inc, y_inc, z_inc, err_1, err_2, dx2, dy2, dz2;
//    vec3 p = p1;
//    vec3 d = vec3(p2.x -p1.x, p2.y -p1.y, p2.z -p1.z);
//
//    x_inc = (d.x < 0) ? -1 : 1;
//    l = abs(d.x);
//    y_inc = (d.y < 0) ? -1 : 1;
//    m = abs(d.y);
//    z_inc = (d.z < 0) ? -1 : 1;
//    n = abs(d.z);
//    vec3 d2 = vec3(l * 2., m * 2., n * 2.);
//
//    if ((l >= m) && (l >= n)) {
//        err_1 = d2.y - l;
//        err_2 = d2.z - l;
//        for (int i = 0; i < MAX_ITERATIONS; i++){
//            if(i < l) {
//                break;
//            }
//            if (err_1 > 0) {
//                p.y += y_inc;
//                err_1 -= d2.x;
//            }
//            if (err_2 > 0) {
//                p.z += z_inc;
//                err_2 -= d2.x;
//            }
//            err_1 += d2.y;
//            err_2 += d2.z;
//            p.x += x_inc;
//        }
//    } else if ((m >= l) && (m >= n)) {
//        err_1 = d2.x - m;
//        err_2 = d2.z - m;
//        for (int i = 0; i < MAX_ITERATIONS; i++){
//            if(i < m) {
//                break;
//            }
//            if (err_1 > 0) {
//                p.x += x_inc;
//                err_1 -= d2.y;
//            }
//            if (err_2 > 0) {
//                p.z += z_inc;
//                err_2 -= d2.y;
//            }
//            err_1 += d2.x;
//            err_2 += d2.z;
//            p.y += y_inc;
//        }
//    } else {
//        err_1 = d2.y - n;
//        err_2 = d2.x - n;
//        for (int i = 0; i < MAX_ITERATIONS; i++){
//            if(i < n) {
//                break;
//            }
//            if (err_1 > 0) {
//                p.y += y_inc;
//                err_1 -= d2.z;
//            }
//            if (err_2 > 0) {
//                p.x += x_inc;
//                err_2 -= d2.z;
//            }
//            err_1 += d2.y;
//            err_2 += d2.x;
//            p.z += z_inc;
//        }
//    }
//}