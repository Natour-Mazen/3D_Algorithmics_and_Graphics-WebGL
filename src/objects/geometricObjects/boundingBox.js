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

        const normalPink = [
            0.0, -1.0, 0.0, // 0
            0.0, -1.0, 0.0, // 1
            0.0, -1.0, 0.0, // 2
            0.0, -1.0, 0.0, // 3
            0.0, -1.0, 0.0, // 4
            0.0, -1.0, 0.0, // 5
            0.0, -1.0, 0.0, // 6
        ];

        const normalYellow = [
            1.0, 0.0, 0.0, // 0
            1.0, 0.0, 0.0, // 1
            1.0, 0.0, 0.0, // 2
            1.0, 0.0, 0.0, // 3
            1.0, 0.0, 0.0, // 4
            1.0, 0.0, 0.0, // 5
            1.0, 0.0, 0.0, // 6
        ];
        const normalBlue = [
            0.0, 1.0, 0.0, // 0
            0.0, 1.0, 0.0, // 1
            0.0, 1.0, 0.0, // 2
            0.0, 1.0, 0.0, // 3
            0.0, 1.0, 0.0, // 4
            0.0, 1.0, 0.0, // 5
            0.0, 1.0, 0.0, // 6
        ];
        const normalGreen = [
            -1.0, 0.0, 0.0, // 0
            -1.0, 0.0, 0.0, // 1
            -1.0, 0.0, 0.0, // 2
            -1.0, 0.0, 0.0, // 3
            -1.0, 0.0, 0.0, // 4
            -1.0, 0.0, 0.0, // 5
            -1.0, 0.0, 0.0, // 6
        ];
        const normalRed = [
            0.0, 0.0, 1.0, // 0
            0.0, 0.0, 1.0, // 1
            0.0, 0.0, 1.0, // 2
            0.0, 0.0, 1.0, // 3
            0.0, 0.0, 1.0, // 4
            0.0, 0.0, 1.0, // 5
            0.0, 0.0, 1.0, // 6
        ];


        // Vertex
        this.vBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        this.vBuffer.itemSize = 3;
        this.vBuffer.numItems = 8;

        // TRIANGLES BUFFERS
        this.tPinkBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.tPinkBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(trianglesPink), gl.STATIC_DRAW);
        this.tPinkBuffer.itemSize = 1;
        this.tPinkBuffer.numItems = 6;

        this.tYellowBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.tYellowBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(trianglesYellow), gl.STATIC_DRAW);
        this.tYellowBuffer.itemSize = 1;
        this.tYellowBuffer.numItems = 6;

        this.tBlueBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.tBlueBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(trianglesBlue), gl.STATIC_DRAW);
        this.tBlueBuffer.itemSize = 1;
        this.tBlueBuffer.numItems = 6;

        this.tGreenBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.tGreenBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(trianglesGreen), gl.STATIC_DRAW);
        this.tGreenBuffer.itemSize = 1;
        this.tGreenBuffer.numItems = 6;

        this.tRedBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.tRedBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(trianglesRed), gl.STATIC_DRAW);
        this.tRedBuffer.itemSize = 1;
        this.tRedBuffer.numItems = 6;

        // NORMALS
        this.nPinkBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.nPinkBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalPink), gl.STATIC_DRAW);
        this.nPinkBuffer.itemSize = 3;
        this.nPinkBuffer.numItems = 6;

        this.nYellowBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.nYellowBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalYellow), gl.STATIC_DRAW);
        this.nYellowBuffer.itemSize = 3;
        this.nYellowBuffer.numItems = 6;

        this.nBlueBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.nBlueBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalBlue), gl.STATIC_DRAW);
        this.nBlueBuffer.itemSize = 3;
        this.nBlueBuffer.numItems = 6;

        this.nGreenBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.nGreenBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalGreen), gl.STATIC_DRAW);
        this.nGreenBuffer.itemSize = 3;
        this.nGreenBuffer.numItems = 6;

        this.nRedBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.nRedBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalRed), gl.STATIC_DRAW);
        this.nRedBuffer.itemSize = 3;
        this.nRedBuffer.numItems = 6;
    }

    // --------------------------------------------
    setShadersParams() {
        this.setShaderAttributes([
            { attribName: "aVertexPosition", buffer: this.vBuffer, itemSize: this.vBuffer.itemSize },
            { attribName: "aVertexNormal", buffer: this.nRedBuffer, itemSize: this.nRedBuffer.itemSize },
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
        this.setUniformColor(Color.PINK);
        this.drawTriangles(this.tPinkBuffer, this.nPinkBuffer);
        this.setUniformColor(Color.YELLOW);
        this.drawTriangles(this.tYellowBuffer, this.nYellowBuffer);
        this.setUniformColor(Color.BLUE);
        this.drawTriangles(this.tBlueBuffer, this.nBlueBuffer);
        this.setUniformColor(Color.GREEN);
        this.drawTriangles(this.tGreenBuffer, this.nGreenBuffer);
        this.setUniformColor(Color.RED);
        this.drawTriangles(this.tRedBuffer, this.nRedBuffer);
    }

    drawTriangles(tBuffer, nBuffer)
    {
        this.setShaderAttributes([{ attribName: "aVertexNormal", buffer: nBuffer, itemSize: nBuffer.itemSize }]);

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

}