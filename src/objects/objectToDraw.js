/**
 * Base class for drawable objects.
 * @abstract
 */
class objectToDraw {

    /**
     * Constructor for objectToDraw.
     * @param {string} shaderName - The name of the shader.
     * @param {number} loaded - The loading state.
     * @param {WebGLProgram} shader - The shader program.
     * @throws {TypeError} If an instance of objectToDraw is created directly.
     */
    constructor(shaderName, loaded, shader) {
        if (new.target === objectToDraw) {
            throw new TypeError("Cannot construct ObjectToDraw instances directly");
        }
        this.shaderName = shaderName;
        this.loaded = loaded;
        this.shader = shader;
        this.color = Color.BLACK;
    }

    /**
     * Auxiliary method to draw the object.
     * @abstract
     * @throws {Error} If the method is not implemented in a subclass.
     */
    drawAux() {
        throw new Error("Method 'drawAux()' must be implemented.");
    }

    /**
     * Sets the shader parameters.
     * @abstract
     * @throws {Error} If the method is not implemented in a subclass.
     */
    setShadersParams() {
        throw new Error("Method 'setShadersParams()' must be implemented.");
    }

    /**
     * Sets the shader uniforms.
     * @abstract
     * @throws {Error} If the method is not implemented in a subclass.
     */
    setUniforms() {
        throw new Error("Method 'setUniforms()' must be implemented.");
    }

    /**
     * Draws the object if the shader is loaded.
     * this method should be called in the render loop and not be overridden except for special cases like the objmesh class.
     */
    draw() {
        if(this.shader && this.loaded === 4) {
            this.setShadersParams();
            this.setUniforms();
            this.drawAux();
        }
    }

    /**
     * Sets common shader parameters.
     * @param {Array} buffers - The buffers to use for shader attributes.
     */
    setCommonShaderParams(buffers) {
        gl.useProgram(this.shader);

        for (const buffer of buffers) {
            const attribLocation = gl.getAttribLocation(this.shader, buffer.attribName);
            gl.enableVertexAttribArray(attribLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer.buffer);
            gl.vertexAttribPointer(attribLocation, buffer.itemSize, gl.FLOAT, false, 0, 0);
        }

        this.shader.pMatrixUniform = gl.getUniformLocation(this.shader, "uPMatrix");
        this.shader.mvMatrixUniform = gl.getUniformLocation(this.shader, "uMVMatrix");
        this.shader.colorUniform = gl.getUniformLocation(this.shader, "uColor");
    }

    /**
     * Sets the color of the object.
     * @param {Array} color - The color to apply.
     */
    setColor(color) {
        this.color = color;
    }

    /**
     * Sets the scale of the object.
     * @param {number} scale - The scale to apply.
     */
    setScale(scale) {
        this.scale = scale;
    }

    /**
     * Sets the shader name and reloads the shaders.
     * @param {string} newShaderName - The new shader name.
     */
    setShaderName(newShaderName) {
        this.shaderName = newShaderName;
        loadShaders(this);
    }

}