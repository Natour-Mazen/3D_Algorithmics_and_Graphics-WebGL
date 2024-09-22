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
        this.shader.uLightDirection = gl.getUniformLocation(this.shader, "uLightDirection");
        this.shader.uSampler = gl.getUniformLocation(this.shader, "uSampler");
        this.shader.uLightColor = gl.getUniformLocation(this.shader, "uLightColor");
        this.shader.uAmbientColor = gl.getUniformLocation(this.shader, "uAmbientColor");
        this.shader.uShininess = gl.getUniformLocation(this.shader, "uShininess");
        this.shader.uViewPosition = gl.getUniformLocation(this.shader, "uViewPosition");
    }

    setUniforms() {
        // Bind and set the bump map texture
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, bumpMap);
        gl.uniform1i(this.shader.uBumpSampler, 0); // Use texture unit 0 for bump map

        // Bind and set the main texture
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, texture_ForBump);
        gl.uniform1i(this.shader.uSampler, 1); // Use texture unit 1 for main texture

        // Set the light direction
        const lightDirection = [10.0, 10.0, 10.0];
        gl.uniform3fv(this.shader.uLightDirection, lightDirection);

        // Set the light color
        const lightColor = Color.CYAN; // white
        gl.uniform3fv(this.shader.uLightColor, lightColor);

        // Set the ambient color
        const ambientColor = Color.BLUE;
        gl.uniform3fv(this.shader.uAmbientColor, ambientColor);

        // Set the shininess
        const shininess = 32.0;
        gl.uniform1f(this.shader.uShininess, shininess);

        // Set the view position (camera position)
        const viewPosition = [0.0, 10.0, 0.0];
        gl.uniform3fv(this.shader.uViewPosition, viewPosition);
    }

    // --------------------------------------------
    drawAux() {
        gl.drawArrays(gl.TRIANGLE_FAN, 0, this.vBuffer.numItems);
        gl.drawArrays(gl.LINE_LOOP, 0, this.vBuffer.numItems);
    }


}