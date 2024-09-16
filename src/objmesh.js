class objmesh {

    // --------------------------------------------
    constructor(objFname) {
        this.objName = objFname;
        this.shaderName = 'glsl/obj';
        this.loaded = -1;
        this.shader = null;
        this.mesh = null;

        loadObjFile(this);
        loadShaders(this);
    }

    // --------------------------------------------
    setShadersParams() {
        gl.useProgram(this.shader);

        this.shader.vAttrib = gl.getAttribLocation(this.shader, "aVertexPosition");
        gl.enableVertexAttribArray(this.shader.vAttrib);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.vertexBuffer);
        gl.vertexAttribPointer(this.shader.vAttrib, this.mesh.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

        this.shader.nAttrib = gl.getAttribLocation(this.shader, "aVertexNormal");
        gl.enableVertexAttribArray(this.shader.nAttrib);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.normalBuffer);
        gl.vertexAttribPointer(this.shader.nAttrib, this.mesh.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

        this.shader.rMatrixUniform = gl.getUniformLocation(this.shader, "uRMatrix");
        this.shader.mvMatrixUniform = gl.getUniformLocation(this.shader, "uMVMatrix");
        this.shader.pMatrixUniform = gl.getUniformLocation(this.shader, "uPMatrix");
    }

    // --------------------------------------------
    setMatrixUniforms() {
        mat4.identity(mvMatrix);
        mat4.translate(mvMatrix, distCENTER);
        mat4.multiply(mvMatrix, rotMatrix);
        gl.uniformMatrix4fv(this.shader.rMatrixUniform, false, rotMatrix);
        gl.uniformMatrix4fv(this.shader.mvMatrixUniform, false, mvMatrix);
        gl.uniformMatrix4fv(this.shader.pMatrixUniform, false, pMatrix);
    }

    // --------------------------------------------
    draw() {
        if(this.shader && this.loaded === 4 && this.mesh != null) {
            this.setShadersParams();
            this.setMatrixUniforms();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mesh.indexBuffer);
            gl.drawElements(gl.TRIANGLES, this.mesh.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
        }
    }
}