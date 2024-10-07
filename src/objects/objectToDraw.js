/**
 * Base class for drawable objects.
 * @abstract
 */
class ObjectToDraw {

    /**
     * Constructor for objectToDraw.
     * @param {string} shaderName - The name of the shader.
     * @param {number} loaded - The loading state.
     * @param {WebGLProgram} shader - The shader program.
     * @throws {TypeError} If an instance of objectToDraw is created directly.
     */
    constructor(shaderName, loaded, shader) {
        if (new.target === ObjectToDraw) {
            throw new TypeError("Cannot construct ObjectToDraw instances directly");
        }
        this.shaderName = shaderName;
        this.loaded = loaded;
        this.shader = shader;
        this.objectColor = Color.WHITE;
        this.objectScale = 1;

        this.objectRay = new Ray(); // The ray object. a classic light model.

        // To display error just one time.
        this.seenErrors = new Set();
        this.initAll().then(() => {
            loadShaders(this);
        });
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
     * Initializes the object buffers.
     */
    async initAll() {
        throw new Error("Method 'initAll()' must be implemented.");
    }

    /**
     * Sets the shader attributes.
     * @param buffers
     */
    setShaderAttributes(buffers) {
        for (const buffer of buffers) {
            const attribLocation = gl.getAttribLocation(this.shader, buffer.attribName);
            if(attribLocation !== -1) {
                gl.enableVertexAttribArray(attribLocation);
                gl.bindBuffer(gl.ARRAY_BUFFER, buffer.buffer);
                gl.vertexAttribPointer(attribLocation, buffer.itemSize, gl.FLOAT, false, 0, 0);
            }
        }
    }

    /**
     * Draws the object if the shader is loaded.
     * this method should be called in the render loop and not be overridden.
     */
    draw() {
        if(this.shader && this.loaded === 4) {
            this.#setCommonShaderParams();
            this.setShadersParams();
            this.#setCommonUniforms();
            this.setUniforms();
            this.drawAux();
        }
    }

    /**
     * Sets common shader parameters.
     */
    #setCommonShaderParams() {
        gl.useProgram(this.shader);

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
    #setCommonUniforms() {
        mat4.identity(mvMatrix);
        mat4.translate(mvMatrix, distCENTER);
        mat4.scale(mvMatrix, [this.objectScale, this.objectScale, this.objectScale]);
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
        gl.uniform4fv(this.shader.colorUniform, this.objectColor);
        this.checkGlError();

        // Set the light position.
        gl.uniform3fv(this.shader.uLightPosition, this.objectRay.getLightPosition());
        this.checkGlError();

        // Set the light color
        gl.uniform4fv(this.shader.uLightColor, this.objectRay.getLightColor());
        this.checkGlError();

        // Set the ambient color
        gl.uniform4fv(this.shader.uAmbientColor, this.objectRay.getLightAmbient() );
        this.checkGlError();

        // Set the specular light color.
        gl.uniform4fv(this.shader.uLightSpecular, this.objectRay.getLightSpecular());
        this.checkGlError();

        // Set the material specular
        gl.uniform4fv(this.shader.uMaterialSpecular, this.objectRay.getMaterialSpecular());
        this.checkGlError();

        // Set the material shininess.
        gl.uniform1f(this.shader.uMaterialShininess, this.objectRay.getMaterialShininess());
        this.checkGlError();

    }

    /**
     * Sets the color of the object.
     * @param {Array} color - The color to apply.
     */
    setColor(color) {
        this.objectColor = color;
    }

    /**
     * Sets the color of the uniform 'uColor'.
     * @param {Array} color - The color to apply.
     */
    setUniformColor(color){
        gl.uniform4fv(this.shader.colorUniform, color);
        this.checkGlError();
    }

    /**
     * Sets the scale of the object.
     * @param {number} scale - The scale to apply.
     */
    setScale(scale) {
        this.objectScale = scale;
    }

    /**
     * sets the ray object.
     */
    setRay(ray) {
        this.objectRay = ray;
    }

    /**
     * Returns the color of the object.
     * @returns {number[]}
     */
    getColor() {
        return this.objectColor;
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