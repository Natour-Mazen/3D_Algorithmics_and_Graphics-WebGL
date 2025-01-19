precision mediump float;


uniform float uBBSize; // The bounding box size factor.
uniform bool uIsWireFrame; // If the wireframe is displayed.
uniform bool uIsOpaque; // If the object is opaque.
uniform float uAspectRatio; // The image aspect ratio.
uniform float uFOV; // FOV.

uniform sampler2D uVoxelMapTypeSampler; // The voxel map.
uniform sampler2D uFunctionTransferSampler; // The 1D image for the custom function transfer.
uniform bool uIsVoxelMapEmpty; // Tell if the voxel map is empty or not.
uniform float uVoxelNoise; // The voxel noise.
uniform float uVoxelIntensity; // The intensity of the voxel.
uniform float uNbImageDepth; // The size of the images inside the uVoxelMapTypeSampler.
uniform float uNbImageWidth; // The number of images along the width.
uniform float uNbImageHeight; // The number of images along the height.
uniform int uTransferFunc; // The choice of the transfer function.
uniform float uHeartBeatFactor; // The heart factor.
uniform bool uDisplaySlicesCubes; // If the slice modification is active.
uniform float uSlicesToDisplay[8]; // The slices to display.

const int MAX_ITERATIONS = 700; // For the ray marching.
float BORDER_SIZE = 0.01 * uBBSize; // The border size of the wireframe.

// Nyquist–Shannon sampling to have the best step.
float uBBSizeCarre = uBBSize * uBBSize;
float DIAGO = sqrt(sqrt(uBBSizeCarre + uBBSizeCarre) * sqrt(uBBSizeCarre + uBBSizeCarre) + uBBSizeCarre); // For size = 10 => 44
float PAS = DIAGO / sqrt(uNbImageDepth * uNbImageDepth + uNbImageDepth * uNbImageDepth) * 2.; // LQ : 0.12, NQ : 0.25, HQ : 0.49

const vec3 BACKGROUND_COLOR = vec3(0.7, 0.7, 0.7);

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
vec4 transformationFunction(vec4 color, vec3 position);
vec4 displaySlicesCubes(vec4 texImage,vec3 position);

vec2 goodTexCoord(vec2 tex);
vec3 borderColor(vec3 position);

