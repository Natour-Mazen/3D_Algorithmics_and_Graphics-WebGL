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
float PAS = DIAGO / sqrt(uImageWidth * uImageWidth + uImageHeight * uImageHeight) * 2.;


varying vec3 vVertexPositionMV;
varying vec3 vVertexPosition;        // Position 3D du vertex
varying vec4 vVertexPositionSpace;   // Position projetée dans l'espace caméra
varying mat4 viMVMatrix;
varying vec3 vVertexNormal;


vec2 goodTexCoord(vec2 tex);
vec3 borderColor(vec3 position);
vec3 intersectionBetweenLines(vec3 A1, vec3 B1, vec3 A2, vec3 B2);
vec3 RGB2Lab(vec3 rgb);

void main(void)
{
    // Default color.
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
           // heightMapL = (RGB2Lab(texHeightMap.xyz).x / 5.) * uFlatten * 0.1;
            heightMapL = RGB2Lab(texHeightMap.xyz).x  * uFlatten * 0.1;
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


// ======================================================//
//                      Functions                        //
// ===================================================== //

vec2 goodTexCoord(vec2 tex)
{
    tex.x = max(0., min(tex.x, 1.));
    // To have the ray marching height map in the same direction as the classic height map.
    tex.y = 1. - max(0., min(tex.y, 1.));
    return tex;
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

vec3 intersectionBetweenLines(vec3 A1, vec3 B1, vec3 A2, vec3 B2)
{
    // Lines directions.
    vec3 d1 = normalize(A1 - B1);
    vec3 d2 = normalize(B2 - A2);

    vec3 w0 = A1 - A2;
    float a = dot(d1, d1);  // d1·d1
    float b = dot(d1, d2);  // d1·d2
    float c = dot(d2, d2);  // d2·d2
    float d = dot(d1, w0);  // d1·w0
    float e = dot(d2, w0);  // d2·w0

    float denominator = a * c - b * b;

    // Lines are parallel, no intersection.
    if (abs(denominator) < 0.000001)
    {
        return vec3(0.0);
    }

    float t = (b * e - c * d) / denominator;

    // Point of intersection.
    return A1 + t * d1;
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

// TODO : Bresenham
// Prendre la position de depard en x,y (float), les mettres en int.
// Trouver quand on sort de la boite, prendre la position d'arrivé.
// Appliquer bresenham pour la position de depart jusqu'à l'arrivé.
// Pour chaque nouveau pixel decouvert avec Bresenham on regarde si :
// Si on commence avec un pixel (en z) sur la map en bas de notre rayon, on continue jusqu'à trouver un pixel (en z) superieur sur la map.
// Si on commence avec un pixel (en z) sur la map en haut de notre rayon, on continue jusqu'à trouver un pixel (en z) inferieur sur la map.

// Pour les deux cas on recupère le pixel de fin et le precedant (pour pouvoir ensuite trouver le bon pixel ou le 'z' de la map correspond avec le 'z' de notre rayon).
// (bien sur il faut transferer les pixels en int vers le rayon qui est en float)
// Une fois qu'on a les deux points sur le rayon, on applique la même méthode que pour le calcul de base (avec l'intersection du rayon et de la droite que forme les pixels de la map).


void draw_line(ivec2 p1, ivec2 p2) {
    int dx, dy, i, e;
    int incx, incy, inc1, inc2;
    int x,y;

    dx = p2.x - p1.x;
    dy = p2.y - p1.y;

    if (dx < 0) dx = -dx;
    if (dy < 0) dy = -dy;
    incx = 1;
    if (p2.x < p1.x) incx = -1;
    incy = 1;
    if (p2.y < p1.y) incy = -1;
    x = p1.x; y = p1.y;
    if (dx > dy) {
        //draw_pixel(x, y);
        e = 2 * dy-dx;
        inc1 = 2*(dy-dx);
        inc2 = 2*dy;
        for (i=0; i<dx; i++) {
            if (e >= 0) {
                y += incy;
                e += inc1;
            }
            else
            e += inc2;
            x += incx;
            //draw_pixel(x, y);
        }

    } else {
        //draw_pixel(x, y);
        e = 2*dx-dy;
        inc1 = 2*(dx-dy);
        inc2 = 2*dx;
        for (i=0; i<dy; i++) {
            if (e >= 0) {
                x += incx;
                e += inc1;
            }
            else
            e += inc2;
            y += incy;
            //draw_pixel(x, y);
        }
    }
}