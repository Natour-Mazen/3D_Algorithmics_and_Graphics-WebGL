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
uniform float uVoxelMapRayDepth; // The ray depth.
uniform int uVoxelMapTransfertFunc; // The choice of the transfer function.
uniform float uVoxelMapSize; // The size of the images inside the uVoxelMapTypeSampler.
uniform float uNbImageWidth; // The number of images along the width.
uniform float uNbImageHeight; // The number of images along the height.
uniform float uHeartBeatFactor; // The heart factor.
uniform vec4 uTransferFuncCustomValues[5]; // The values for the custom transfer function.

const int MAX_ITERATIONS = 700; // For the ray marching.
float BORDER_SIZE = 0.005 * uBBSize; // The border size of the wireframe.

// Nyquist–Shannon sampling to have the best step.
float uBBSizeCarre = uBBSize * uBBSize;
float DIAGO = sqrt(sqrt(uBBSizeCarre + uBBSizeCarre) * sqrt(uBBSizeCarre + uBBSizeCarre) + uBBSizeCarre);
float PAS = DIAGO / sqrt(uVoxelMapSize * uVoxelMapSize + uVoxelMapSize * uVoxelMapSize) * 2.;

varying vec3 vVertexPosition;        // Reel vertex position.
varying vec4 vVertexPositionSpace;   // Vertex position project on the sreen.
varying mat4 viMVMatrix;             // Inverse MVMatrix.

// All the utility fonctions.
vec4 getVoxcelInPos(vec3 position);

vec4 transformationDefault(vec4 color);
vec4 transformationCustom(vec4 color);
vec4 transformationRed(vec4 color);
vec4 transformationBlueToGreen(vec4 color);
vec4 transformationSepia(vec4 color);
vec4 transformationInvert(vec4 color);
vec4 transformationGlitch(vec4 color);
vec4 transformationThermal(vec4 color);
vec4 transformationRainbow(vec4 color);
vec4 transformationRedJeely(vec4 color);
vec4 transformationFunction(vec4 color);

