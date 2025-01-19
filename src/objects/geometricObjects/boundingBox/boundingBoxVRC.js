// boundingBox class with a volumetric ray casting rendering type
class BoundingBoxVRC extends BoundingBox {
    // --------------------------------------------
    constructor() {
        super('glsl/boundingBoxVRC', -1, null, true);
        this.voxelNoise = 1;
        this.transferFunc = -1;
        this.nbImageDepth = 1;
        this.nbImageWidth = 1;
        this.nbImageHeight = 1;
        this.instanceStartTime = Date.now();
        this.voxelIntensity = 1;
        this.displaySlicesCubes = false;
        this.slicesToDisplay = [];
    }

    // --------------------------------------------

    // --------------------------------------------
    setShadersParams() {
        super.setShadersParams();
        this.shader.uVoxelMapTypeSampler = gl.getUniformLocation(this.shader, "uVoxelMapTypeSampler");
        this.shader.uIsVoxelMapEmpty = gl.getUniformLocation(this.shader, "uIsVoxelMapEmpty");
        this.shader.uVoxelNoise = gl.getUniformLocation(this.shader, "uVoxelNoise");
        this.shader.uTransferFunc = gl.getUniformLocation(this.shader, "uTransferFunc");
        this.shader.uNbImageDepth = gl.getUniformLocation(this.shader, "uNbImageDepth");
        this.shader.uNbImageWidth = gl.getUniformLocation(this.shader, "uNbImageWidth");
        this.shader.uNbImageHeight = gl.getUniformLocation(this.shader, "uNbImageHeight");
        this.shader.uHeartBeatFactor = gl.getUniformLocation(this.shader, "uHeartBeatFactor");
        this.shader.uTransferFuncCustomValues = gl.getUniformLocation(this.shader, "uTransferFuncCustomValues");
        this.shader.uVoxelIntensity = gl.getUniformLocation(this.shader, "uVoxelIntensity");
        this.shader.uDisplaySlicesCubes = gl.getUniformLocation(this.shader, "uDisplaySlicesCubes");
        this.shader.uSlicesToDisplay = gl.getUniformLocation(this.shader, "uSlicesToDisplay");
        this.shader.uFunctionTransferSampler = gl.getUniformLocation(this.shader, "uFunctionTransferSampler");
    }

    setUniforms() {
        super.setUniforms();

        // To tell if the voxel map is loaded or not.
        gl.uniform1i(this.shader.uIsVoxelMapEmpty, boundingBoxVoxelMapType == null ? 0 : 1);
        this.checkGlError();

        // To modify the noise of the voxel map.
        gl.uniform1f(this.shader.uVoxelNoise, this.voxelNoise);
        this.checkGlError();

        // To select the transfer function.
        gl.uniform1i(this.shader.uTransferFunc, this.transferFunc);
        this.checkGlError();

        // The size of the images inside the voxel map.
        gl.uniform1f(this.shader.uNbImageDepth, this.nbImageDepth);
        this.checkGlError();

        // The number of images along the width of the voxel map.
        gl.uniform1f(this.shader.uNbImageWidth, this.nbImageWidth);
        this.checkGlError();

        // The number of images along the height of the voxel map.
        gl.uniform1f(this.shader.uNbImageHeight, this.nbImageHeight);
        this.checkGlError();

        // The time since the start of the bounding box. Used to animate the voxel map. with a heartbeat effect.
        gl.uniform1f(this.shader.uHeartBeatFactor, (Date.now() - this.instanceStartTime) / 1000.0);
        this.checkGlError();

        // The voxel intensity of the voxel map.
        gl.uniform1f(this.shader.uVoxelIntensity, this.voxelIntensity);
        this.checkGlError();

        // The slice modification active.
        gl.uniform1i(this.shader.uDisplaySlicesCubes, this.displaySlicesCubes);
        this.checkGlError();

        // The slices to display.
        gl.uniform1fv(this.shader.uSlicesToDisplay,new Float32Array(this.slicesToDisplay) );
        this.checkGlError();

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, boundingBoxVoxelMapType);
        gl.uniform1i(this.shader.uVoxelMapTypeSampler, 0);
        this.checkGlError();

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, boundingBoxVRCTransferFuncCustomTexture);
        gl.uniform1i(this.shader.uFunctionTransferSampler, 1);
        this.checkGlError();

    }

    // --------------------------------------------

    setVoxelNoise(value) {
        this.voxelNoise = value;
    }

    setTransferFunc(value) {
        this.transferFunc = value;
    }

    setNbImageDepth(value) {
        this.nbImageDepth = value;
    }

    setNbImageWidth(value) {
        this.nbImageWidth = value;
    }

    setNbImageHeight(value) {
        this.nbImageHeight = value;
    }

    setVoxelIntensity(value) {
        this.voxelIntensity = value;
    }

    setDisplaySlicesCubes(value) {
        this.displaySlicesCubes = value;
    }

    setSlicesToDisplay(value) {
        this.slicesToDisplay = value;
    }
}