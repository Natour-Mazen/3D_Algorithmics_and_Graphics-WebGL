// BlinnPhong Fragment shader.
precision mediump float;

uniform sampler2D uSampler;
uniform sampler2D uBumpSampler;
uniform vec4 uColor;
uniform vec4 uLightColor;
uniform vec4 uAmbientColor;
uniform vec4 uLightSpecular;
uniform float uMaterialShininess;
uniform vec4 uMaterialSpecular;
uniform bool uBumMap; // true if the bump map is activeted, false otherwise.
uniform float uLightShininess; // The light shininess effect, the more, the smaller is the light.
uniform float uPI;

varying vec2 vTexCoords;
varying vec3 vVertexNormal;
varying vec3 vTangentVertexPosition;
varying vec3 vTangentLightPos;

void main(void) {


    vec3 normal = vVertexNormal;
    if(uBumMap)
    {
        // Bump map value.
        normal = texture2D(uBumpSampler, vTexCoords).rgb;
        normal = normal * 2.0 - 1.0;
        normal = normalize(normal);
    }

    // Light direction
    vec3 lightDir = normalize(vTangentLightPos - vTangentVertexPosition);
    // Weight of the color (Lamberian).
    float weight = max(dot(normal, lightDir), 0.0);

    // Texture color.
    vec4 texColor = texture2D(uSampler, vTexCoords);

    float n = 10. * uLightShininess * uLightShininess * 2.0;

    vec3 bissectriceDir = lightDir + vec3(0, 0, 0)/* player position*/;
    float weightSpec = pow(max(dot(normal, bissectriceDir), 0.0), n);

    /* For the old formula
    vec3 directionBissectrice = lightDir + vec3(0, 0, 0); // lightDir + player position
    float weightSpec = pow(max(dot(normal, directionBissectrice), 0.0), uMaterialShininess);
    */

    // BlinnPhong formula by MESEURE Philippe.
    // ColorFrag = (lightAmb + lightDiff * (normal . lightDir)) * colorMaterial + lightSpec * ((normal . playerPos)^ shininess) * colorSpec
    //vec3 fragColor = texColor.rgb * (uAmbientColor.rgb + weight * uLightColor.rgb) + uLightSpecular.rgb * weightSpec * uMaterialSpecular.rgb;

    // Course Formula.
    vec3 fragColor = uLightColor.rgb * ((1. - uLightSpecular.rgb) * texColor.rgb + ((8. + n) / (8. * uPI)) * uLightSpecular.rgb * weightSpec) * weight;

    gl_FragColor = vec4(fragColor, texColor.a);
}