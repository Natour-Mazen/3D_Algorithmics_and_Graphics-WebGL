class plane extends objectToDraw {
    // --------------------------------------------
    constructor() {
        super('glsl/plane', -1, null);
        this.initAll();
    }

    // --------------------------------------------
    initAll() {
        const size = 10.5;
        const height = 0.018;
        const vertices = [
            -size, -size, height,
            size, -size, height,
            size, size, height,
            -size, size, height
        ];
        // const vertices = [
        //
        //     -size, height, -size,
        //     size, height, -size,
        //     size, height, size,
        //     -size, height, size,
        // ];

        const texcoords = [
            0.0, 0.0,
            0.0, 1.0,
            1.0, 1.0,
            1.0, 0.0
        ];
        const normals= [
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
        ];
        // Vertex.
        const pos1 = vec3.create([-size, -size, height]);
        const pos2 = vec3.create([size, -size, height]);
        const pos3 = vec3.create([size, size, height]);
        const pos4 = vec3.create([-size, size, height]);

        // Textures Coords.
        let uv1 = vec2.create([0.0, 0.0]);
        let uv2 = vec2.create([0.0, 1.0]);
        let uv3 = vec2.create([1.0, 1.0]);
        let uv4 = vec2.create([1.0, 0.0]);

        // For the first triangle.
        let edge1 = vec3.subtract(pos1, pos2, [0., 0., 0.]);
        let edge2 = vec3.subtract(pos3, pos1, [0., 0., 0.]);
        let deltaUV1 = vec2.subtract(uv2, uv1, [0., 0., 0.]);
        let deltaUV2 = vec2.subtract(uv3, uv1, [0., 0., 0.]);

        let f = 1.0 / (deltaUV1[0] * deltaUV2[1] - deltaUV2[0] * deltaUV1[1]);

        let tangent1 = [f * (deltaUV2[1] * edge1[0] - deltaUV1[1] * edge2[0]),
                                f * (deltaUV2[1] * edge1[1] - deltaUV1[1] * edge2[1]),
                                f * (deltaUV2[1] * edge1[2] - deltaUV1[1] * edge2[2])];


        // Vertex
        this.vBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        this.vBuffer.itemSize = 3;
        this.vBuffer.numItems = 4;

        // Texture coords
        this.tBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.tBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);
        this.tBuffer.itemSize = 2;
        this.tBuffer.numItems = 4;

        // Normals
        this.nBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.nBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
        this.nBuffer.itemSize = 3;
        this.nBuffer.numItems = 4;

        loadShaders(this);
    }


    // --------------------------------------------
    setShadersParams() {
        this.setCommonShaderParams([
            { attribName: "aVertexPosition", buffer: this.vBuffer, itemSize: this.vBuffer.itemSize },
            { attribName: "aVertexNormal", buffer: this.nBuffer, itemSize: this.nBuffer.itemSize },
            { attribName: "aTexCoords", buffer: this.tBuffer, itemSize: this.tBuffer.itemSize }
        ]);

        this.shader.uBumpSampler = gl.getUniformLocation(this.shader, "uBumpSampler");
        this.shader.uSampler = gl.getUniformLocation(this.shader, "uSampler");
    }

    setUniforms() {
        // Bind and set the bump map texture
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, bumpMap);
        gl.uniform1i(this.shader.uBumpSampler, 0); // Use texture unit 0 for bump map
        this.checkGlError();

        // Bind and set the main texture
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, texture_ForBump);
        gl.uniform1i(this.shader.uSampler, 1); // Use texture unit 1 for main texture
        this.checkGlError();
    }

    // --------------------------------------------
    drawAux() {
        gl.drawArrays(gl.TRIANGLE_FAN, 0, this.vBuffer.numItems);
        gl.drawArrays(gl.LINE_LOOP, 0, this.vBuffer.numItems);
    }
}