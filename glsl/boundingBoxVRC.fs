precision mediump float;

uniform vec4 uColor; // Color of the material.
uniform vec4 uAmbientLight; // The ambiant light.
uniform vec4 uLightColor; // The color light.
uniform float uLightIntensity; // The light intensity.
uniform float uPI; // 3.14...
uniform float uBBSize; // The bounding box size factor.
uniform bool uIsWireFrame; // If the wireframe is displayed.
uniform bool uIsOpaque; // If the object is opaque.
uniform float uAspectRatio; // The image aspect ratio.
uniform float uFOV; // FOV.
uniform float uImageWidth; // The image width.
uniform float uImageHeight; // The image height.

uniform sampler2D uVoxelMapTypeSampler; // The voxel map.

const int MAX_ITERATIONS = 700; // For the ray marching.
const int MAX_ITERATIONS_FOR = 600; // For Bresenham "FOR" -> image are at 512 * 512 pixel max.
float BORDER_SIZE = 0.005 * uBBSize; // The border size of the wireframe.

//const float IMAGE_SIZE = 512.;
const float IMAGE_SIZE = 256.;

//const float NB_IMAGE_WIDTH = 32.;
//const float NB_IMAGE_HEIGHT = 16.;
const float NB_IMAGE_WIDTH = 16.;
const float NB_IMAGE_HEIGHT = 16.;

// Nyquist–Shannon sampling to have the best step.
float uBBSizeCarre = uBBSize * uBBSize;
float DIAGO = sqrt(sqrt(uBBSizeCarre + uBBSizeCarre) * sqrt(uBBSizeCarre + uBBSizeCarre) + uBBSizeCarre);
float PAS = DIAGO / sqrt(uImageWidth * uImageWidth + uImageHeight * uImageHeight) * 2.;


varying vec3 vVertexPosition;        // Reel vertex position.
varying vec4 vVertexPositionSpace;   // Vertex position project on the sreen.
varying mat4 viMVMatrix;             // Inverse MVMatrix.

// All the utility fonctions.
vec2 goodTexCoord(vec2 tex);
vec3 borderColor(vec3 position);
vec3 intersectionBetweenLines(vec3 A1, vec3 B1, vec3 A2, vec3 B2);
vec3 RGB2Lab(vec3 rgb);


vec4 getVoxcelInPos(vec3 position)
{
    vec3 positionN = position / uBBSize;
    positionN.xy += 1.;
    positionN.xy /= 2.;
    // positionN x: 0 to 1, y: 0 to 1, z: 0 to 1

    vec3 position_512 = positionN * IMAGE_SIZE;

    float sliceIndex = floor(position_512.z); // L'indice de tranche en profondeur
    float x = mod(sliceIndex, NB_IMAGE_WIDTH);          // Colonne de la tranche dans la grille
    float y = floor(sliceIndex / NB_IMAGE_WIDTH);       // Ligne de la tranche dans la grille

    vec2 positionTexture = vec2(
    (x * IMAGE_SIZE + position_512.x) / (NB_IMAGE_WIDTH * IMAGE_SIZE), // Position x en prenant en compte la colonne
    (y * IMAGE_SIZE + position_512.y) / (NB_IMAGE_HEIGHT * IMAGE_SIZE)  // Position y en prenant en compte la ligne
    );

    //vec4 texImage = texture2D(uHeightMapTypeSampler, goodTexCoord(positionTexture));
    vec4 texImage = texture2D(uVoxelMapTypeSampler, positionTexture);
    return texImage;
}

vec4 transformationBlackToWhite(vec4 color)
{
    color.a = color.r;
    if(color.a <= 0.05){
        color.a = 0.;
    }
    else{
        // Remove to do VRC
        color.a = 1.;
    }
    return color;
}


