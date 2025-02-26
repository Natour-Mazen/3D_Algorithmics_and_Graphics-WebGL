class ObjMesh extends ObjectToDraw {


    // --------------------------------------------
    constructor(objName) {
        super('glsl/obj', -1, null);
        this.objName = objName;
        this.mesh = null;

        this.loadObjFile(this);
    }

    // --------------------------------------------
    async initAll() {
        // we don't need to initialize any buffers for this object
    }

    // --------------------------------------------
    setShadersParams() {
        if(this.mesh != null) {
            this.setShaderAttributes([
                { attribName: "aVertexPosition", buffer: this.mesh.vertexBuffer, itemSize: this.mesh.vertexBuffer.itemSize },
                { attribName: "aVertexNormal", buffer: this.mesh.normalBuffer, itemSize: this.mesh.vertexBuffer.itemSize }
            ]);
        }
    }

    // --------------------------------------------
    setUniforms() {
       // we don't need to set any uniforms for this object
    }

    // --------------------------------------------
    drawAux() {
        if(this.mesh != null) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mesh.indexBuffer);
            gl.drawElements(gl.TRIANGLES, this.mesh.indexBuffer.numItems, gl.UNSIGNED_INT, 0);
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
        xhttp.overrideMimeType("text/plain")
        xhttp.send();
    }

}