vec2 goodTexCoord(vec2 tex);
vec3 borderColor(vec3 position);

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
    float t = 0.0;
    // The value of the height of the height map.
    float heightMapL = 0.;
    // To know if the last position was above.
    bool above = false;
    // The last position computed.
    vec3 lastPosition = vVertexPosition + t * dirPixelObj;
    // The last 'z' position calculated.
    float fLastZ = 0.;

    for (int i = 0; i < MAX_ITERATIONS; i++)
    {
        vec3 position = vVertexPosition + t * dirPixelObj;
        t += PAS;

        // To get the color of the pixel in the current position.
        vec4 texImage = getVoxcelInPos(position);
        texImage = transformationFunction(texImage);

        texImage.r *= texImage.a;
        texImage.g *= texImage.a;
        texImage.b *= texImage.a;

        color += texImage * (1. - color.a);

        if(color.a > 0.99)
            break;

        // If we are under the map, outside of the box or if we haven't found a valid position.
        if(position.z < -0.1 || position.z > uBBSize * 2. || position.x > uBBSize || position.x < -uBBSize
        || position.y > uBBSize || position.y < -uBBSize)
        {
            // We have not found a color along the ray.
            if(color.a == 0.)
            {
                discard;
                break;
            }
            // If we are in opaque or wireframe mode.
            else if(uIsOpaque || uIsWireFrame) {
                // Yellow color.
                if(position.z >= uBBSize * 2.) {
                    if(uIsWireFrame && position.z >= uBBSize * 2. + BORDER_SIZE) {
                        //discard;
                    }
                    else{
                        color = vec4(1., 1., 0., 0.);
                    }
                }
                // Red color.
                else if(position.x > uBBSize && position.y <= uBBSize && position.y >= -uBBSize) {
                    if(uIsWireFrame && !(position.y >= uBBSize - BORDER_SIZE) && !(position.y <= -uBBSize + BORDER_SIZE) &&
                    !(position.z >= uBBSize * 2. - BORDER_SIZE) && !(position.z <= -uBBSize * 2. + BORDER_SIZE)) {
                        //discard;
                    }
                    else{
                        color = vec4(1., 0., 0., 0.);
                    }
                }
                // Green color.
                else if( position.x < -uBBSize && position.y <= uBBSize && position.y >= -uBBSize) {
                    if(uIsWireFrame && !(position.y >= uBBSize - BORDER_SIZE) && !(position.y <= -uBBSize + BORDER_SIZE) &&
                    !(position.z >= uBBSize * 2. - BORDER_SIZE) && !(position.z <= -uBBSize * 2. + BORDER_SIZE)) {
                        //discard;
                    }
                    else {
                        color = vec4(0., 1., 0., 0.);
                    }
                }
                // Blue color.
                else if(position.y > uBBSize && position.x <= uBBSize && position.x >= -uBBSize) {
                    if(uIsWireFrame && !(position.x >= uBBSize - BORDER_SIZE) && !(position.x <= -uBBSize + BORDER_SIZE) &&
                    !(position.z >= uBBSize * 2. - BORDER_SIZE) && !(position.z <= -uBBSize * 2. + BORDER_SIZE)) {
                        //discard;
                    }
                    else{
                        color = vec4(0., 0., 1., 0.);
                    }
                }
                // Pink color.
                else if(position.y < -uBBSize && position.x <= uBBSize && position.x >= -uBBSize) {
                    if(uIsWireFrame && !(position.x >= uBBSize - BORDER_SIZE) && !(position.x <= -uBBSize + BORDER_SIZE) &&
                    !(position.z >= uBBSize * 2. - BORDER_SIZE) && !(position.z <= -uBBSize * 2. + BORDER_SIZE)) {
                        //discard;
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
            // If we don't have a mode.
            else {
                color += vec4(vec3(0.7, 0.7, 0.7) * (1. - color.a), 1. - color.a);
                //color += vec4(vec3(0.7, 0.7, 0.7), 1. - color.a);
                //color = vec4(color.rgb, 1.);
                break;
            }
        }
    }

    gl_FragColor = vec4(color.rbg, 1.0);
}


// ======================================================//
//                      Functions                        //
// ===================================================== //

vec4 getVoxcelInPos(vec3 position)
{
    vec3 positionN = position / uBBSize;
    positionN.xy += 1.;
    positionN.xy /= 2.;
    // positionN x: 0 to 1, y: 0 to 1, z: 0 to 1

    vec3 positionOnImage = positionN * uVoxelMapSize;

    float sliceIndex = floor(positionOnImage.z / 2.); // L'indice de tranche en profondeur
    float x = mod(sliceIndex, uNbImageWidth);          // Colonne de la tranche dans la grille
    float y = floor(sliceIndex / uNbImageWidth);       // Ligne de la tranche dans la grille

    vec2 positionTexture = vec2(
    (x * uVoxelMapSize + positionOnImage.x) / (uNbImageWidth * uVoxelMapSize), // Position x en prenant en compte la colonne
    (y * uVoxelMapSize + positionOnImage.y) / (uNbImageHeight * uVoxelMapSize)  // Position y en prenant en compte la ligne
    );

    vec4 texImage = texture2D(uVoxelMapTypeSampler, goodTexCoord(positionTexture));
    return texImage;
}

vec4 transformationDefault(vec4 color)
{
    color.a = color.r;
    if(color.a <= 0.1 / uVoxelMapRayDepth){
        color.a = 0.;
    }
    else if(color.a >= 0.6){
        color.a = 1.;
    }
    return color;
}

vec4 transformationCustom(vec4 color)
{
    // The values are in (r,b,g), why we don't know because in the js it's (r,g,b).
    vec4 color1 = uTransferFuncCustomValues[0].rbga;
    vec4 color2 = uTransferFuncCustomValues[1].rbga;
    vec4 color3 = uTransferFuncCustomValues[2].rbga;
    vec4 color4 = uTransferFuncCustomValues[3].rbga;
    vec4 color5 = uTransferFuncCustomValues[4].rbga;

    color *= uVoxelMapRayDepth / 2.; // TODO : To change with another slider.
    float colorAlpha = color.r;

    // To remove the artifacts.
    if(colorAlpha <= 0.1 / uVoxelMapRayDepth){
        color.a = 0.;
        return color;
    }

    // Exemple of what could be a custom transfer function.
    // With color1 = [1., 0., 0., 1.0]
    // With color2 = [1., 1., 0., 0.6]
    // With color3 = [1., 0., 1., 0.2] >>> The alpha is important here for the placement of the point on the transfer function.
    // With color4 = [0., 1., 0., 0.6]
    // With color5 = [1., 0., 1., 1.0]
    ///
    ///    1           5
    ///    |\         /|
    ///    | \       / |
    ///    |  2     4  |
    ///    |   \   /   |
    ///    |    \ /    |
    ///    |     3     |  >>> The position on 'x' of the points are fixed but alpha change the 'y' position.
    ///    |___________|

    // In function of the color of the pixel (here the red component), we select the point on the curve that is returned.
    // The curve (transfer fucntion), get use the new color and the new alpha.

    if(colorAlpha <= 1. / 4.){
        float mixValue = colorAlpha * (1. / 4.);
        color.a = mix(color1.a, color2.a, (colorAlpha) * (1. / 4.));
        color.rgb = mix(color1.rgb, color2.rgb, (colorAlpha) * (1. / 4.));
    }
    else if(colorAlpha <= 2. / 4.){
        float mixValue = (colorAlpha - 1. / 4.) * (2. / 4. - 1. / 4.);
        color.a = mix(color2.a, color3.a, mixValue);
        color.rgb = mix(color2.rgb, color3.rgb, mixValue);
    }
    else if(colorAlpha <= 3. / 4.){
        float mixValue = (colorAlpha - 2. / 4.) * (3. / 4. - 2. / 4.);
        color.a = mix(color3.a, color4.a, mixValue);
        color.rgb = mix(color3.rgb, color4.rgb, mixValue);
    }
    else{ // colorAlpha <= 1.
          float mixValue = (colorAlpha - 3. / 4.) * (4. / 4. - 3. / 4.);
          color.a = mix(color4.a, color5.a, mixValue);
          color.rgb = mix(color4.rgb, color5.rgb, mixValue);
    }

    return color;
}

vec4 transformationRed(vec4 color)
{
    color.a = color.r;
    if(color.a <= 0.1 / uVoxelMapRayDepth){
        color.a = 0.;
    }
    color.g = 0.;
    color.b = 0.;
    return color;
}

vec4 transformationBlueToGreen(vec4 color)
{
    color.a = color.r;
    if(color.a <= 0.1 / uVoxelMapRayDepth){
        color.a = 0.;
    }
    color.r = 0.;
    color.g = mix(1., 0., color.a);
    color.b = mix(0., 1., color.a);
    return color;
}

vec4 transformationSepia(vec4 color)
{
    color.a = color.r;
    if (color.a <= 0.1 / uVoxelMapRayDepth) {
        color.a = 0.;
    }
    float r = color.r;
    float g = color.g;
    float b = color.b;
    color.r = dot(vec3(0.393, 0.769, 0.189), vec3(r, g, b));
    color.g = dot(vec3(0.349, 0.686, 0.168), vec3(r, g, b));
    color.b = dot(vec3(0.272, 0.534, 0.131), vec3(r, g, b));
    return color;
}

vec4 transformationInvert(vec4 color)
{
    color.a = color.r;
    if (color.a <= 0.1 / uVoxelMapRayDepth) {
        color.a = 0.;
    }
    color.rgb = vec3(1.0) - color.rgb;
    return color;
}

vec4 transformationGlitch(vec4 color)
{
    color.a = color.r;
    if (color.a <= 0.1 / uVoxelMapRayDepth) {
        color.a = 0.;
    }
    float glitchIntensity = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
    if (glitchIntensity > 0.9) {
        color.rgb = vec3(1.0, 0.0, 0.0); // Red glitch
    } else if (glitchIntensity > 0.8) {
        color.rgb = vec3(0.0, 1.0, 0.0); // Green glitch
    } else if (glitchIntensity > 0.7) {
        color.rgb = vec3(0.0, 0.0, 1.0); // Blue glitch
    } else {
        color.rgb = mix(color.rgb, vec3(0.0), glitchIntensity * 0.5); // Darken the color
    }
    return color;
}

vec4 transformationHeartBeat(vec4 color) {
    color.a = color.r;
    if (color.a <= 0.1 / uVoxelMapRayDepth) {
        color.a = 0.;
    }
    float glitchFactor = sin(color.a * 10.0 + uHeartBeatFactor) * 0.5 + 0.5;
    color.rgb = mix(color.rgb, vec3(1.0, 0.0, 0.0), glitchFactor);
    return color;
}

vec4 transformationThermal(vec4 color)
{
    color.a = color.r;
    if (color.a <= 0.1 / uVoxelMapRayDepth) {
        color.a = 0.;
    }
    float intensity = dot(color.rgb, vec3(0.299, 0.587, 0.114));
    if (intensity > 0.8) {
        color.rgb = vec3(1.0, 0.0, 0.0); // Red
    } else if (intensity > 0.6) {
        color.rgb = vec3(1.0, 0.5, 0.0); // Orange
    } else if (intensity > 0.4) {
        color.rgb = vec3(1.0, 1.0, 0.0); // Yellow
    } else if (intensity > 0.2) {
        color.rgb = vec3(0.0, 1.0, 0.0); // Green
    } else {
        color.rgb = vec3(0.0, 0.0, 1.0); // Blue
    }
    return color;
}

vec4 transformationRainbow(vec4 color)
{
    color.a = color.r;
    if (color.a <= 0.1 / uVoxelMapRayDepth) {
        color.a = 0.;
    }
    float intensity = dot(color.rgb, vec3(0.299, 0.587, 0.114));
    float hue = mod(intensity * 6.0, 6.0);
    if (hue < 1.0) {
        color.rgb = vec3(1.0, hue, 0.0);
    } else if (hue < 2.0) {
        color.rgb = vec3(2.0 - hue, 1.0, 0.0);
    } else if (hue < 3.0) {
        color.rgb = vec3(0.0, 1.0, hue - 2.0);
    } else if (hue < 4.0) {
        color.rgb = vec3(0.0, 4.0 - hue, 1.0);
    } else if (hue < 5.0) {
        color.rgb = vec3(hue - 4.0, 0.0, 1.0);
    } else {
        color.rgb = vec3(1.0, 0.0, 6.0 - hue);
    }
    return color;
}

vec4 transformationRedJeely(vec4 color)
{
    color.a = color.r;
    if(color.a <= 0.1 / uVoxelMapRayDepth){
        color.a = 0.;
    }
    if(color.a >= 0.6){
        color.a = 1.;
    }
    if(color.a <= 0.01)
    {
        color.a = 0.01;
        color.rgb = vec3(0.5, 0., 0.);
    }
    return color;
}

vec4 transformationFunction(vec4 color)
{
    int v = uVoxelMapTransfertFunc;
    if (v == 0) {
        color = transformationDefault(color);
    }else if(v == 1){
        color = transformationCustom(color);
    } else if(v == 2){
        color = transformationRed(color);
    } else if(v == 3){
        color = transformationBlueToGreen(color);
    } else if(v == 4){
        color = transformationSepia(color);
    }  else if (v == 5) {
        color = transformationGlitch(color);
    } else if (v == 6) {
        color = transformationInvert(color);
    } else if (v == 7) {
        color = transformationHeartBeat(color);
    } else if (v == 8) {
        color = transformationThermal(color);
    }else if (v == 9) {
        color = transformationRainbow(color);
    }else if (v == 10) {
        color = transformationRedJeely(color);
    } else {
        color = transformationDefault(color);
    }

    return color;
}

vec2 goodTexCoord(vec2 tex)
{
    tex.x = max(0., min(tex.x, 1.));
    tex.y = max(0., min(tex.y, 1.));
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