void main(void)
{
    if(!uIsVoxelMapEmpty){
        gl_FragColor = vec4(0., 0., 0., 1.);
        return;
    }

    // Default color.
    vec4 color = vec4(0., 0., 0., 0.);

    // The color of the border (wireframe).
    vec3 borderColor = borderColor(vVertexPosition);
    if(borderColor.r != -1.)
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

    // The value that we increment during the ray marching.
    float t = 0.05;

    for (int i = 0; i < MAX_ITERATIONS; i++)
    {
        vec3 position = vVertexPosition + t * dirPixelObj;
        t += PAS;

        // If we are under the map, outside of the box.
        if(position.z < 0. || position.z > uBBSize * 2.01 || position.x > uBBSize || position.x < -uBBSize
        || position.y > uBBSize || position.y < -uBBSize)
        {
            float BBSizeOffset = uBBSize + 0.1;
            float nBBSizeOffset = -uBBSize - 0.1;
            bool bBackgroundColor = true; // To add the background color to the current color.

            // If we are in opaque or wireframe mode.
            if(uIsOpaque || uIsWireFrame) {
                // Top Yellow color.
                if(position.z >= uBBSize * 2.01) {
                    if(position.z >= uBBSize + BORDER_SIZE){
                        // color = vec4(1., 1., 0., 0.); // Normal Yellow Color
                        if(!uIsWireFrame || position.x >= uBBSize - BORDER_SIZE || position.x <= -uBBSize + BORDER_SIZE
                            || position.y >= uBBSize - BORDER_SIZE || position.y <= -uBBSize + BORDER_SIZE)
                        {
                            color += vec4(vec3(1., 0., 1.) * (1. - color.a), 1. - color.a);
                            bBackgroundColor = false;
                        }
                    }
                }
                // Bottom White color.
                if(position.z < 0.) {
                    // color = vec4(1., 1., 0., 0.); // Normal Yellow Color
                    if(!uIsWireFrame || position.x >= uBBSize - BORDER_SIZE || position.x <= -uBBSize + BORDER_SIZE
                        || position.y >= uBBSize - BORDER_SIZE || position.y <= -uBBSize + BORDER_SIZE)
                    {
                        color += vec4(vec3(1., 1., 1.) * (1. - color.a), 1. - color.a);
                        bBackgroundColor = false;
                    }
                }
                // Right Red color.
                else if(position.x > uBBSize && position.y <= BBSizeOffset && position.y >= nBBSizeOffset) {
                    // color = vec4(1., 0., 0., 0.); // Normal Red Color
                    if(!uIsWireFrame || position.y >= uBBSize - BORDER_SIZE || position.y <= -uBBSize + BORDER_SIZE
                        || position.z >= uBBSize * 2. - BORDER_SIZE || position.z <= BORDER_SIZE)
                    {
                        color += vec4(vec3(1., 0., 0.) * (1. - color.a), 1. - color.a);
                        bBackgroundColor = false;
                    }
                }
                // Left Green color.
                else if(position.x < -uBBSize && position.y <= BBSizeOffset && position.y >= nBBSizeOffset) {
                    // color = vec4(0., 1., 0., 0.); // Normal Green Color
                    if(!uIsWireFrame || position.y >= uBBSize - BORDER_SIZE || position.y <= -uBBSize + BORDER_SIZE
                        || position.z >= uBBSize * 2. - BORDER_SIZE || position.z <= BORDER_SIZE)
                    {
                        color += vec4(vec3(0., 0., 1.) * (1. - color.a), 1. - color.a);
                        bBackgroundColor = false;
                    }
                }
                // Front Blue color.
                else if(position.y > uBBSize && position.x <= BBSizeOffset && position.x >= nBBSizeOffset) {
                    // color = vec4(0., 0., 1., 0.); // Normal Blue Color
                    if(!uIsWireFrame || position.x >= uBBSize - BORDER_SIZE || position.x <= -uBBSize + BORDER_SIZE
                        || position.z >= uBBSize * 2. - BORDER_SIZE || position.z <= BORDER_SIZE)
                    {
                        color += vec4(vec3(0., 1., 0.) * (1. - color.a), 1. - color.a);
                        bBackgroundColor = false;
                    }
                }
                // Back Pink color.
                else if(position.y < -uBBSize && position.x <= BBSizeOffset && position.x >= nBBSizeOffset) {
                    //color = vec4(1., 0., 1., 0.); // Normal Pink Color
                    if(!uIsWireFrame || position.x >= uBBSize - BORDER_SIZE || position.x <= -uBBSize + BORDER_SIZE
                        || position.z >= uBBSize * 2. - BORDER_SIZE || position.z <= BORDER_SIZE)
                    {
                        color += vec4(vec3(1., 1., 0.) * (1. - color.a), 1. - color.a);
                        bBackgroundColor = false;
                    }
                }
                else {
                    bBackgroundColor = true;
                }
                if(bBackgroundColor){
                    color += vec4(BACKGROUND_COLOR * (1. - color.a), 1. - color.a);
                }
                break;
            }
            // We have not found a color along the ray.
            else if(color.a == 0.)
            {
                discard;
                break;
            }
            // If we don't have a mode.
            else {
                color += vec4(BACKGROUND_COLOR * (1. - color.a), 1. - color.a);
                break;
            }
        }

        // To get the color of the pixel in the current position.
        vec4 texImage = getVoxcelInPos(position);

        if(uDisplaySlicesCubes){
            texImage = displaySlicesCubes(texImage, position);
        }else{
            texImage = transformationFunction(texImage, position);
        }

        texImage.r *= texImage.a;
        texImage.g *= texImage.a;
        texImage.b *= texImage.a;

        color += texImage * (1. - color.a);

        if(color.a > 0.99)
        break;
    }

    gl_FragColor = vec4(color.rbg, 1.0);
}


// ======================================================//
//                      Functions                        //
// ===================================================== //

