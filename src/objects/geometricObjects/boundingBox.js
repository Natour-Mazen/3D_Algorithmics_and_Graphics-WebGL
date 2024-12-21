class BoundingBox extends ObjectToDraw {
    // --------------------------------------------
    constructor(shaderName, loaded, shader, isCubic = false) {
        super(shaderName, loaded, shader);
        if (new.target === BoundingBox) {
            throw new TypeError("Cannot construct BoundingBox instances directly");
        }
        this.boundingBoxSize = 1;
        this.borderType = 'None';
        this.isWireFrameBorderType = 0; // 0: false, 1: true
        this.isOpaqueBorderType = 0; // 0: false, 1: true
        this.isCubic = isCubic;
    }

    // --------------------------------------------
    async initAll() {
        const size = this.boundingBoxSize ? this.boundingBoxSize : 1;
        let sizeMultiplier = 1;
        if(this.isCubic){
            sizeMultiplier = 2;
        }
        const vertices = [
            // 4 sommets sur le plan z=0
            -size, -size, 0.0, // 0
            size, -size, 0.0, // 1
            size, size, 0.0, // 2
            -size, size, 0.0, // 3
            // 4 sommets sur le plan z=1
            -size, -size, size * sizeMultiplier, // 4
            size, -size, size * sizeMultiplier, // 5
            size, size, size * sizeMultiplier, // 6
            -size, size, size * sizeMultiplier // 7
        ];

        const trianglesPink = [
            4, 0, 1,
            1, 5, 4
        ];

        const trianglesYellow = [
            5, 1, 2,
            2, 6, 5
        ];

        const trianglesBlue = [
            6, 2, 3,
            3, 7, 6
        ];

        const trianglesGreen = [
            7, 3, 0,
            0, 4, 7
        ];

        const trianglesRed = [
            7, 4, 5,
            5, 6, 7
        ];

        // Vertex
        this.vBuffer = this.createBuffer(gl, gl.ARRAY_BUFFER, vertices, 3, 8);
        this.tPinkBuffer = this.createBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, trianglesPink, 1, 6);
        this.tYellowBuffer = this.createBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, trianglesYellow, 1, 6);
        this.tBlueBuffer = this.createBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, trianglesBlue, 1, 6);
        this.tGreenBuffer = this.createBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, trianglesGreen, 1, 6);
        this.tRedBuffer = this.createBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, trianglesRed, 1, 6);
    }

    // --------------------------------------------
    setShadersParams() {
        this.setShaderAttributes([
            { attribName: "aVertexPosition", buffer: this.vBuffer, itemSize: this.vBuffer.itemSize },
        ]);

        this.shader.uBBSize = gl.getUniformLocation(this.shader, "uBBSize");

        this.shader.uIsWireFrame = gl.getUniformLocation(this.shader, "uIsWireFrame");
        this.shader.uIsOpaque = gl.getUniformLocation(this.shader, "uIsOpaque");
        this.shader.uAspectRatio = gl.getUniformLocation(this.shader, "uAspectRatio");
        this.shader.uFOV = gl.getUniformLocation(this.shader, "uFOV");

    }

    setUniforms() {
        this.#switchStringBorderType();

        // We send the Bounding Box Size factor.
        gl.uniform1f(this.shader.uBBSize, this.boundingBoxSize);
        this.checkGlError();

        gl.uniform1i(this.shader.uIsWireFrame, this.isWireFrameBorderType);
        this.checkGlError();

        gl.uniform1i(this.shader.uIsOpaque, this.isOpaqueBorderType);
        this.checkGlError();

        // We send the image aspect ratio.
        gl.uniform1f(this.shader.uAspectRatio, main_aspectRatio);
        this.checkGlError();

        // We send the FOV.
        gl.uniform1f(this.shader.uFOV, main_FOV);
        this.checkGlError();
    }

    // --------------------------------------------
    drawAux() {
        this.drawTriangles(this.tPinkBuffer);
        this.drawTriangles(this.tYellowBuffer);
        this.drawTriangles(this.tBlueBuffer);
        this.drawTriangles(this.tGreenBuffer);
        this.drawTriangles(this.tRedBuffer);
    }

    drawTriangles(tBuffer)
    {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, tBuffer);

        gl.drawElements(gl.TRIANGLES, tBuffer.numItems, gl.UNSIGNED_INT, 0);
    }

    // --------------------------------------------

    setBoundingBoxSize(value) {
        this.boundingBoxSize = value;
    }

    setBoundingBoxBorderType(value) {
        this.borderType = value;
    }

    #switchStringBorderType() {
        switch (this.borderType) {
            case BoundingBoxBorderTypes.NONE:
                this.isWireFrameBorderType = 0;
                this.isOpaqueBorderType = 0;
                break;
            case BoundingBoxBorderTypes.WIREFRAME:
                this.isWireFrameBorderType = 1;
                this.isOpaqueBorderType = 0;
                break;
            case BoundingBoxBorderTypes.OPAQUE:
                this.isWireFrameBorderType = 0;
                this.isOpaqueBorderType = 1;
                break;
            default:
                this.isWireFrameBorderType = 0;
                this.isOpaqueBorderType = 0;
        }
    }

    createBuffer(gl, type, data, itemSize, numItems) {
        const buffer = gl.createBuffer();
        const arrayType = type === gl.ARRAY_BUFFER ? Float32Array : Uint32Array;
        gl.bindBuffer(type, buffer);
        gl.bufferData(type, new arrayType(data), gl.STATIC_DRAW);
        buffer.itemSize = itemSize;
        buffer.numItems = numItems;
        return buffer;
    }

}