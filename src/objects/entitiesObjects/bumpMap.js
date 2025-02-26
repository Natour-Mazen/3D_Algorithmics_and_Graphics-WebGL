class BumpMap extends Plane {

    constructor() {
        super("glsl/bumpMap");
    }

    async initAll() {
        await super.initAll().then(() => {
            this.initBumpMap()
        });
    }

    initBumpMap() {
        const size = 10.5;
        const height = 0.018;
        const pos1 = vec3.create([-size, -size, height]);
        const pos2 = vec3.create([size, -size, height]);
        const pos3 = vec3.create([size, size, height]);
        const pos4 = vec3.create([-size, size, height]);

        // Textures Coords.
        let uv1 = vec2.create([0.0, 0.0]);
        let uv2 = vec2.create([0.0, 1.0]);
        let uv3 = vec2.create([1.0, 1.0]);
        let uv4 = vec2.create([1.0, 0.0]);

        // Triangle 1.
        let edge1 = vec3.subtract(pos2, pos1, [0., 0., 0.]);
        let edge2 = vec3.subtract(pos3, pos1, [0., 0., 0.]);
        let deltaUV1 = vec2.subtract(uv2, uv1, [0., 0., 0.]);
        let deltaUV2 = vec2.subtract(uv3, uv1, [0., 0., 0.]);

        let f = 1.0 / (deltaUV1[0] * deltaUV2[1] - deltaUV2[0] * deltaUV1[1]);

        let tangent1 = [f * (deltaUV2[1] * edge1[0] - deltaUV1[1] * edge2[0]),
            f * (deltaUV2[1] * edge1[1] - deltaUV1[1] * edge2[1]),
            f * (deltaUV2[1] * edge1[2] - deltaUV1[1] * edge2[2])];
        // Triangle 2.
        edge1 = vec3.subtract(pos3, pos1, [0., 0., 0.]);
        edge2 = vec3.subtract(pos4, pos1, [0., 0., 0.]);
        deltaUV1 = vec2.subtract(uv3, uv1, [0., 0., 0.]);
        deltaUV2 = vec2.subtract(uv4, uv1, [0., 0., 0.]);

        f = 1.0 / (deltaUV1[0] * deltaUV2[1] - deltaUV2[0] * deltaUV1[1]);

        let tangent2 = [f * (deltaUV2[1] * edge1[0] - deltaUV1[1] * edge2[0]),
            f * (deltaUV2[1] * edge1[1] - deltaUV1[1] * edge2[1]),
            f * (deltaUV2[1] * edge1[2] - deltaUV1[1] * edge2[2])];

        const tangents = [
            tangent1[0], tangent1[1], tangent1[2],
            tangent1[0], tangent1[1], tangent1[2],
            tangent1[0], tangent1[1], tangent1[2],
            tangent2[0], tangent2[1], tangent2[2],
            tangent2[0], tangent2[1], tangent2[2],
            tangent2[0], tangent2[1], tangent2[2],
        ];

        // Tangents
        this.tanBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.tanBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tangents), gl.STATIC_DRAW);
        this.tanBuffer.itemSize = 3;
        this.tanBuffer.numItems = 6;
    }

    setShadersParams() {
        super.setShadersParams();
        this.setShaderAttributes([
            { attribName: "aVertexTangent", buffer: this.tanBuffer, itemSize: this.tanBuffer.itemSize },
        ]);
        this.shader.uBumpSampler = gl.getUniformLocation(this.shader, "uBumpSampler");
        this.shader.uSampler = gl.getUniformLocation(this.shader, "uSampler");
        this.shader.uBumpMap = gl.getUniformLocation(this.shader, "uBumMap");
    }

    setUniforms() {
        super.setUniforms();
        // Bind and set the bump map texture
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, bumpMapType);
        gl.uniform1i(this.shader.uBumpSampler, 0); // Use texture unit 0 for bump map
        this.checkGlError();

        // Bind and set the main texture
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, texture_ForBump);
        gl.uniform1i(this.shader.uSampler, 1); // Use texture unit 1 for main texture
        this.checkGlError();

        // selectedBumpMap in bumpMapUIMenu.
        // If a bump map is selected then we applied it to the texture.
        gl.uniform1i(this.shader.uBumpMap, selectedBumpMap === 'None' ? 0 : 1);
        this.checkGlError();
    }

    drawAux() {
        gl.drawArrays(gl.TRIANGLES, 0, this.vBuffer.numItems);
        gl.drawArrays(gl.LINE_LOOP, 0, this.vBuffer.numItems);
    }
}