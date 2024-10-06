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
        this.color = Color.WHITE;
        this.scale = 1;
        // To display error just one time.
        this.seenErrors = new Set();
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
     * this method should be called in the render loop and not be overridden.
     */
    draw() {
        if(this.shader && this.loaded === 4) {
            this.setShadersParams();
            this.setCommonUniforms()
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
            if(attribLocation !== -1)
            {
                gl.enableVertexAttribArray(attribLocation);
                gl.bindBuffer(gl.ARRAY_BUFFER, buffer.buffer);
                gl.vertexAttribPointer(attribLocation, buffer.itemSize, gl.FLOAT, false, 0, 0);
            }
        }

        this.shader.rMatrixUniform = gl.getUniformLocation(this.shader, "uRMatrix");
        this.shader.mvMatrixUniform = gl.getUniformLocation(this.shader, "uMVMatrix");
        this.shader.pMatrixUniform = gl.getUniformLocation(this.shader, "uPMatrix");
        this.shader.colorUniform = gl.getUniformLocation(this.shader, "uColor");
        this.shader.uLightPosition = gl.getUniformLocation(this.shader, "uLightPosition");
        this.shader.uLightColor = gl.getUniformLocation(this.shader, "uLightColor");
        this.shader.uAmbientColor = gl.getUniformLocation(this.shader, "uAmbientColor");
        this.shader.uLightSpecular = gl.getUniformLocation(this.shader, "uLightSpecular");
        this.shader.uMaterialShininess = gl.getUniformLocation(this.shader, "uMaterialShininess");
        this.shader.uMaterialSpecular = gl.getUniformLocation(this.shader, "uMaterialSpecular");
    }

    /**
     * Sets common uniforms for the object.
     * This method is called in the draw method of the object
     */
    setCommonUniforms() {
        mat4.identity(mvMatrix);
        mat4.translate(mvMatrix, distCENTER);
        mat4.scale(mvMatrix, [this.scale, this.scale, this.scale]);
        mat4.multiply(mvMatrix, rotMatrix);

        // Set the rotation matrix.
        gl.uniformMatrix4fv(this.shader.rMatrixUniform, false, rotMatrix);
        this.checkGlError();

        // Set the model-view matrix.
        gl.uniformMatrix4fv(this.shader.mvMatrixUniform, false, mvMatrix);
        this.checkGlError();

        // Set the projection matrix.
        gl.uniformMatrix4fv(this.shader.pMatrixUniform, false, pMatrix);
        this.checkGlError();

        // Set the color.
        gl.uniform4fv(this.shader.colorUniform, this.color);
        this.checkGlError();

        // Set the light position.
        gl.uniform3fv(this.shader.uLightPosition, lightPosition);
        this.checkGlError();

        // Set the light color
        gl.uniform4fv(this.shader.uLightColor, lightColor);
        this.checkGlError();

        // Set the ambient color
        gl.uniform4fv(this.shader.uAmbientColor, lightAmbient);
        this.checkGlError();

        // Set the specular light color.
        gl.uniform4fv(this.shader.uLightSpecular, lightSpecular);
        this.checkGlError();

        // Set the material specular
        gl.uniform4fv(this.shader.uMaterialSpecular, materialSpecular);
        this.checkGlError();

        // Set the material shininess.
        gl.uniform1f(this.shader.uMaterialShininess, materialShininess);
        this.checkGlError();

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

    /**
     * Checks for WebGL errors and logs them.
     */
    checkGlError() {
        const error = gl.getError();
        if (error !== gl.NO_ERROR && !this.seenErrors.has(error)) {
            console.error("WebGL Error: ", error);
            this.seenErrors.add(error);  // Add the error to the set if it is new
        }
    }

}