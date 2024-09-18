class plane extends objectToDraw {
    // --------------------------------------------
    constructor() {
        super('glsl/plane', -1, null);
        this.initAll();
    }

    // --------------------------------------------
    initAll() {
        const size = 10.0;
        const vertices = [
            -size, -size, -0.12,
            size, -size, -0.12,
            size, size, -0.12,
            -size, size, -0.12
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

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, bumpTexture);
        gl.uniform1i(this.shader.uBumpSampler, 1);

        const lightDirection = [0.0, 0.0, -1.0];
        gl.uniform3fv(this.shader.uLightDirection, lightDirection);
        gl.uniform3fv(this.shader.colorUniform, this.color);
    }

    // --------------------------------------------
    drawAux() {
        gl.drawArrays(gl.TRIANGLE_FAN, 0, this.vBuffer.numItems);
        gl.drawArrays(gl.LINE_LOOP, 0, this.vBuffer.numItems);
    }


}