/** @breif Find the color on the 2D texture associted with the 3D position on the cube.
*   @param position (vec3) The position where we need a color.
    @return (vec4) The color found with the position.
*/
vec4 getVoxcelInPos(vec3 position)
{
    vec3 positionN = position / uBBSize;
    positionN.xy += 1.;
    positionN.xy /= 2.;
    positionN.z /= 2.;
    // positionN x: 0 to 1, y: 0 to 1, z: 0 to 1

    // Index for the depth.
    float sliceIndex = max(0., min(floor(positionN.z * (uNbImageDepth)), uNbImageDepth - 1.));

    // Index of the image to display (x, y).
    float x = mod(sliceIndex, uNbImageWidth);
    float y = floor(sliceIndex / uNbImageWidth);

    // Because sometime mod is not working correctly. 11.99 mod 12 = 12 ????????????
    if(x >= uNbImageWidth){
        x = uNbImageWidth - 1.;
    }

    // The position of the pixel on the texture.
    vec2 positionTexture = vec2(
    ((x + positionN.x) / uNbImageWidth),
    ((y + positionN.y) / uNbImageHeight)
    );

    return texture2D(uVoxelMapTypeSampler, positionTexture);
}

vec4 transformationDefault(vec4 color)
{
    if(color.a >= 0.6){
        color.a = 1.;
    }
    return color;
}

vec4 transformationCustom(vec4 color)
{
    return texture2D(uFunctionTransferSampler, vec2(color.a, 0.)).rbga;
}

vec4 transformationRed(vec4 color)
{
    color.g = 0.;
    color.b = 0.;
    return color;
}

vec4 transformationBlueToGreen(vec4 color)
{
    color.r = 0.;
    color.g = mix(1., 0., color.a);
    color.b = mix(0., 1., color.a);
    return color;
}

vec4 transformationSepia(vec4 color)
{
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
    color.rgb = vec3(1.0) - color.rgb;
    return color;
}

vec4 transformationGlitch(vec4 color, vec3 position)
{
    float glitchIntensity = fract(sin(dot(position.xy, vec2(12.9898, 78.233))) * 4758.5453);
    if (glitchIntensity > 0.9) {
        color.rgb = vec3(1.0, 0.0, 0.0); // Red glitch
    } else if (glitchIntensity > 0.8) {
        color.rgb = vec3(0.0, 1.0, 0.0); // Green glitch
    } else if (glitchIntensity > 0.7) {
        color.rgb = vec3(0.0, 0.0, 1.0); // Blue glitch
    } else {
        color.rgb = mix(color.rgb, vec3(0.0), glitchIntensity * 2.8); // Darken the color
    }
    return color;
}

vec4 transformationHeartBeat(vec4 color)
{
    float factor = sin(color.a * 10.0 + uHeartBeatFactor) * 0.5 + 0.5;
    color.rgb = mix(color.rgb, vec3(1.0, 0.0, 0.0), factor);
    return color;
}

