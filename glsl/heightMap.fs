// Fragment Shader
precision mediump float;

uniform sampler2D uSampler;

varying vec4 pos3D;
varying vec3 N;
varying vec2 vTexCoord;
uniform vec3 uColor;

void main(void)
{
    vec3 col = uColor * dot(N,normalize(vec3(-pos3D))); // Lambert rendering, eye light source
    vec4 textureColor = texture2D(uSampler, vTexCoord);
    gl_FragColor = vec4(col,1.0) * textureColor;
}