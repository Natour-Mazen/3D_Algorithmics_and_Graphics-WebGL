function createTexture(gl) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    const level = 0;
    const internalFormat = gl.RGBA8;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 255, 255]);

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);

    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);

    return texture;
}

function handleImageLoad(gl, texture, image, callback) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, image);

    const linearTextureRead = true;

    gl.generateMipmap(gl.TEXTURE_2D);
    if(linearTextureRead){
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    }
    else{
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);

    const imageData = ctx.getImageData(0, 0, image.width, image.height);
    callback(imageData.data);
}

function loadTexture(gl, url) {
    const texture = createTexture(gl);

    const image = new Image();
    image.onload = function() {
        handleImageLoad(gl, texture, image, () => {});
    };
    image.src = url;

    return texture;
}

const textureDefaultWidth = 1000;
const textureDefaultHeight = 1;

function createHorizontalGradientTexture(gl, data) {
    // Check that the data array is a multiple of 5 (r, g, b, a, pos)
    if (data.length % 5 !== 0) {
        throw new Error("Le tableau 'data' doit contenir un multiple de 5 éléments (r, g, b, a, pos).\nExemple : [r, g, b, a, pos, r, g, b, a, pos,...]");
    }

    // Rewrite the array to get an array of objects {r, g, b, a, pos}
    // Exemple : [r, g, b, a, pos, r, g, b, a, pos,...] => [{r, g, b, a, pos}, {r, g, b, a, pos},...]
    let colors = [];
    for (let i = 0; i < data.length; i += 5) {
        colors.push({
            r: Math.round(data[i] * 255),
            g: Math.round(data[i + 1] * 255),
            b: Math.round(data[i + 2] * 255),
            a: Math.round(data[i + 3] * 255),
            pos: data[i + 4]
        });
    }

    // sort colors by position (pos)
    colors.sort((a, b) => a.pos - b.pos);

    // Texture dimensions
    const width = textureDefaultWidth; // Texture 1D
    const height = 1; // Texture 1D

    // Creation of an array to represent the texture
    const textureData = new Uint8Array(width * 4); // 4 channels (r, g, b, a) per pixel


    // Function to get the interpolated color for a given position
    function getInterpolatedColorAtPosition(pos) {
        let leftIndex = -1, rightIndex = -1;

        // Find the two neighboring colors
        for (let i = 0; i < colors.length; i++) {
            const keyPos = colors[i].pos;
            if (keyPos <= pos) {
                leftIndex = i;
            } else {
                rightIndex = i;
                break;
            }
        }

        // if no color to the left, take the closest to the right
        if (leftIndex === -1) {
            leftIndex = rightIndex;
        }

        // if no color to the right, take the closest to the left
        if (rightIndex === -1) {
            rightIndex = leftIndex;
        }

        const leftColor = colors[leftIndex];
        const rightColor = colors[rightIndex];

        // if leftIndex == rightIndex, there is only one color, so no interpolation
        if (leftIndex === rightIndex) {
            return { color: [leftColor.r, leftColor.g, leftColor.b, leftColor.a] };
        }

        const leftPos = leftColor.pos;
        const rightPos = rightColor.pos;

        // Calculation of the normalized position between the two colors (t)
        const t = (pos - leftPos) / (rightPos - leftPos);

        // Color interpolation
        const r = Math.round(leftColor.r * (1 - t) + rightColor.r * t);
        const g = Math.round(leftColor.g * (1 - t) + rightColor.g * t);
        const b = Math.round(leftColor.b * (1 - t) + rightColor.b * t);
        const a = Math.round(leftColor.a * (1 - t) + rightColor.a * t);

        return { color: [r, g, b, a] };
    }

    for (let x = 0; x < width; x++) {
        // Calculation of the normalized pixel position
        const pos = x / (width - 1);

        // Get the interpolated color at the position
        const { color } = getInterpolatedColorAtPosition(pos);

        // Filling the texture data with the color
        const pixelIndex = x * 4;
        textureData[pixelIndex] = color[0];
        textureData[pixelIndex + 1] = color[1];
        textureData[pixelIndex + 2] = color[2];
        textureData[pixelIndex + 3] = color[3];
    }

    // Create the texture object and bind it
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Load the texture data
    gl.texImage2D(
        gl.TEXTURE_2D,    // texture cible
        0,                // mipmap level
        gl.RGBA,          // interneFormat
        width,            // width,
        height,           // height
        0,                // border (always 0)
        gl.RGBA,          // textureFormat
        gl.UNSIGNED_BYTE, // dataType
        textureData       // textureData
    );

    // Texture wrapping et filtering
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    // Save the texture as PNG for debugging purposes
    // saveTextureAsPNG(gl, texture,"gradient.png");

    return texture;
}

function transformWebGLTextureToPNG(gl, texture, width = textureDefaultWidth, height = textureDefaultHeight) {
    // If the width and height are different, choose the largest dimension to make a square
    if (width !== height) {
        const maxDimension = Math.max(width, height); // We choose the largest dimension to make a square
        width = maxDimension;
        height = maxDimension;
    }

    // Create a framebuffer
    const framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

    // Check if the framebuffer is complete
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
        console.error("Erreur : Framebuffer incomplet.");
        return;
    }

    // Read the pixels from the framebuffer
    const pixels = new Uint8Array(width * height * 4);
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);


    const originalWidth = textureDefaultWidth;
    const originalHeight = 1;

    // If the original width and height are not equal, duplicate the texture on multiple lines
    if (originalWidth !== originalHeight) {
        // Create an array to contain the duplicated texture in square form
        const squarePixels = new Uint8Array(width * height * 4);

        // Duplicate the texture over the entire square surface
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                // Calculate the index in the original texture (repeated on multiple lines)
                const originalX = x % originalWidth;
                const originalY = y % originalHeight;

                const originalIndex = (originalY * originalWidth + originalX) * 4;
                const squareIndex = (y * width + x) * 4;

                // Copy the texture data to the square texture
                squarePixels[squareIndex] = pixels[originalIndex];       // R
                squarePixels[squareIndex + 1] = pixels[originalIndex + 1]; // G
                squarePixels[squareIndex + 2] = pixels[originalIndex + 2]; // B
                squarePixels[squareIndex + 3] = pixels[originalIndex + 3]; // A
            }
        }

        // Update the pixels for the square texture
        pixels.set(squarePixels);
    }

    // unbind the framebuffer
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.deleteFramebuffer(framebuffer);

    // Create a canvas to draw the pixels, then convert it to PNG
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");

    //Draw the pixels on the canvas
    const imageData = context.createImageData(width, height);
    imageData.data.set(pixels);
    context.putImageData(imageData, 0, 0);

    // return the PNG image
    return canvas.toDataURL("image/png");
}

function downloadFile(file, fileName) {
    const link = document.createElement("a");
    link.download = fileName;
    link.href = file;
    link.click();
}

function saveTextureAsPNG(texture, fileName, width = textureDefaultWidth, height = textureDefaultHeight) {
    const img = transformWebGLTextureToPNG(gl, texture, width, height);
    downloadFile(img, fileName);
}

function getWebGlTextureAsPNG(texture, width = textureDefaultWidth, height = textureDefaultHeight) {
    return transformWebGLTextureToPNG(gl, texture, width, height);
}