vec4 transformationThermal(vec4 color)
{
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

int getColorSliceIndex(vec3 position){
    if (position.x >= 0.0  && position.z >= 1.0 * uBBSize && position.y >= 0.0 ) { // Position du cube Rouge
        return 0;
    }else if (position.x <= 0.0  && position.z >= 1.0 * uBBSize && position.y <= 0.0 ) { // Position du cube Vert
        return 1;
    }else if (position.x >= 0.0  && position.z >= 1.0 * uBBSize && position.y <= 0.0 ) { // Position du cube Bleu
        return 2;
    }else if (position.x <= 0.0  && position.z >= 1.0 * uBBSize && position.y >= 0.0 ) { // Position du cube Jaune
        return 3;
    }else if (position.x >= 0.0  && position.z <= 1.0 * uBBSize && position.y >= 0.0 ) { // Position du cube Rose
        return 4;
    }else if (position.x <= 0.0  && position.z <= 1.0 * uBBSize && position.y <= 0.0 ) { // Position du cube Cyan
        return 5;
    }else if (position.x >= 0.0  && position.z <= 1.0 * uBBSize && position.y <= 0.0 ) { // Position du cube Blanc
        return 6;
    }else if (position.x <= 0.0  && position.z <= 1.0 * uBBSize && position.y >= 0.0 ) { // Position du cube Gris
        return 7;
    }
    return -1;

}

vec4 cutSlicesCubes(vec4 color,vec3 position){
    int index = getColorSliceIndex(position);
    bool isSlice = false;
    if (index == 0 && uSlicesToDisplay[0] == 0.) {
        isSlice = true;
    } else if (index == 1 && uSlicesToDisplay[1] == 0.) {
        isSlice = true;
    } else if (index == 2 && uSlicesToDisplay[2] == 0.) {
        isSlice = true;
    } else if (index == 3 && uSlicesToDisplay[3] == 0.) {
        isSlice = true;
    } else if (index == 4 && uSlicesToDisplay[4] == 0.) {
        isSlice = true;
    } else if (index == 5 && uSlicesToDisplay[5] == 0.) {
        isSlice = true;
    } else if (index == 6 && uSlicesToDisplay[6] == 0.) {
        isSlice = true;
    } else if (index == 7 && uSlicesToDisplay[7] == 0.) {
        isSlice = true;
    }

    if(isSlice){
        return vec4(0.0, 0.0, 0.0, 0.0);
    }

    return color;
}

vec4 displaySlicesCubes(vec4 color,vec3 position)
{
    color = cutSlicesCubes(color, position);

    color.a = color.r;
    if(color.a < (uVoxelNoise * 0.01) - 0.01){
        color.a = 0.;
    }
    if(color.a >= 0.6){
        color.a = 1.;
    }
    if(color.a <= 0.01)
    {
        color.a = 0.004;
        int index = getColorSliceIndex(position);
        if (index == 0) {
            color.rgb = vec3(1.0, 0.0, 0.0); // Rouge
        } else if (index == 1) {
            color.rgb = vec3(0.0, 0.0, 1.0); // Vert
        } else if (index == 2) {
            color.rgb = vec3(0.0, 1.0, 0.0); // Bleu
        } else if (index == 3) {
            color.rgb = vec3(1.0, 0.0, 1.0); // Jaune
        } else if (index == 4) {
            color.rgb = vec3(1.0, 1.0, 0.0); // Rose
        } else if (index == 5) {
            color.rgb = vec3(0.0, 1.0, 1.0); // Cyan
        } else if (index == 6) {
            color.rgb = vec3(1.0, 1.0, 1.0); // Blanc
        } else if (index == 7) {
            color.rgb = vec3(0.5, 0.5, 0.5); // Gris
        }
    }
    return color;
}

vec4 transformationFunction(vec4 color, vec3 position)
{
    if(color.r != 0.){
        color *= (1. + (uVoxelIntensity * 0.1));
    }
    // The choice of the transfer function.
    int v = uTransferFunc;

    // To remove the artifacts.
    color.a = color.r;
    if(color.a < (uVoxelNoise * 0.01) - 0.01){
        color.a = 0.;
    }

    color = cutSlicesCubes(color, position);

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
        color = transformationGlitch(color, position);
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
        if(position.z == uBBSize * 2.) {
            if(position.x >= uBBSize - BORDER_SIZE || position.x <= -uBBSize + BORDER_SIZE
            || position.y >= uBBSize - BORDER_SIZE || position.y <= -uBBSize + BORDER_SIZE) {
                color = vec3(1., 1., 0.);
            }
        }
        // Right Red
        else if(position.x == uBBSize) {
            if(position.y >= uBBSize - BORDER_SIZE || position.y <= -uBBSize + BORDER_SIZE
            || position.z >= uBBSize * 2. - BORDER_SIZE || position.z <= BORDER_SIZE) {
                color = vec3(1., 0., 0.);
            }
        }
        // Left Green
        else if(position.x == -uBBSize) {
            if(position.y >= uBBSize - BORDER_SIZE || position.y <= -uBBSize + BORDER_SIZE
            || position.z >= uBBSize * 2. - BORDER_SIZE || position.z <=  BORDER_SIZE) {
                color = vec3(0., 1., 0.);
            }
        }
        // Front Blue
        else if(position.y == uBBSize) {
            if(position.x >= uBBSize - BORDER_SIZE || position.x <= -uBBSize + BORDER_SIZE
            || position.z >= uBBSize * 2. - BORDER_SIZE || position.z <= BORDER_SIZE) {
                color = vec3(0., 0., 1.);
            }
        }
        // Back pink
        else if(position.y == -uBBSize) {
            if(position.x >= uBBSize - BORDER_SIZE || position.x <= -uBBSize + BORDER_SIZE
            || position.z >= uBBSize * 2. - BORDER_SIZE || position.z <= BORDER_SIZE) {
                color = vec3(1., 0., 1.);
            }
        }
    }
    return color;
}