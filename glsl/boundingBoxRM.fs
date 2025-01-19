precision mediump float;

uniform float uBBSize; // The bounding box size factor.
uniform bool uIsWireFrame; // If the wireframe is displayed.
uniform bool uIsOpaque; // If the object is opaque.
uniform float uAspectRatio; // The image aspect ratio.
uniform float uFOV; // FOV.
uniform float uHeightMapFlatten; // The flattering factor.
uniform float uImageWidth; // The image width.
uniform float uImageHeight; // The image height.
uniform bool uHeightMapIsImageInColor; // If the image is in color (true) else (false).

uniform sampler2D uHeightMapTypeSampler; // The height map.
uniform sampler2D uHeightMapTextureSampler; // The texture.

const int MAX_ITERATIONS = 700; // For the ray marching.
const int MAX_ITERATIONS_FOR = 600; // For Bresenham "FOR" -> image are at 512 * 512 pixel max.
float BORDER_SIZE = 0.005 * uBBSize; // The border size of the wireframe.

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

// The Bresenham fonctions to avoid missing steps.
// First version that stop before hiting a point and let the current code finish the job.
void bresenhamLine(vec3 vec3EndPoint, vec3 vec3LinePoint, vec3 vec3LineDirection, inout vec3 vec3BeforeFinalPoint,
                    inout vec3 vec3FinalPoint, inout bool bNotFound, inout float t, inout bool bAbove);
// Second version that return the color of the pixel. (Not working).
void bresenhamLine2(vec3 vec3EndPoint, vec3 vec3LinePoint, vec3 vec3LineDirection,
                    inout vec3 vec3FinalPoint, inout bool bNotFound);


void main(void)
{
    // Default color.
    vec3 color = vec3(0.7, 0.7, 0.7);

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
    // If we use bresenham or not.
    bool useBresenham = true;
    // If a position has been found or not.
    bool bNotFound = false;

    for (int i = 0; i < MAX_ITERATIONS; i++)
    {
        vec3 position = vVertexPosition + t * dirPixelObj;
        t += PAS;

        if(useBresenham)
        {
            // === First try of Bresenham (uncomment to use it, kinda working) === //
            //bresenhamLine(pointHitTheGround, position, dirPixelObj, lastPosition, position, bNotFound, t, above);

            //vec4 texHeightMap = texture2D(uHeightMapTypeSampler, goodTexCoord(((lastPosition.xy / uBBSize) + 1.) / 2.));
            //fLastZ = texHeightMap.z;
            //useBresenham = false;

            // === Second try of Bresenham (uncomment to use it, not working) === //
            //bresenhamLine2(pointHitTheGround, position, dirPixelObj, position, bNotFound);
            //color = position;
            //break;
        }

        // To get the color of the pixel in the current position.
        vec4 texHeightMap = texture2D(uHeightMapTypeSampler, goodTexCoord(((position.xy / uBBSize) + 1.) / 2.));

        // If the image is in color, we use the 'L' of the LAB color metric.
        if(uHeightMapIsImageInColor) {
            heightMapL = RGB2Lab(texHeightMap.xyz).x * uBBSize * uHeightMapFlatten / 100.;
        }
        // If the color is in black and white, we use the 'R' of the RGB color metric.
        else {
            heightMapL =  texHeightMap.r * uBBSize * uHeightMapFlatten;
        }

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
                        color = vec3(1., 1., 0.);
                    }
                }
                // Red color.
                else if(position.x > uBBSize && position.y <= uBBSize && position.y >= -uBBSize) {
                    if(uIsWireFrame && !(position.y >= uBBSize - BORDER_SIZE) && !(position.y <= -uBBSize + BORDER_SIZE) &&
                    !(position.z >= uBBSize - BORDER_SIZE) && !(position.z <= -uBBSize + BORDER_SIZE)) {
                        discard;
                    }
                    else{
                        color = vec3(1., 0., 0.);
                    }
                }
                // Green color.
                else if( position.x < -uBBSize && position.y <= uBBSize && position.y >= -uBBSize) {
                    if(uIsWireFrame && !(position.y >= uBBSize - BORDER_SIZE) && !(position.y <= -uBBSize + BORDER_SIZE) &&
                    !(position.z >= uBBSize - BORDER_SIZE) && !(position.z <= -uBBSize + BORDER_SIZE)) {
                        discard;
                    }
                    else {
                        color = vec3(0., 1., 0.);
                    }
                }
                // Blue color.
                else if(position.y > uBBSize && position.x <= uBBSize && position.x >= -uBBSize) {
                    if(uIsWireFrame && !(position.x >= uBBSize - BORDER_SIZE) && !(position.x <= -uBBSize + BORDER_SIZE) &&
                    !(position.z >= uBBSize - BORDER_SIZE) && !(position.z <= -uBBSize + BORDER_SIZE)) {
                        discard;
                    }
                    else{
                        color = vec3(0., 0., 1.);
                    }
                }
                // Pink color.
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
            // If we don't have a mode, we discard all pixels outside of the box.
            else {
                discard;
                break;
            }
        }

        // If the are above.
        if(heightMapL < position.z)
        {
            above = true;
        }
        // If we are under.
        else if(heightMapL >= position.z)
        {
            // The position was above before.
            if(above)
            {
                // Position with the 'z' of the map.
                vec3 positionZ = position;
                positionZ.z = heightMapL;
                // Last position with the 'z' of the map.
                vec3 lastPositionZ = lastPosition;
                lastPositionZ.z = fLastZ;

                // The intersection between the two lines (lastPosition/position and lastPositionZ/positionZ).
                vec3 pointOnTheLine = intersectionBetweenLines(lastPosition, position, lastPositionZ, positionZ);

                // The get the texture of the found position.
                vec4 texColor = texture2D(uHeightMapTextureSampler, goodTexCoord(((pointOnTheLine.xy / uBBSize) + 1.) / 2.));
                color = texColor.xyz;
                break;
            }
            above = false;
        }
        lastPosition = position;
        fLastZ = heightMapL;
    }

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
    float fLastZ =  fTexZ * uHeightMapFlatten * uBBSize;
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
        // We transform the 0 to 1 value at the size of the box (with uBBSize).
        vec4 fTex = texture2D(uHeightMapTypeSampler, goodTexCoord(((vec2TexPosition.xy / fImageRatio / uBBSize) + 1.) / 2.));
        fTexZ = fTex.z;
        if(uHeightMapIsImageInColor) {
            // We use the L of the LAB color metric.
            actualZ = RGB2Lab(fTex.xyz).x * uBBSize * uHeightMapFlatten / 100.;
        }
        else {
            // We use the R of the RGB color metric.
            actualZ =  fTexZ * uBBSize * uHeightMapFlatten;
        }

        // We store the found 't' for later.
        float fTemT = 0.;

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

