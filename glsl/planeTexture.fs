precision mediump float;

uniform sampler2D uSampler;
uniform vec3 uLightDirection;
uniform vec3 uColor;

varying vec2 vTexCoords;

void main(void) {

    // Fetch the texture color
    vec4 texColor = texture2D(uSampler, vTexCoords);

    gl_FragColor = texColor * vec4(uColor, 1.0);
}