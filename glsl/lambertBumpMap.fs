precision mediump float;

varying vec2 texCoords;
varying vec3 vTransformedNormal;
varying vec4 vPosition;

uniform sampler2D uSampler;
uniform sampler2D uBumpSampler;
uniform vec3 uLightDirection;

void main(void) {
    vec3 lightDirection = normalize(uLightDirection);

    vec3 normal = texture2D(uBumpSampler, texCoords).rgb;
    normal = normalize(normal * 2.0 - 1.0);

    float lambertian = max(dot(normal, lightDirection), 0.0);
    vec3 lightWeighting = vec3(1.0, 1.0, 1.0) * lambertian;

    vec4 fragmentColor = texture2D(uSampler, texCoords);
    gl_FragColor = vec4(fragmentColor.rgb * lightWeighting, fragmentColor.a);
}