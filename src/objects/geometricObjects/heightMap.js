class heightMap extends objectToDraw {
    constructor() {
        super('glsl/heightMap', -1, null);
        this.texturePathT = "res/heightMaps/texture4.png";
        this.texturePathMap = "res/heightMaps/texture4.png";
        this.color = Color.LIGHT_BLUE;
        this.initAll();
    }

    setShadersParams() {
        const buffers = [
            { buffer: this.vBuffer, attribName: "aVertexPosition", itemSize: 3 },
            { buffer: this.nBuffer, attribName: "aVertexNormal", itemSize: this.nBuffer.itemSize },
            { buffer: this.tBuffer, attribName: "aTexCoord", itemSize: this.tBuffer.itemSize }
        ];
        this.setCommonShaderParams(buffers);

        this.shader.uSampler = gl.getUniformLocation(this.shader, "uSampler");
        this.shader.rMatrixUniform = gl.getUniformLocation(this.shader, "uRMatrix");
        this.shader.mvMatrixUniform = gl.getUniformLocation(this.shader, "uMVMatrix");
        this.shader.pMatrixUniform = gl.getUniformLocation(this.shader, "uPMatrix");
    }

    setUniforms() {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.uniform1i(this.shader.uSampler, 0);

        mat4.identity(mvMatrix);
        mat4.translate(mvMatrix, distCENTER);
        mat4.multiply(mvMatrix, rotMatrix);
        mat4.scale(mvMatrix, [this.scale, this.scale, this.scale]);

        gl.uniformMatrix4fv(this.shader.rMatrixUniform, false, rotMatrix);
        gl.uniformMatrix4fv(this.shader.mvMatrixUniform, false, mvMatrix);
        gl.uniformMatrix4fv(this.shader.pMatrixUniform, false, pMatrix);
    }

    drawAux() {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.drawElements(gl.TRIANGLES, this.indexBuffer.numItems, gl.UNSIGNED_INT, 0);
    }

    initAll() {
        this.loadImageIntoBuff().then(({ pointHeight, width, height }) => {
            const vertices = this.createVertices(pointHeight, width, height);
            const triangles = this.createTriangles(width, height);
            const normals = this.initNormals(triangles, vertices);
            const textureCoord = this.createTextureCoords(width, height);

            this.texture = loadTexture(gl, heightMapColorTexturePath);

            this.vBuffer = this.createBuffer(gl.ARRAY_BUFFER, vertices, 3, width * height);
            this.indexBuffer = this.createBuffer(gl.ELEMENT_ARRAY_BUFFER, triangles, 3, triangles.length);
            this.nBuffer = this.createBuffer(gl.ARRAY_BUFFER, normals, 3, width * height);
            this.tBuffer = this.createBuffer(gl.ARRAY_BUFFER, new Float32Array(textureCoord), 2, width * height);

            loadShaders(this);
        });
    }

    createVertices(pointHeight, width, height) {
        const vertices = new Float32Array(width * height * 3).fill(0.);
        const fSize = 1.0;
        const widthInBetween = (fSize * 2) / parseFloat(width);
        const heightInBetween = (fSize * 2) / parseFloat(height);
        const fY = fSize / 255.0;

        for (let h = 0; h < height; ++h) {
            for (let w = 0; w < width; ++w) {
                const x = (parseFloat(w) * widthInBetween) - fSize;
                const y = parseFloat(pointHeight[w + h * width]) * fY;
                const z = (parseFloat(h) * heightInBetween) - fSize;
                const index = (w * 3) + h * (width * 3);
                vertices[index] = x;
                vertices[index + 1] = z;
                vertices[index + 2] = y;
            }
        }
        return vertices;
    }

    createTriangles(width, height) {
        const triangles = new Uint32Array((width - 1) * (height - 1) * 3 * 2 + 6).fill(0);
        let xIndex = 1;
        let yIndex = 0;
        let reverse = false;

        const updateXIndex = () => {
            ++xIndex;
            if (xIndex >= width) {
                ++yIndex;
                xIndex = 0;
            }
        };

        for (let h = 0; h < height - 1; ++h) {
            if (!reverse) {
                for (let w = 0; w < width - 1; ++w) {
                    const tIndex = (xIndex * 6) + yIndex * (width * 6);
                    const vIndex = (w) + h * (width);
                    const vIndexBottom = w + (h + 1) * width;

                    triangles[tIndex] = vIndex;
                    triangles[tIndex + 1] = vIndexBottom + 1;
                    triangles[tIndex + 2] = vIndexBottom;
                    triangles[tIndex + 3] = vIndex;
                    triangles[tIndex + 4] = vIndex + 1;
                    triangles[tIndex + 5] = vIndexBottom + 1;
                    updateXIndex();
                }
            } else {
                for (let w = width - 2; w >= 0; --w) {
                    const tIndex = (xIndex * 6) + yIndex * (width * 6);
                    const vIndex = (w) + h * (width);
                    const vIndexBottom = w + (h + 1) * width;

                    triangles[tIndex] = vIndexBottom + 1;
                    triangles[tIndex + 1] = vIndexBottom;
                    triangles[tIndex + 2] = vIndex;
                    triangles[tIndex + 3] = vIndex + 1;
                    triangles[tIndex + 4] = vIndexBottom + 1;
                    triangles[tIndex + 5] = vIndex;
                    updateXIndex();
                }
            }
            reverse = !reverse;
        }
        return triangles;
    }

    createTextureCoords(width, height) {
        const fSize = 1.0;
        const texWidthInBetween = fSize / parseFloat(width - 1);
        const texHeightInBetween = fSize / parseFloat(height - 1);
        const textureCoord = [];

        for (let h = 0; h < height; ++h) {
            for (let w = 0; w < width; ++w) {
                const x = parseFloat(w * texWidthInBetween);
                const y = parseFloat(h * texHeightInBetween);
                textureCoord.push(x, y);
            }
        }
        return textureCoord;
    }

    createBuffer(type, data, itemSize, numItems) {
        const buffer = gl.createBuffer();
        gl.bindBuffer(type, buffer);
        gl.bufferData(type, data, gl.STATIC_DRAW);
        buffer.itemSize = itemSize;
        buffer.numItems = numItems;
        gl.bindBuffer(type, null);
        return buffer;
    }

    loadImageIntoBuff() {
        return new Promise((resolve, reject) => {
            let texture = gl.createTexture();
            texture.image = new Image();

            texture.image.onload = function() {
                try {
                    gl.bindTexture(gl.TEXTURE_2D, texture);
                    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

                    let framebuffer = gl.createFramebuffer();
                    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
                    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

                    let data = new Uint8Array(this.width * this.height * 4);
                    gl.readPixels(0, 0, this.width, this.height, gl.RGBA, gl.UNSIGNED_BYTE, data);

                    gl.deleteFramebuffer(framebuffer);

                    const divider = 1;
                    const width = parseInt(this.width / divider);
                    const height = parseInt(this.height / divider);

                    let pointHeight = new Uint8Array(width * height);
                    for (let i = 0; i < width * height; ++i) {
                        let res = data[i * 4 * divider];
                        pointHeight[i] = res;
                    }
                    resolve({pointHeight, width, height});
                } catch (error) {
                    reject(error);
                }
            };

            texture.image.onerror = function(error) {
                reject(error);
            };

            texture.image.src = heightMap_texturePathMap;
        });
    }

    initNormals(triangles, vertexPos) {
        let vertexPosNormals = new Float32Array(vertexPos.length);

        for (let i = 0; i < triangles.length; i += 3) {
            let index1 = triangles[i] * 3;
            let index2 = triangles[i + 1] * 3;
            let index3 = triangles[i + 2] * 3;

            let x1 = vertexPos[index1];
            let y1 = vertexPos[index1 + 1];
            let z1 = vertexPos[index1 + 2];
            let x2 = vertexPos[index2];
            let y2 = vertexPos[index2 + 1];
            let z2 = vertexPos[index2 + 2];
            let x3 = vertexPos[index3];
            let y3 = vertexPos[index3 + 1];
            let z3 = vertexPos[index3 + 2];

            let normX = (y2 - y1) * (z3 - z1) - (z2 - z1) * (y3 - y1);
            let normY = (z2 - z1) * (x3 - x1) - (x2 - x1) * (z3 - z1);
            let normZ = (x2 - x1) * (y3 - y1) - (y2 - y1) * (x3 - x1);

            vertexPosNormals[index1] += normX;
            vertexPosNormals[index1 + 1] += normY;
            vertexPosNormals[index1 + 2] += normZ;
            vertexPosNormals[index2] += normX;
            vertexPosNormals[index2 + 1] += normY;
            vertexPosNormals[index2 + 2] += normZ;
            vertexPosNormals[index3] += normX;
            vertexPosNormals[index3 + 1] += normY;
            vertexPosNormals[index3 + 2] += normZ;
        }

        for (let i = 0; i < vertexPosNormals.length; i += 3) {
            let x = vertexPosNormals[i];
            let y = vertexPosNormals[i + 1];
            let z = vertexPosNormals[i + 2];

            let length = Math.sqrt(x * x + y * y + z * z);
            if (length !== 0) {
                vertexPosNormals[i] /= length;
                vertexPosNormals[i + 1] /= length;
                vertexPosNormals[i + 2] /= length;
            }
        }

        return vertexPosNormals;
    }
}