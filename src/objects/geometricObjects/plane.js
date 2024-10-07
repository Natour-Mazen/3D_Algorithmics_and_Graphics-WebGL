class Plane extends ObjectToDraw {
    // --------------------------------------------
    constructor(shaderName = 'glsl/plane') {
        super(shaderName, -1, null);
    }

    // --------------------------------------------
    async initAll() {
        const size = 10.5;
        const height = 0.018;
        const vertices = [
            -size, -size, height,   // 0
            size, -size, height,    // 1
            size, size, height,     // 2
            -size, -size, height,   // 0
            size, size, height,     // 2
            -size, size, height     // 3
        ];

        const texcoords = [
            0.0, 0.0, // 0
            0.0, 1.0, // 1
            1.0, 1.0, // 2
            0.0, 0.0, // 0
            1.0, 1.0, // 2
            1.0, 0.0, // 3
        ];
        const normals= [
            0.0, 0.0, 1.0, // 0
            0.0, 0.0, 1.0, // 1
            0.0, 0.0, 1.0, // 2
            0.0, 0.0, 1.0, // 0
            0.0, 0.0, 1.0, // 2
            0.0, 0.0, 1.0, // 3
        ];


        // Vertex
        this.vBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        this.vBuffer.itemSize = 3;
        this.vBuffer.numItems = 6;

        // Texture coords
        this.tBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.tBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);
        this.tBuffer.itemSize = 2;
        this.tBuffer.numItems = 6;

        // Normals
        this.nBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.nBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
        this.nBuffer.itemSize = 3;
        this.nBuffer.numItems = 6;

    }

    // --------------------------------------------
    setShadersParams() {
        this.setShaderAttributes([
            { attribName: "aVertexPosition", buffer: this.vBuffer, itemSize: this.vBuffer.itemSize },
            { attribName: "aVertexNormal", buffer: this.nBuffer, itemSize: this.nBuffer.itemSize },
            { attribName: "aTexCoords", buffer: this.tBuffer, itemSize: this.tBuffer.itemSize }
        ]);
    }

    setUniforms() {
      // we don't need to set any uniform for this object
    }

    // --------------------------------------------
    drawAux() {
        if(isTherePlane){
            gl.drawArrays(gl.TRIANGLES, 0, this.vBuffer.numItems);
            gl.drawArrays(gl.LINE_LOOP, 0, this.vBuffer.numItems);
        }
    }
}