/* Used in Bresenham2 to found an intersection between the ray and the map.

*/
bool foundIntersectionPixel(vec3 vec3EndPoint, vec3 vec3StartPoint, inout ivec2 ivec2LastPoint, ivec2 ivec2Point, float fImageLength,
                            inout bool bAbove, inout vec3 vec3LastPointRes, inout vec3 vec3PointRes,
                            inout vec3 vec3LastPointMapRes, inout vec3 vec3PointMapRes, inout int counter)
{
    counter +=1;

    if(ivec2Point.x > int(fImageLength) || ivec2Point.x < int(-fImageLength)
    || ivec2Point.y > int(fImageLength) || ivec2Point.y < int(-fImageLength))
    {
        return true;
    }

    vec3 AB = vec3(vec3EndPoint.x - vec3StartPoint.x, vec3EndPoint.y - vec3StartPoint.y, vec3EndPoint.z - vec3StartPoint.z);
    float u = AB.x;
    float v = AB.y;
    float w = AB.z;

    // x = x1 + t * u
    // y = y1 + t * v
    // z = z1 + t * w

    // To find 'y' and 'z' =>  t = (x - x1) / u
    // Then we have 't' to calculate 'y' and 'z'

    float x = 0.;
    float y = 0.;
    float z = 0.;

    // If the point have move on the 'x' axis, the 'x' entry point have a discreet value, not the 'y' (on the line / ray).
    if(abs(ivec2LastPoint.x) < abs(ivec2Point.x))
    {
        // We already have x.
        x = float(ivec2Point.x);
        // t = (x - x1) / u
        float t = (x - vec3StartPoint.x) / u;
        y = vec3StartPoint.y + t * v;
        z = vec3StartPoint.z + t * w;
    }
    // If the point have move on the 'y' axis, the 'y' entry point have a discreet value, not the 'x' (on the line / ray).
    else if(abs(ivec2LastPoint.y) < abs(ivec2Point.y))
    {
        // We already have y.
        y = float(ivec2Point.y);
        // t = (y - y1) / v
        float t = (y - vec3StartPoint.y) / v;
        x = vec3StartPoint.x + t * u;
        z = vec3StartPoint.z + t * w;
    }
    else{
        vec3LastPointRes = vec3(50., 0., 0.);
        vec3PointRes = vec3(1.0, 0.0, 0.0);
        return true;
    }

    // We transform the 0 to 1 value at the size of the box (with uBBSize).
    vec4 vec4Tex = texture2D(uHeightMapTypeSampler, goodTexCoord(((vec2(x, y) / fImageLength) + 1.) / 2.));

    // To avoid this lines in the main function.
    vec3LastPointRes = vec3PointRes;
    vec3LastPointMapRes = vec3PointMapRes;

    vec3PointRes = vec3(x, y, z);
    vec3PointMapRes = vec3(x, y, vec4Tex.z);

    // To avoid this line in the main function.
    ivec2LastPoint = ivec2Point;

    // We were above, and we now are under. => intersection
    if(bAbove && vec4Tex.z >= z){
        bAbove = false;
        // Stop here
        return true;
    }
    // We were under, and we now are above. => intersection
    if(!bAbove && vec4Tex.z <= z){

        bAbove = true;
        // Stop here
        return true;
    }
    // Under the map.
    if(vec4Tex.z > z){
        bAbove = false;
    }
    // Above the map.
    if(vec4Tex.z < z){
        bAbove = true;
    }

    // We are still above or under.
    return false;
}

