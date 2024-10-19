vec3 phongLighting(float uLightShininess, vec3 lightDir, vec4 uLightSpecular,
                   vec4 uLightColor, vec4 texColor, float uPI, float weight, vec3 normal) {

    float n = 10. * uLightShininess * uLightShininess * 2.0;

    vec3 bissectriceDir = lightDir + vec3(0, 0, 0)/* player position*/;
    float weightSpec = pow(max(dot(normal, bissectriceDir), 0.0), n);

    return uLightColor.rgb * ((1. - uLightSpecular.rgb) * texColor.rgb + ((8. + n) / (8. * uPI)) * uLightSpecular.rgb * weightSpec) * weight;
}

vec3 lambertLighting(float uLightIntensity, vec4 uLightColor, vec4 texColor, float weight, float uPI) {
    return uLightColor.rgb * texColor.rgb * (1.0 / uPI) * weight * uLightIntensity;
}
