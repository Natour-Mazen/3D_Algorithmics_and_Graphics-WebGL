precision mediump float;

uniform sampler2D uSampler;
uniform sampler2D uBumpSampler;
uniform vec3 uColor;

varying vec2 vTexCoords;
varying vec3 vLightDir;

void main(void) {
    // Fetch the bump map value
    vec3 normal = texture2D(uBumpSampler, vTexCoords).rgb;
    //normal = vec3(normal.r * 2.0 - 1.0, normal.b * 2.0 - 1.0, normal.z);
    normal = normalize(normal * 2.0 - 1.0);

    // Lambertian reflection
    float lambertian = max(dot(normal, vLightDir), 0.0);

    // Fetch the texture color
    vec4 texColor = texture2D(uSampler, vTexCoords);

    // Combine the texture color with the Lambertian reflection and the uniform color
    vec3 finalColor = texColor.rgb * lambertian * uColor;

    gl_FragColor = vec4(finalColor, texColor.a);
}