// Help : http://eugen.dedu.free.fr/projects/bresenham/
void bresenhamLine2(vec3 vec3EndPoint, vec3 vec3LinePoint, vec3 vec3LineDirection,
                    inout vec3 vec3FinalPoint, inout bool bNotFound)
{
    // The size of the image (divided by 2 because we are in -1 to 1 range).
    float fImageLength = uImageWidth / 2.;
    // The ratio to have a point in the -(uImageWidth/2) to (uImageWidth/2) range.
    float fImageRatio = fImageLength / uBBSize;

    // Apply the ratio the incoming points.
    vec3LinePoint *= fImageRatio;
    vec3EndPoint *= fImageRatio;

    // Intial points.
    ivec2 ivec2StartPoint = ivec2(int(vec3LinePoint.x), int(vec3LinePoint.y));
    ivec2 ivec2EndPoint = ivec2(int(vec3EndPoint.x), int(vec3EndPoint.y));

    ivec2 ivec2LastPoint = ivec2StartPoint;

    // vec3LinePoint.x close to -fImageLength.
    if(vec3LinePoint.x  / fImageLength <= -0.99){
        ivec2LastPoint.y = int(-fImageLength);
    }
    // vec3LinePoint.y close to -fImageLength.
    else if(vec3LinePoint.y / fImageLength <= -0.99){
        ivec2LastPoint.x = int(-fImageLength);
    }
    // vec3LinePoint.x close to fImageLength.
    else if(vec3LinePoint.x / fImageLength >= 0.99){
        ivec2LastPoint.y = int(fImageLength);
    }
    // vec3LinePoint.y close to fImageLength.
    else if(vec3LinePoint.y / fImageLength >= 0.99){
        ivec2LastPoint.x = int(fImageLength);
    }

    int i;               // loop counter
    int ystep, xstep;    // the step on y and x axis
    int error;           // the error accumulated during the increment
    int errorprev;       // *vision the previous value of the error variable
    int x = ivec2StartPoint.x;  // the line points
    int y = ivec2StartPoint.y;
    int ddy, ddx;        // compulsory variables: the double values of dy and dx
    int dx = ivec2EndPoint.x - ivec2StartPoint.x;
    int dy = ivec2EndPoint.y - ivec2StartPoint.y;

    bool bAbove = true;
    vec3 vec3LastPointRes;
    vec3 vec3PointRes;
    vec3 vec3LastPointMapRes;
    vec3 vec3PointMapRes;

    int counter = 0;

    //POINT (y, x);  // first point

    // NB the last point can't be here, because of its previous point (which has to be verified)
    if (dy < 0) {
        ystep = -1;
        dy = -dy;
    }
    else{
        ystep = 1;
    }

    if (dx < 0) {
        xstep = -1;
        dx = -dx;
    }
    else{
        xstep = 1;
    }

    ddy = 2 * dy;  // work with double values for full precision
    ddx = 2 * dx;

    // first octant (0 <= slope <= 1)
    if (ddx >= ddy){
        // compulsory initialization (even for errorprev, needed when dx==dy)
        errorprev = dx;  // start in the middle of the square
        error = dx;

        for (int i=0; i<MAX_ITERATIONS_FOR; i++){ // do not use the first point (already done)
            if(i >= dx){
                break;
            }
            x += xstep;
            error += ddy;
            if (error > ddx){  // increment y if AFTER the middle ( > )
                y += ystep;
                error -= ddx;
                // three cases (octant == right->right-top for directions below):
                if (error + errorprev < ddx){ // bottom square also
                    //POINT (y-ystep, x);
                    if(foundIntersectionPixel(vec3EndPoint, vec3LinePoint, ivec2LastPoint, ivec2(x, y-ystep), fImageLength, bAbove,
                                           vec3LastPointRes, vec3PointRes, vec3LastPointMapRes, vec3PointMapRes, counter)) break;
                }
                else if (error + errorprev > ddx){ // left square also
                    //POINT (y, x-xstep);
                    if(foundIntersectionPixel(vec3EndPoint, vec3LinePoint, ivec2LastPoint, ivec2(x-xstep, y), fImageLength, bAbove,
                                             vec3LastPointRes, vec3PointRes, vec3LastPointMapRes, vec3PointMapRes, counter)) break;
                }
                else{  // corner: bottom and left squares also
                    //POINT (y-ystep, x);
                    if(foundIntersectionPixel(vec3EndPoint, vec3LinePoint, ivec2LastPoint, ivec2(x, y-ystep), fImageLength, bAbove,
                                                 vec3LastPointRes, vec3PointRes, vec3LastPointMapRes, vec3PointMapRes, counter)) break;
                    //POINT (y, x-xstep);
                    if(foundIntersectionPixel(vec3EndPoint, vec3LinePoint, ivec2LastPoint, ivec2(x-xstep, y), fImageLength, bAbove,
                                                 vec3LastPointRes, vec3PointRes, vec3LastPointMapRes, vec3PointMapRes, counter)) break;
                }
            }
            //POINT (y, x);
            if(foundIntersectionPixel(vec3EndPoint, vec3LinePoint, ivec2LastPoint, ivec2(x, y), fImageLength, bAbove,
                                        vec3LastPointRes, vec3PointRes, vec3LastPointMapRes, vec3PointMapRes, counter)) break;
            errorprev = error;
        }
    }
    else{  // the same as above
        errorprev = dy;
        error = dy;
        for (int i=0; i<MAX_ITERATIONS_FOR; i++){
            if(i >= dy){
               break;
            }
            y += ystep;
            error += ddx;
            if (error > ddy){
                x += xstep;
                error -= ddy;
                if (error + errorprev < ddy){
                    //POINT (y, x-xstep);
                    if(foundIntersectionPixel(vec3EndPoint, vec3LinePoint, ivec2LastPoint, ivec2(x-xstep, y), fImageLength, bAbove,
                                              vec3LastPointRes, vec3PointRes, vec3LastPointMapRes, vec3PointMapRes, counter)) break;
                }
                else if (error + errorprev > ddy){
                    //POINT (y-ystep, x);
                    if(foundIntersectionPixel(vec3EndPoint, vec3LinePoint, ivec2LastPoint, ivec2(x, y-ystep), fImageLength, bAbove,
                                              vec3LastPointRes, vec3PointRes, vec3LastPointMapRes, vec3PointMapRes, counter)) break;
                }
                else{
                    //POINT (y, x-xstep);
                    if(foundIntersectionPixel(vec3EndPoint, vec3LinePoint, ivec2LastPoint, ivec2(x-xstep, y), fImageLength, bAbove,
                                              vec3LastPointRes, vec3PointRes, vec3LastPointMapRes, vec3PointMapRes, counter)) break;
                    //POINT (y-ystep, x);
                    if(foundIntersectionPixel(vec3EndPoint, vec3LinePoint, ivec2LastPoint, ivec2(x, y-ystep), fImageRatio, bAbove,
                                              vec3LastPointRes, vec3PointRes, vec3LastPointMapRes, vec3PointMapRes, counter)) break;
                }
            }
            //POINT (y, x);
            if(foundIntersectionPixel(vec3EndPoint, vec3LinePoint, ivec2LastPoint, ivec2(x, y), fImageLength, bAbove,
                                      vec3LastPointRes, vec3PointRes, vec3LastPointMapRes, vec3PointMapRes, counter)) break;
            errorprev = error;
        }
    }

    // Webgl console log.
    if(vec3LastPointRes.x == 50. && counter >= 1)
    {
        vec3FinalPoint = vec3(float(counter) * 0.05, 0., 0.);
        return;
    }

    // Outside of the box.
    if(x > int(fImageLength) || x < int(-fImageLength)
    || y > int(fImageLength) || y < int(-fImageLength))
    {
        // To indicate that the point doesn't exist.
        bNotFound = true;
        vec3FinalPoint = vec3(0.9, 0.7, 0.7);
        return;
    }

    vec4 texColor = texture2D(uHeightMapTextureSampler, goodTexCoord(((vec3PointRes.xy / fImageLength) + 1.) / 2.));
    //vec4 texColor = texture2D(uHeightMapTextureSampler, goodTexCoord(((vec2(x, y) / fImageLength) + 1.) / 2.));
    vec3FinalPoint = texColor.xyz;
}