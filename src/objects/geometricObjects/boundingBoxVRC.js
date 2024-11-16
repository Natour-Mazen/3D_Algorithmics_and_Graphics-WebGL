// boundingBox class with a volumetric ray casting rendering type
class BoundingBoxVRC extends BoundingBox {
    // --------------------------------------------
    constructor() {
        super('glsl/boundingBoxVRC', -1, null);
        this.boundingBoxVoxelMapRayDepth = 1;
        this.boundingBoxVoxelMapTransfertFunc = -1;
    }

    // --------------------------------------------

    // --------------------------------------------
    setShadersParams() {
        super.setShadersParams();
        this.shader.uVoxelMapTypeSampler = gl.getUniformLocation(this.shader, "uVoxelMapTypeSampler");
        this.shader.uVoxelMapRayDepth = gl.getUniformLocation(this.shader, "uVoxelMapRayDepth");
        this.shader.uVoxelMapTransfertFunc = gl.getUniformLocation(this.shader, "uVoxelMapTransfertFunc");
    }

    setUniforms() {
        super.setUniforms();

        gl.uniform1f(this.shader.uVoxelMapRayDepth, this.boundingBoxVoxelMapRayDepth);
        this.checkGlError();

        gl.uniform1i(this.shader.uVoxelMapTransfertFunc, this.boundingBoxVoxelMapTransfertFunc);
        this.checkGlError();

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, boundingBoxVoxelMapType);
        gl.uniform1i(this.shader.uVoxelMapTypeSampler, 0);
        this.checkGlError();

    }

    // --------------------------------------------

    setBoundingBoxVoxelMapRayDepth(value) {
        this.boundingBoxVoxelMapRayDepth = value;
    }

    setBoundingBoxVoxelMapTransfertFunc(value) {
        this.boundingBoxVoxelMapTransfertFunc = value;
    }

}