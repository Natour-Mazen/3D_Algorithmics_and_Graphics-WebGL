class plane extends objectToDraw {
    // --------------------------------------------
    constructor() {
        super('glsl/plane', -1, null);
        this.initAll();
    }

    // --------------------------------------------
    initAll() {
        const size = 10.2;
        const height = 0.029;
        const vertices = [
            -size, -size, height,
            size, -size, height,
            size, size, height,
            -size, size, height
        ];

        const texcoords = [
            0.0, 0.0,
            0.0, 1.0,
            1.0, 1.0,
            1.0, 0.0
        ];

        this.vBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        this.vBuffer.itemSize = 3;
        this.vBuffer.numItems = 4;

        this.tBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.tBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);
        this.tBuffer.itemSize = 2;
        this.tBuffer.numItems = 4;

        loadShaders(this);
    }


    // --------------------------------------------
    setShadersParams() {
        this.setCommonShaderParams([
            { attribName: "aVertexPosition", buffer: this.vBuffer, itemSize: this.vBuffer.itemSize },
            { attribName: "aTexCoords", buffer: this.tBuffer, itemSize: this.tBuffer.itemSize }
        ]);
        mat4.identity(mvMatrix);
        mat4.translate(mvMatrix, distCENTER);
        mat4.multiply(mvMatrix, rotMatrix);

        gl.uniformMatrix4fv(this.shader.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(this.shader.mvMatrixUniform, false, mvMatrix);
        this.shader.uBumpSampler = gl.getUniformLocation(this.shader, "uBumpSampler");
        this.shader.uSampler = gl.getUniformLocation(this.shader, "uSampler");
        this.shader.uLightDirection = gl.getUniformLocation(this.shader, "uLightDirection");
        this.shader.uColor = gl.getUniformLocation(this.shader, "uColor");
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
        const lightDirection = [1.0, 1.0, 1.0];
        gl.uniform3fv(this.shader.uLightDirection, lightDirection);

        // Set the color uniform
        gl.uniform3fv(this.shader.uColor, this.color);
    }

    // --------------------------------------------
    drawAux() {
        gl.drawArrays(gl.TRIANGLE_FAN, 0, this.vBuffer.numItems);
        gl.drawArrays(gl.LINE_LOOP, 0, this.vBuffer.numItems);
    }


}