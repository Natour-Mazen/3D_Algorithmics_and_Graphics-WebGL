// boundingBox class with a ray marching rendering type
class BoundingBoxRM extends BoundingBox {
    // --------------------------------------------
    constructor() {
        super('glsl/boundingBoxRM', -1,null );
        this.boundingBoxHeightMapflattenFactor = 1;
    }


    // --------------------------------------------
    setShadersParams() {
        super.setShadersParams();
        
        this.shader.uHeightMapIsImageInColor = gl.getUniformLocation(this.shader, "uHeightMapIsImageInColor");
        this.shader.uHeightMapFlatten = gl.getUniformLocation(this.shader, "uHeightMapFlatten");
        this.shader.uHeightMapTypeSampler = gl.getUniformLocation(this.shader, "uHeightMapTypeSampler");
        this.shader.uHeightMapTextureSampler = gl.getUniformLocation(this.shader, "uHeightMapTextureSampler");
    }

    // --------------------------------------------
    setUniforms() {
        super.setUniforms();

        // We send the flattering factor (between 0.1 and 1.).
        gl.uniform1f(this.shader.uHeightMapFlatten, 1.1 - this.boundingBoxHeightMapflattenFactor * 0.1);
        this.checkGlError();


        // We tell if the image is in color (1) or not (0).
        // If (1) -> we use the L in the LAB color metric.
        // If (0) -> we use the R in the RGB color metric.
        gl.uniform1i(this.shader.uHeightMapIsImageInColor, isColoredBoundingBoxHeightMapType);
        this.checkGlError();

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, boundingBoxHeightMapType);
        gl.uniform1i(this.shader.uHeightMapTypeSampler, 0); // Use texture unit 0 for bump map
        this.checkGlError();

        // Bind and set the main texture
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, boundingBoxHeightMapTexture);
        gl.uniform1i(this.shader.uHeightMapTextureSampler, 1); // Use texture unit 1 for main texture
        this.checkGlError();
    }

    // --------------------------------------------
    setBoundingBoxHeightMapFlattenFactor(value) {
        this.boundingBoxHeightMapflattenFactor = value;
    }

}