precision mediump float;

uniform vec4 uColor; // Color of the material.
uniform vec4 uAmbientLight; // The ambiant light.
uniform vec4 uLightColor; // The color light.
uniform vec3 uLightPosition; // Position of the light.
uniform float uPI;
uniform float uLightIntensity; // The light intensity.

varying vec3 vVertexPosition;
varying vec3 vVertexNormal;

const int MAX_ITERATIONS = 100;

void main(void)
{
    // The void color.
    vec3 color = vec3(0.7, 0.7, 0.7);

    vec3 lightDirection = vVertexPosition;

    float division = dot(lightDirection, vVertexNormal);
    if(division != 0.)
    {
        vec3 cameraPos = vec3(0., 0., 0.);
        float lambda = (dot(vVertexPosition, vVertexNormal) - dot(cameraPos, vVertexNormal)) / division;

        vec3 point = cameraPos + lightDirection * lambda;

        for (int i = 0; i < MAX_ITERATIONS; i++)
        {
            point += lightDirection * 0.1;
            if (point.z <= 0.)
            {
                const float boxX = 10.;
                const float boxY = 1.;
                if (-boxX < point.x && point.x < boxX && -boxY < point.y && point.y < boxY)
                //if(-box < point.x && point.x < box)
                //if(-box < point.z && point.z < box)
                //if(-box < point.y && point.y < box)
                {
                    color = uColor.rgb;
                }
                break;
            }
        }
    }

    // We normalize the normals.
    vec3 normal = normalize(vVertexNormal);

    // Light direction.
    vec3 lightDir = normalize(uLightPosition - vVertexPosition);
    // Weight of the color.
    float weight = max(dot(normal, lightDir), 0.0);

    vec3 fragColor = uLightColor.rgb * color * (1.0 / uPI) * weight * uLightIntensity;

    gl_FragColor = vec4(fragColor, 1.0);
}