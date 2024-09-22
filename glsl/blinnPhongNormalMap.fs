precision mediump float;

uniform sampler2D uSampler;
uniform sampler2D uBumpSampler;
uniform vec3 uColor;
uniform vec3 uLightColor;
uniform vec3 uAmbientColor;
uniform float uShininess;

varying vec2 vTexCoords;
varying vec3 vLightDir;
varying vec3 vViewDir;
varying vec3 vNormal;

void main(void) {
    // Fetch the bump map value
    vec3 normal = texture2D(uBumpSampler, vTexCoords).rgb;
    normal = normalize(normal * 2.0 - 1.0);

    // Ambient component
    vec3 ambient = uAmbientColor * uColor;

    // Diffuse component
    float lambertian = max(dot(normal, vLightDir), 0.0);
    vec3 diffuse = lambertian * uLightColor * uColor;

    // Specular component
    vec3 viewDir = normalize(vViewDir);
    vec3 reflectDir = reflect(-vLightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), uShininess);
    vec3 specular = spec * uLightColor;

    // Fetch the texture color
    vec4 texColor = texture2D(uSampler, vTexCoords);

    // Combine the texture color with the Phong reflection components
    vec3 finalColor = (ambient + diffuse + specular) * texColor.rgb;

    gl_FragColor = vec4(finalColor, texColor.a);
}