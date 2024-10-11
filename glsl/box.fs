precision mediump float;

uniform vec4 uColor; // Color of the material.
uniform vec4 uAmbientLight; // The ambiant light.
uniform vec4 uLightColor; // The color light.
uniform vec3 uLightPosition; // Position of the light.
uniform float uPI;
uniform float uLightIntensity; // The light intensity.

varying vec3 vVertexPosition;
varying vec3 vVertexNormal;

const int MAX_ITERATIONS = 1000;

void main(void)
{
    vec3 color = uColor.rgb;

    vec3 lightDirection = vVertexPosition;

    float division = dot(lightDirection, vVertexNormal);
    if(division == 0.){
        color = vec3(0.7, 0.7, 0.7);
    }
    else
    {
        // vec3(0., 0., 0.) player position.
        float lambda = dot(vVertexPosition, vVertexNormal) - dot(vec3(0., 0., 0.), vVertexNormal) / division;

        vec3 point = vec3(0., 0., 0.) + lightDirection * lambda;

        color = vec3(0.7, 0.7, 0.7);


        for (int i = 0; i < MAX_ITERATIONS; i++)
        {
            point += lightDirection * 0.01;
            if(point.z <= 0.)
            {
                if(point.x > -1. && point.x < 1. && point.y > -1. && point.y < 1.)
                {
                    color = uColor.rgb;
                }
                else
                {
                    break;
                }
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