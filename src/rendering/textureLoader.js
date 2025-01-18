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

function createHorizontalGradientTexture(gl, data, textureSize = 1000) {
    // Vérification que le tableau de données est un multiple de 5 (r, g, b, a, pos)
    if (data.length % 5 !== 0) {
        throw new Error("Le tableau 'data' doit contenir un multiple de 5 éléments (r, g, b, a, pos).\nExemple : [r, g, b, a, pos, r, g, b, a, pos,...]");
    }

    function normalizeDataForGradient(data) {
        return data.map((value, index) => {
            // Multiplier uniquement les valeurs de couleur (r, g, b, a)
            if (index % 5 !== 4) {
                return value * 255; // Convertir en 0-255
            }
            return value; // Laisser la position telle quelle (entre 0 et 1)
        });
    }

    // Normalisation des données
    data = normalizeDataForGradient(data);

    // Taille de la texture
    const width = data.length / 5; // Texture 1D
    const height = 1; // Texture 1D

    // Création d'un tableau pour représenter la texture
    const textureData = new Uint8Array(width * 4); // 4 canaux (r, g, b, a) par pixel

    // Parcours de chaque pixel de la texture
    for (let x = 0; x < width; x++) {
        // Position normalisée du pixel (entre 0 et 1)
        const pos = x / (width - 1);

        // Trouver les deux couleurs les plus proches (gauche et droite)
        let leftIndex = 0;
        let rightIndex = 0;

        for (let i = 0; i < data.length; i += 5) {
            const keyPos = data[i + 4]; // Position de la couleur-clé
            if (keyPos <= pos) {
                leftIndex = i;
            } else {
                rightIndex = i;
                break;
            }
        }

        // Positions des couleurs gauche et droite
        const leftPos = data[leftIndex + 4];
        const rightPos = data[rightIndex + 4];

        // Couleurs gauche et droite
        const leftColor = data.slice(leftIndex, leftIndex + 4);
        const rightColor = data.slice(rightIndex, rightIndex + 4);

        // Calcul du facteur d'interpolation (t)
        const t = (pos - leftPos) / (rightPos - leftPos);

        // Interpolation des couleurs
        const r = Math.round(leftColor[0] * (1 - t) + rightColor[0] * t);
        const g = Math.round(leftColor[1] * (1 - t) + rightColor[1] * t);
        const b = Math.round(leftColor[2] * (1 - t) + rightColor[2] * t);
        const a = Math.round(leftColor[3] * (1 - t) + rightColor[3] * t);

        // Remplissage du tableau de texture
        const pixelIndex = x * 4;
        textureData[pixelIndex] = r;
        textureData[pixelIndex + 1] = g;
        textureData[pixelIndex + 2] = b;
        textureData[pixelIndex + 3] = a;
    }

    // Création de la texture WebGL
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
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    //saveTextureAsPNG(gl, texture, width, height, "gradient.png");

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

