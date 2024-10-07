class boundingBox extends objectToDraw {
    // --------------------------------------------
    constructor(shaderName = 'glsl/box') {
        super(shaderName, -1, null);
        this.setColor(Color.WHITE);
    }

    // --------------------------------------------
    async initAll() {
        const size = 10.5;
        const height = 0.018;
        const vertices = [
            // 4 sommets sur le plan z=0
            -size, -size, 0.0, // 0
            size, -size, 0.0, // 1
            size, size, 0.0, // 2
            -size, size, 0.0, // 3
            // 4 sommets sur le plan z=1
            -size, -size, size, // 4
            size, -size, size, // 5
            size, size, size, // 6
            -size, size, size // 7
        ];

        const trianglesPink = [
            1, 0, 4,
            4, 5, 1
        ];

        const trianglesYellow = [
            2, 1, 5,
            5, 6, 2
        ];

        const trianglesBlue = [
            3, 2, 6,
            6, 7, 3
        ];

        const trianglesGreen = [
            0, 3, 7,
            7, 4, 0
        ];

        const trianglesRed = [
            5, 4, 7,
            7, 6, 5
        ];

        const normalPink = [
            0.0, 1.0, 0.0, // 0
            0.0, 1.0, 0.0, // 1
            0.0, 1.0, 0.0, // 2
            0.0, 1.0, 0.0, // 3
            0.0, 1.0, 0.0, // 4
            0.0, 1.0, 0.0, // 5
            0.0, 1.0, 0.0, // 6
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
            0.0, 0.0, -1.0, // 0
            0.0, 0.0, -1.0, // 1
            0.0, 0.0, -1.0, // 2
            0.0, 0.0, -1.0, // 3
            0.0, 0.0, -1.0, // 4
            0.0, 0.0, -1.0, // 5
            0.0, 0.0, -1.0, // 6
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
    }

    setUniforms() {
        // we don't need to set any uniform for this object
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

    drawTriangles(tBuffer, nBuffer){
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, tBuffer);

        if(isWireFrameActiveHeightMap){
            gl.drawElements(gl.LINE_STRIP, tBuffer.numItems, gl.UNSIGNED_INT, 0);
        }else{
            gl.drawElements(gl.TRIANGLES, tBuffer.numItems, gl.UNSIGNED_INT, 0);
        }

        this.setShaderAttributes([
            { attribName: "aVertexNormal", buffer: nBuffer, itemSize: nBuffer.itemSize },
        ]);
    }
}