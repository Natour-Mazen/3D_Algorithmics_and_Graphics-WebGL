class objmesh extends objectToDraw {


    // --------------------------------------------
    constructor(objName, scale = 1.0) {
        super('glsl/obj', -1, null);
        this.objName = objName;
        this.mesh = null;
        this.scale = scale;

        this.loadObjFile(this);
        loadShaders(this);
    }

    // --------------------------------------------
    setShadersParams() {
        this.setCommonShaderParams(this.shader, [
            { attribName: "aVertexPosition", buffer: this.mesh.vertexBuffer, itemSize: this.mesh.vertexBuffer.itemSize },
            { attribName: "aVertexNormal", buffer: this.mesh.normalBuffer, itemSize: this.mesh.vertexBuffer.itemSize }
        ]);
        this.shader.rMatrixUniform = gl.getUniformLocation(this.shader, "uRMatrix");
        this.shader.mvMatrixUniform = gl.getUniformLocation(this.shader, "uMVMatrix");
        this.shader.pMatrixUniform = gl.getUniformLocation(this.shader, "uPMatrix");
    }

    // --------------------------------------------
    setMatrixUniforms() {
        mat4.identity(mvMatrix);
        mat4.translate(mvMatrix, distCENTER);
        mat4.multiply(mvMatrix, rotMatrix);
        mat4.scale(mvMatrix, [this.scale, this.scale, this.scale]);
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

    loadObjFile(OBJ3D) {
        const xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function() {
            if (xhttp.readyState === 4 && xhttp.status === 200) {
                const tmpMesh = new OBJ.Mesh(xhttp.responseText);
                OBJ.initMeshBuffers(gl, tmpMesh);
                OBJ3D.mesh = tmpMesh;
            }
        }

        xhttp.open("GET", OBJ3D.objName, true);
        xhttp.send();
    }
}