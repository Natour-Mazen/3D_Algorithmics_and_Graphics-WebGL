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
        this.transferFuncCustomValues = [];
        this.voxelIntensity = 1;
        this.displaySlicesCubes = false;
        this.slicesToDisplay = [];
    }

    // --------------------------------------------

    // --------------------------------------------
    setShadersParams() {
        super.setShadersParams();
        this.shader.uVoxelMapTypeSampler = gl.getUniformLocation(this.shader, "uVoxelMapTypeSampler");
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
    }

    setUniforms() {
        super.setUniforms();

        // To modify the ray depth.
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

        // The custom values for the transfer function, if any.
        gl.uniform4fv(this.shader.uTransferFuncCustomValues,new Float32Array(this.transferFuncCustomValues) );
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

    setTransferFuncCustomValues(value) {
        this.transferFuncCustomValues = value;
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