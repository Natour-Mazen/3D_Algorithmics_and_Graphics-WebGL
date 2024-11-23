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
        this.shader.uVoxelMapSize = gl.getUniformLocation(this.shader, "uVoxelMapSize");
        this.shader.uNbImageWidth = gl.getUniformLocation(this.shader, "uNbImageWidth");
        this.shader.uNbImageHeight = gl.getUniformLocation(this.shader, "uNbImageHeight");
    }

    setUniforms() {
        super.setUniforms();

        // To modify the ray depth.
        gl.uniform1f(this.shader.uVoxelMapRayDepth, this.boundingBoxVoxelMapRayDepth);
        this.checkGlError();

        // To select the transfer function.
        gl.uniform1i(this.shader.uVoxelMapTransfertFunc, this.boundingBoxVoxelMapTransfertFunc);
        this.checkGlError();

        // The size of the images inside the voxel map.
        gl.uniform1f(this.shader.uVoxelMapSize, 784.);
        this.checkGlError();

        // The number of images along the width of the voxel map.
        gl.uniform1f(this.shader.uNbImageWidth, 28.);
        this.checkGlError();

        // The number of images along the height of the voxel map.
        gl.uniform1f(this.shader.uNbImageHeight, 28.);
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