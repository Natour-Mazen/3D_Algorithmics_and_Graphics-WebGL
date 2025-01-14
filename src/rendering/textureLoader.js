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

function createHorizontalGradientTexture(gl, data) {
    // Vérification que le tableau de données est un multiple de 4
    if (data.length % 4 !== 0) {
        throw new Error("Le tableau 'data' doit contenir un multiple de 4 éléments (r, g, b, a par pixel).");
    }

    // Conversion des valeurs entre 0 et 1 en entiers entre 0 et 255
    const normalizedData = new Uint8Array(data.map(value => Math.round(value * 255)));

    // Nombre de couleurs
    const numColors = normalizedData.length / 4;

    // Taille de la texture (une ligne correspond à toutes les couleurs)
    const width = numColors;
    const height = numColors; // Pour une texture carrée

    // Création d'un tableau pour représenter la texture
    const textureData = new Uint8Array(width * height * 4);

    // Remplissage de chaque ligne avec toutes les couleurs dans l'ordre
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const colorIndex = (x % numColors) * 4; // Index cyclique des couleurs
            const pixelIndex = (y * width + x) * 4; // Position du pixel dans la texture
            textureData.set(
                normalizedData.slice(colorIndex, colorIndex + 4), // Couleur à copier
                pixelIndex // Position dans la texture
            );
        }
    }

    // Création de la texture
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Chargement des données dans la texture
    gl.texImage2D(
        gl.TEXTURE_2D,    // Type de texture
        0,                // Niveau de mipmap
        gl.RGBA,          // Format interne
        width,            // Largeur
        height,           // Hauteur
        0,                // Bordure (doit être 0)
        gl.RGBA,          // Format des données
        gl.UNSIGNED_BYTE, // Type de données
        textureData       // Données de la texture
    );

    // Paramètres de filtrage
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);

    // Save the texture as PNG for debugging
    //saveTextureAsPNG(gl, texture, width, height, "horizontal_gradient_texture.png");
    return texture;
}
function saveTextureAsPNG(gl, texture, width, height, fileName = "texture.png") {
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

    // Unbind the framebuffer
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.deleteFramebuffer(framebuffer);

    // Create a canvas to draw the pixels
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");

    // Draw the pixels on the canvas
    const imageData = context.createImageData(width, height);
    imageData.data.set(pixels);
    context.putImageData(imageData, 0, 0);

    // Save the canvas as PNG
    const link = document.createElement("a");
    link.download = fileName;
    link.href = canvas.toDataURL("image/png");
    link.click();
}

