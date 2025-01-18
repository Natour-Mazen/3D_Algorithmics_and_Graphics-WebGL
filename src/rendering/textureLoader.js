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
    // Vérification que le tableau de données est un multiple de 5 (r, g, b, a, pos)
    if (data.length % 5 !== 0) {
        throw new Error("Le tableau 'data' doit contenir un multiple de 5 éléments (r, g, b, a, pos).\nExemple : [r, g, b, a, pos, r, g, b, a, pos,...]");
    }

    // Restructuration du tableau pour obtenir un tableau d'objets {r, g, b, a, pos}
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

    // Trier les couleurs par position (pos) croissante
    colors.sort((a, b) => a.pos - b.pos);

    // Taille de la texture
    const width = 1000; // Texture 1D (fixée à 1000 pixels)
    const height = 1; // Texture 1D

    // Création d'un tableau pour représenter la texture
    const textureData = new Uint8Array(width * 4); // 4 canaux (r, g, b, a) par pixel

    // Fonction pour obtenir la couleur interpolée pour une position donnée
    function getInterpolatedColorAtPosition(pos) {
        let leftIndex = -1, rightIndex = -1;

        // Chercher les deux couleurs voisines
        for (let i = 0; i < colors.length; i++) {
            const keyPos = colors[i].pos;
            if (keyPos <= pos) {
                leftIndex = i;
            } else {
                rightIndex = i;
                break;
            }
        }

        // Si aucune couleur à gauche, on prend la plus proche à droite
        if (leftIndex === -1) {
            leftIndex = rightIndex;
        }

        // Si aucune couleur à droite, on prend la plus proche à gauche
        if (rightIndex === -1) {
            rightIndex = leftIndex;
        }

        const leftColor = colors[leftIndex];
        const rightColor = colors[rightIndex];

        // Si leftIndex == rightIndex, il n'y a qu'une seule couleur, donc aucune interpolation
        if (leftIndex === rightIndex) {
            return { color: [leftColor.r, leftColor.g, leftColor.b, leftColor.a] };
        }

        const leftPos = leftColor.pos;
        const rightPos = rightColor.pos;

        // Calcul du facteur d'interpolation (t)
        const t = (pos - leftPos) / (rightPos - leftPos);

        // Interpolation des couleurs
        const r = Math.round(leftColor.r * (1 - t) + rightColor.r * t);
        const g = Math.round(leftColor.g * (1 - t) + rightColor.g * t);
        const b = Math.round(leftColor.b * (1 - t) + rightColor.b * t);
        const a = Math.round(leftColor.a * (1 - t) + rightColor.a * t);

        return { color: [r, g, b, a] };
    }

    // Parcours de chaque pixel de la texture
    for (let x = 0; x < width; x++) {
        // Position normalisée du pixel (entre 0 et 1)
        const pos = x / (width - 1);

        // Obtenir la couleur interpolée à cette position
        const { color } = getInterpolatedColorAtPosition(pos);

        // Remplissage du tableau de texture
        const pixelIndex = x * 4;
        textureData[pixelIndex] = color[0];
        textureData[pixelIndex + 1] = color[1];
        textureData[pixelIndex + 2] = color[2];
        textureData[pixelIndex + 3] = color[3];
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

    // Enregistrer la texture en PNG (optionnel)
    // saveTextureAsPNG(gl, texture, width, height, "gradient.png");

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