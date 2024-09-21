precision mediump float;

uniform sampler2D uSampler;
uniform sampler2D uBumpSampler;
uniform vec3 uLightDirection;
uniform vec3 uColor;
uniform mat4 uRMatrix;

varying vec4 pos3D;
varying vec2 vTexCoords;

void main(void) {
    vec3 lightDir = normalize(uLightDirection);

    // Fetch the bump map value
    //vec3 bump = texture2D(uBumpSampler, vTexCoords).rgb;
    vec3 normal = texture2D(uBumpSampler, vTexCoords).rgb;
    normal = (normal * 2.0) - 1.0;
    normal = vec3(vec4(normal, 1.0) * uRMatrix);

    // Lambertian reflection
    //float lambertian = dot(bump, normalize(vec3(-pos3D)));
    //float lambertian = dot(normal, normalize(vec3(-pos3D)));
    //float lambertian = dot(lightDir, normalize(vec3(normal)));
    float lambertian = max(dot(normal, lightDir), 0.0);
    //float lambertian = dot(normal, normalize(vec3(-pos3D)));

    // Fetch the texture color
    vec4 texColor = texture2D(uSampler, vTexCoords);

    // Combine the texture color with the Lambertian reflection and the uniform color
    vec3 finalColor = texColor.rgb * lambertian * uColor;

    gl_FragColor = vec4(finalColor, texColor.a);
}