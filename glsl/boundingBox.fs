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
const int MAX_ITERATIONS_FOR = 600; // For Bresenham "FOR" -> image are at 512 * 512 pixel max.
float BORDER_SIZE = 0.005 * uBBSize;

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
void draw_line(vec3 vec3EndPoint, vec3 linePoint, vec3 lineDirection, inout vec3 fBeforeFinalPoint, inout vec3 fFinalPoint);
void bresenhamLine(vec3 vec3EndPoint, vec3 vec3LinePoint, vec3 vec3LineDirection, inout vec3 vec3BeforeFinalPoint,
inout vec3 vec3FinalPoint, inout bool bNotFound, inout float t, inout bool bAbove);

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
    float fLastZ = 0.;

    bool useBresenham = true;

    for (int i = 0; i < MAX_ITERATIONS; i++)
    {
        vec3 position = vVertexPosition + t * dirPixelObj;

        t += PAS;

        bool bNotFound = false;
        // We use the bresenham algorithm just one time.

        if(useBresenham)
        {
            bresenhamLine(pointHitTheGround, position, dirPixelObj, lastPosition, position, bNotFound, t, above);

            vec4 texHeightMap = texture2D(uHeightMapTypeSampler, goodTexCoord(((lastPosition.xy / uBBSize) + 1.) / 2.));
            fLastZ = texHeightMap.z;

            useBresenham = false;
        }

        vec4 texHeightMap = texture2D(uHeightMapTypeSampler, goodTexCoord(((position.xy / uBBSize) + 1.) / 2.));

        if(uIsImageInColor) {
            // We use the L of the LAB color metric.
            // heightMapL = (RGB2Lab(texHeightMap.xyz).x / 5.) * uFlatten * 0.1;
            heightMapL = RGB2Lab(texHeightMap.xyz).x * uBBSize * uFlatten / 100.;
        }
        else {
            // We use the R of the RGB color metric.
            heightMapL =  texHeightMap.x * uBBSize * uFlatten;
        }


        // If the point is outside of the box.

        if(position.z < -0.1 || position.x > uBBSize || position.x < -uBBSize
        || position.y > uBBSize || position.y < -uBBSize || bNotFound)
        {
            // If is opaque or in wire frame mode, the draw a color.
            if(uIsOpaque || uIsWireFrame) {
                // Yellow roof or wire.
                if(position.z >= uBBSize) {
                    if(uIsWireFrame && position.z >= uBBSize + BORDER_SIZE) {
                        //discard;
                    }
                    else{
                        color = vec3(1., 1., 0.);
                    }
                }
                // Red wall or wire.
                else if(position.x > uBBSize && position.y <= uBBSize && position.y >= -uBBSize) {
                    if(uIsWireFrame && !(position.y >= uBBSize - BORDER_SIZE) && !(position.y <= -uBBSize + BORDER_SIZE) &&
                    !(position.z >= uBBSize - BORDER_SIZE) && !(position.z <= -uBBSize + BORDER_SIZE)) {
                        discard;
                    }
                    else{
                        color = vec3(1., 0., 0.);
                    }
                }
                // Green wall or wire.
                else if( position.x < -uBBSize && position.y <= uBBSize && position.y >= -uBBSize) {
                    if(uIsWireFrame && !(position.y >= uBBSize - BORDER_SIZE) && !(position.y <= -uBBSize + BORDER_SIZE) &&
                    !(position.z >= uBBSize - BORDER_SIZE) && !(position.z <= -uBBSize + BORDER_SIZE)) {
                        discard;
                    }
                    else {
                        color = vec3(0., 1., 0.);
                    }
                }
                // Blue wall or wire.
                else if(position.y > uBBSize && position.x <= uBBSize && position.x >= -uBBSize) {
                    if(uIsWireFrame && !(position.x >= uBBSize - BORDER_SIZE) && !(position.x <= -uBBSize + BORDER_SIZE) &&
                    !(position.z >= uBBSize - BORDER_SIZE) && !(position.z <= -uBBSize + BORDER_SIZE)) {
                        discard;
                    }
                    else{
                        color = vec3(0., 0., 1.);
                    }
                }
                // Pink wall or wire.
                else if(position.y < -uBBSize && position.x <= uBBSize && position.x >= -uBBSize) {
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
                lastPositionZ.z = fLastZ;

                vec3 pointOnTheLine = intersectionBetweenLines(lastPosition, position, lastPositionZ, positionZ);

                vec4 texColor = texture2D(uHeightMapTextureSampler, goodTexCoord(((pointOnTheLine.xy / uBBSize) + 1.) / 2.));
                color = texColor.xyz;
                break;
            }
            above = false;
        }
        lastPosition = position;
        fLastZ = heightMapL;
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


/**
* @brief Get the closest point on the line (= linePoint + t * lineDirection) from 'point'.
* @param linePoint Where the line start.
* @param lineDirection The direction of the line.
* @param point The point that we want to have on the line.
* @param t (inout) The factor to get the point we search.
* @return The point we search that is on the line.
*/
vec3 closestPointOnLine(vec3 linePoint, vec3 lineDirection, vec3 point, inout float t)
{
    // Vector between linePoint and point.
    vec3 w = point - linePoint;

    t = dot(w, lineDirection) / dot(lineDirection, lineDirection);

    // The closest point to the line.
    return linePoint + t * lineDirection;
}

/**
* @brief Give the absolute value of a integer.
* @param x Where the line start.
* @return The absolute value of x.
*/
int abs(int x) {
    return (x < 0) ? -x : x;
}

/**
* @brief Use the Bresenham algorithm to found the point just before we hit the height map.
* @param vec3EndPoint The final point for the algorithm.
* @param vec3LinePoint Where the line start.
* @param vec3LineDirection The direction of the line.
* @param vec3FinalPoint (inout) The final point before we hit the height map.
* @param bNotFound (inout) Tell if the point returned is usable or not.
* @param t (inout) The factor to get the final point with the line formula.
*/
void bresenhamLine(vec3 vec3EndPoint, vec3 vec3LinePoint, vec3 vec3LineDirection, inout vec3 vec3BeforeFinalPoint,
                    inout vec3 vec3FinalPoint, inout bool bNotFound, inout float t, inout bool bAbove)
{
    // The size of the image (divided by 2 because we are in -1 to 1 range).
    float fImageLength = uImageWidth / 2.;
    // The ratio to have a point in the -(uImageWidth/2) to (uImageWidth/2) range.
    float fImageRatio = fImageLength / uBBSize;

    // Apply the ratio the incoming points. 
    vec3LinePoint *= fImageRatio;
    vec3EndPoint *= fImageRatio;
    ivec2 ivec2StartPoint = ivec2(int(vec3LinePoint.x), int(vec3LinePoint.y));
    ivec2 ivec2EndPoint = ivec2(int(vec3EndPoint.x), int(vec3EndPoint.y));

    // We get the first 'z' with the starting point.
    vec2 vec2TexPosition = vec2(float(ivec2StartPoint.x), float(ivec2StartPoint.y));
    float fTexZ = texture2D(uHeightMapTypeSampler, goodTexCoord(((vec2TexPosition.xy / fImageRatio / uBBSize) + 1.) / 2.)).z;
    float fLastZ =  fTexZ * uFlatten * uBBSize;
    float actualZ = fLastZ;

    // Tell if we are over the map (true) or under (false), init in the first loop.
    bool overTheMap = true;
    // The previous 't' used to calculate the point on the line.
    float lastT = 0.;

    // The previous point of the previous point calculated.
    vec3 fBeforeBeforeFinalPoint;
    // The previous point calculated.
    vec3 fBeforeFinalPoint;
    // The point just calculated.
    vec3 fFinalPoint;

    // Init Bresenham algorithm variables.
    int dx = abs(ivec2EndPoint.x - ivec2StartPoint.x);
    int dy = abs(ivec2EndPoint.y - ivec2StartPoint.y);
    int sx = (ivec2StartPoint.x < ivec2EndPoint.x) ? 1 : -1;
    int sy = (ivec2StartPoint.y < ivec2EndPoint.y) ? 1 : -1;

    int err = dx - dy;

    // We start the Bresenham algorithm.
    for (int i=0; i<MAX_ITERATIONS_FOR; i++)
    {
        // If we have the same point as the point that we search for.
        if (ivec2StartPoint.x == ivec2EndPoint.x && ivec2StartPoint.y == ivec2EndPoint.y) {
            // If we are under the map, it indicate that the point is on the floor, so we don't print it.
            if(!overTheMap){
                bNotFound = true;
            }
            break;
        }

        int e2 = 2 * err;

        // Adjust the error and move the point to the next one.
        if (e2 > -dy) {
            err -= dy;
            ivec2StartPoint.x += sx;
        }
        if (e2 < dx) {
            err += dx;
            ivec2StartPoint.y += sy;
        }
        
        // We convert our point from int to float.
        vec2TexPosition = vec2(float(ivec2StartPoint.x), float(ivec2StartPoint.y));
        
        // We get the height of the point that we found.
        fLastZ = actualZ;
        fTexZ = texture2D(uHeightMapTypeSampler, goodTexCoord(((vec2TexPosition.xy / fImageRatio/ uBBSize) + 1.) / 2.)).z;
        // We transform the 0 to 1 value at the size of the box (with uBBSize).
        actualZ = fTexZ * uFlatten * uBBSize;

        // We store the found 't' for later.
        float fTemT = t;

        // We get the point the closest on the line from the point that we found.
        fBeforeBeforeFinalPoint = fBeforeFinalPoint;
        fBeforeFinalPoint = fFinalPoint;
        fFinalPoint = closestPointOnLine(vec3LinePoint, vec3LineDirection, vec3(vec2TexPosition, actualZ * fImageRatio), fTemT) / fImageRatio;

        // We past the point that we found before, for if we go out of the loop.
        //vec3BeforeFinalPoint = fBeforeBeforeFinalPoint;
        //vec3FinalPoint = fBeforeFinalPoint;
        vec3BeforeFinalPoint = fBeforeFinalPoint;
        vec3FinalPoint = fFinalPoint;

        // The z of the found point.
        float fOnLineZ = fFinalPoint.z;

        // If the ray is under the map.
        if(fLastZ > fOnLineZ && actualZ > fOnLineZ){
            bAbove = false;
            // The line was over the map and now it under.
            if(overTheMap && i != 0){
                break;
            }
            overTheMap = false;
        }
        // If the ray is over the map.
        else if(fLastZ < fOnLineZ && actualZ < fOnLineZ){
            bAbove = true;
            // The line was under the map and now it over.
            if(!overTheMap && i != 0){
                break;
            }
            overTheMap = true;
        }
        // If the ray is between the two calculated points.
        else{
            break;
        }

        // If the point is outside of the box.
        if(ivec2StartPoint.x > int(fImageLength) || ivec2StartPoint.x < int(-fImageLength)
        || ivec2StartPoint.y > int(fImageLength) || ivec2StartPoint.y < int(-fImageLength)
        || fOnLineZ <= -0.1 || fOnLineZ >= uBBSize + 0.1)
        {
            // To indicate that the point doesn't exist.
            bNotFound = true;
            break;
        }
        // We set the previous 't'.
        t = fTemT / fImageRatio;
    }
}
