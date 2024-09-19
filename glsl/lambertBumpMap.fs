precision mediump float;

uniform sampler2D uSampler;
uniform sampler2D uBumpSampler;
uniform vec3 uLightDirection;
uniform vec3 uColor;

varying vec2 vTexCoords;

void main(void) {
    vec3 lightDir = normalize(uLightDirection);

    // Fetch the bump map value
    vec3 bump = texture2D(uBumpSampler, vTexCoords).rgb;
    vec3 normal = normalize(bump * 2.0 - 1.0);

    // Lambertian reflection
    float lambertian = max(dot(normal, lightDir), 0.0);

    // Fetch the texture color
    vec4 texColor = texture2D(uSampler, vTexCoords);

    // Combine the texture color with the Lambertian reflection and the uniform color
    vec3 finalColor = texColor.rgb * lambertian * uColor;

    gl_FragColor = vec4(finalColor, texColor.a);
}
