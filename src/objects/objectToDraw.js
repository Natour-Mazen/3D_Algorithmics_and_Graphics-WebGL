class objectToDraw {

    constructor(shaderName, loaded, shader) {
        if (new.target === objectToDraw) {
            throw new TypeError("Cannot construct ObjectToDraw instances directly");
        }
        this.shaderName = shaderName;
        this.loaded = loaded;
        this.shader = shader;
    }

    draw() {
        throw new Error("Method 'draw()' must be implemented.");
    }

    setShadersParams() {
        throw new Error("Method 'setShadersParams()' must be implemented.");
    }

    setCommonShaderParams(shader, buffers) {
        gl.useProgram(shader);

        for (const buffer of buffers) {
            const attribLocation = gl.getAttribLocation(shader, buffer.attribName);
            gl.enableVertexAttribArray(attribLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer.buffer);
            gl.vertexAttribPointer(attribLocation, buffer.itemSize, gl.FLOAT, false, 0, 0);
        }

        shader.pMatrixUniform = gl.getUniformLocation(shader, "uPMatrix");
        shader.mvMatrixUniform = gl.getUniformLocation(shader, "uMVMatrix");
    }

}