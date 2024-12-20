// boundingBox class with a volumetric ray casting rendering type
class BoundingBoxVRC extends BoundingBox {
    // --------------------------------------------
    constructor() {
        super('glsl/boundingBoxVRC', -1, null, true);
        this.boundingBoxVoxelMapRayDepth = 1;
        this.boundingBoxVoxelMapTransfertFunc = -1;
        this.boundingBoxVoxelMapSize = -1;
        this.boundingBoxVoxelMapNbImageWidth = -1;
        this.boundingBoxVoxelMapNbImageHeight = -1;
        this.boundingBoxVoxelMapStartTime = Date.now();
        this.boundingBoxTrasnferFuncCustomValues = [];
        this.boundingBoxVoxelMapVoxelIntensity = 1;
        this.boundingBoxVoxelMapDisplaySlicesCubes = false;
        this.boundingBoxVoxelMapSlicesToDisplay = [];
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
        this.shader.uHeartBeatFactor = gl.getUniformLocation(this.shader, "uHeartBeatFactor");
        this.shader.uTransferFuncCustomValues = gl.getUniformLocation(this.shader, "uTransferFuncCustomValues");
        this.shader.uVoxelMapVoxelIntensity = gl.getUniformLocation(this.shader, "uVoxelMapVoxelIntensity");
        this.shader.uDisplaySlicesCubes = gl.getUniformLocation(this.shader, "uDisplaySlicesCubes");
        this.shader.uSlicesToDisplay = gl.getUniformLocation(this.shader, "uSlicesToDisplay");
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
        gl.uniform1f(this.shader.uVoxelMapSize, this.boundingBoxVoxelMapSize);
        this.checkGlError();

        // The number of images along the width of the voxel map.
        gl.uniform1f(this.shader.uNbImageWidth, this.boundingBoxVoxelMapNbImageWidth);
        this.checkGlError();

        // The number of images along the height of the voxel map.
        gl.uniform1f(this.shader.uNbImageHeight, this.boundingBoxVoxelMapNbImageHeight);
        this.checkGlError();

        // The time since the start of the bounding box. Used to animate the voxel map. with a heartbeat effect.
        gl.uniform1f(this.shader.uHeartBeatFactor, (Date.now() - this.boundingBoxVoxelMapStartTime) / 1000.0);
        this.checkGlError();

        // The custom values for the transfer function, if any.
        gl.uniform4fv(this.shader.uTransferFuncCustomValues,new Float32Array(this.boundingBoxTrasnferFuncCustomValues) );
        this.checkGlError();

        // The voxel intensity of the voxel map.
        gl.uniform1f(this.shader.uVoxelMapVoxelIntensity, this.boundingBoxVoxelMapVoxelIntensity);
        this.checkGlError();

        // The slice modification active.
        gl.uniform1i(this.shader.uDisplaySlicesCubes, this.boundingBoxVoxelMapDisplaySlicesCubes);
        this.checkGlError();

        // The slices to display.
        gl.uniform1fv(this.shader.uSlicesToDisplay,new Float32Array(this.boundingBoxVoxelMapSlicesToDisplay) );
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

    setBoundingBoxVoxelMapSize(value) {
        this.boundingBoxVoxelMapSize = value;
    }

    setBoundingBoxVoxelMapNbImageWidth(value) {
        this.boundingBoxVoxelMapNbImageWidth = value;
    }

    setBoundingBoxVoxelMapNbImageHeight(value) {
        this.boundingBoxVoxelMapNbImageHeight = value;
    }

    setBoundingBoxVoxelMapTransferFuncCustomValues(value) {
        this.boundingBoxTrasnferFuncCustomValues = value;
    }

    setBoundingBoxVoxelMapVoxelIntensity(value) {
        this.boundingBoxVoxelMapVoxelIntensity = value;
    }

    setBoundingBoxVoxelMapDisplaySlicesCubes(value) {
        this.boundingBoxVoxelMapDisplaySlicesCubes = value;
    }

    setBoundingBoxVoxelMapSlicesToDisplay(value) {
        this.boundingBoxVoxelMapSlicesToDisplay = value;
    }
}