void main(void)
{
    // Default color.
    vec4 color = vec4(0., 0., 0., 0.);

    // The color of the border (wireframe).
    vec3 borderColor = borderColor(vVertexPosition);
    if(borderColor.x != -1.)
    {
        gl_FragColor = vec4(borderColor, 1.0);
        return;
    }

    // Conversion of vertex coordinates to screen space (normalized).
    vec2 pixel = vVertexPositionSpace.xy / vVertexPositionSpace.w;

    // Calculating the ray direction in camera space.
    vec3 dirCam = vec3(pixel.x * uAspectRatio, pixel.y, -(1. / tan(radians(uFOV) / 2.)));

    // Transform the ray into object space
    vec3 dirPixelObj = normalize((viMVMatrix * vec4(dirCam, 1.0)).xyz);

    // Calculation of the end point, when the ray is outside of the box (for Bresenham).
    float tWhereZEgal0 = - (vVertexPosition.z / dirPixelObj.z);
    if(vVertexPosition.z < 1. * uBBSize && dirPixelObj.z > 0.)
    {
        tWhereZEgal0 = vVertexPosition.z / dirPixelObj.z;
    }
    vec3 pointHitTheGround = vVertexPosition + tWhereZEgal0 * dirPixelObj;

    // The value that we increment during the ray marching.
    float t = 0.1;
    // The value of the height of the height map.
    float heightMapL = 0.;
    // To know if the last position was above.
    bool above = false;
    // The last position computed.
    vec3 lastPosition = vVertexPosition + t * dirPixelObj;
    // The last 'z' position calculated.
    float fLastZ = 0.;
    // If a position has been found or not.
    bool bNotFound = false;

    for (int i = 0; i < MAX_ITERATIONS; i++)
    {
        vec3 position = vVertexPosition + t * dirPixelObj;
        t += PAS;

        // To get the color of the pixel in the current position.
        vec4 texImage = getVoxcelInPos(position);
        texImage = transformationBlackToWhite(texImage);

        texImage.r *= texImage.a;
        texImage.g *= texImage.a;
        texImage.b *= texImage.a;

        color += texImage * (1. - color.a);
        //color += texImage;

        if(color.a > 0.99)
            break;

        // If we are under the map, outside of the box or if we haven't found a valid position.
        if(position.z < -0.1 || position.x > uBBSize || position.x < -uBBSize
        || position.y > uBBSize || position.y < -uBBSize || bNotFound)
        {
            // If we are in opaque or wireframe mode.
            if(uIsOpaque || uIsWireFrame) {
                // Yellow color.
                if(position.z >= uBBSize) {
                    if(uIsWireFrame && position.z >= uBBSize + BORDER_SIZE) {
                        discard;
                    }
                    else{
                        color = vec4(1., 1., 0., 0.);
                    }
                }
                // Red color.
                else if(position.x > uBBSize && position.y <= uBBSize && position.y >= -uBBSize) {
                    if(uIsWireFrame && !(position.y >= uBBSize - BORDER_SIZE) && !(position.y <= -uBBSize + BORDER_SIZE) &&
                    !(position.z >= uBBSize - BORDER_SIZE) && !(position.z <= -uBBSize + BORDER_SIZE)) {
                        discard;
                    }
                    else{
                        color = vec4(1., 0., 0., 0.);
                    }
                }
                // Green color.
                else if( position.x < -uBBSize && position.y <= uBBSize && position.y >= -uBBSize) {
                    if(uIsWireFrame && !(position.y >= uBBSize - BORDER_SIZE) && !(position.y <= -uBBSize + BORDER_SIZE) &&
                    !(position.z >= uBBSize - BORDER_SIZE) && !(position.z <= -uBBSize + BORDER_SIZE)) {
                        discard;
                    }
                    else {
                        color = vec4(0., 1., 0., 0.);
                    }
                }
                // Blue color.
                else if(position.y > uBBSize && position.x <= uBBSize && position.x >= -uBBSize) {
                    if(uIsWireFrame && !(position.x >= uBBSize - BORDER_SIZE) && !(position.x <= -uBBSize + BORDER_SIZE) &&
                    !(position.z >= uBBSize - BORDER_SIZE) && !(position.z <= -uBBSize + BORDER_SIZE)) {
                        discard;
                    }
                    else{
                        color = vec4(0., 0., 1., 0.);
                    }
                }
                // Pink color.
                else if(position.y < -uBBSize && position.x <= uBBSize && position.x >= -uBBSize) {
                    if(uIsWireFrame && !(position.x >= uBBSize - BORDER_SIZE) && !(position.x <= -uBBSize + BORDER_SIZE) &&
                    !(position.z >= uBBSize - BORDER_SIZE) && !(position.z <= -uBBSize + BORDER_SIZE)) {
                        discard;
                    }
                    else {
                        color = vec4(1., 0., 1., 0.);
                    }
                }
                else {
                    discard;
                }
                break;
            }
            // If we don't have a mode, we discard all pixels outside of the box.
            else {
                discard;
                break;
            }
        }
    }

    gl_FragColor = vec4(color.rbg, 1.0);
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

/**
* @brief Get the intersection of two lines (one line is represented by two points).
* @param A1 The first point of the first line.
* @param B1 The second point of the first line.
* @param A2 The first point of the second line.
* @param B2 The second point of the second line.
* @return The intersection between the two lines.
*/
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

/**
* @brief Transform a RGB vec3 into a LAB vec3.
* @param rgb The color that we want to convert.
* @return The result of the convertion.
*/
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