// Fragment Shader
precision mediump float;

uniform sampler2D uSampler;
uniform vec3 uColor;

varying vec4 pos3D;
varying vec3 N;
varying vec2 vTexCoord;
varying float vHeight;


void main(void)
{
    vec3 col = uColor * dot(N,normalize(vec3(-pos3D))); // Lambert rendering, eye light source
    vec4 textureColor = texture2D(uSampler, vTexCoord);

    // Color in function of the height.
    float heightNorm = clamp(vHeight, 0.0, 1.0);

    vec3 sandColor = vec3(1.0, 1.0, 0.3);
    vec3 planeColor = vec3(0.5, 0.9, 0.6);
    vec3 forestColor = vec3(0.33, 0.7, 0.4);
    vec3 stoneColor = vec3(0.5, 0.5, 0.5);
    vec3 snowColor = vec3(1.0, 1.0, 1.0);

    vec3 finalColor;

    // Transitions progressives entre les différentes couleurs
    if (heightNorm < 0.02) { // 0.0 / 0.02 > 0.02
        finalColor = sandColor;
    }
    else if (heightNorm < 0.05) { // 0.02 / 0.5 > 0.03
        float factor = (heightNorm - 0.02) / 0.03;
        finalColor = mix(sandColor, planeColor, factor);
    }
    else if (heightNorm < 0.2) { // 0.05 / 0.2 > 0.2
         finalColor = planeColor;
    }
    else if (heightNorm < 0.3) { // 0.2 / 0.3 > 0.1
        float factor = (heightNorm - 0.2) / 0.1;
        finalColor = mix(planeColor, forestColor, factor);
    }
    else if (heightNorm < 0.6) { // 0.4 / 0.6 > 0.2
         finalColor = forestColor;
    }
    else if (heightNorm < 0.8) { // 0.6 / 0.8 > 0.2
        float factor = (heightNorm - 0.6) / 0.2;
        finalColor = mix(forestColor, stoneColor, factor);
    }
    else if (heightNorm < 0.90){ // 0.8 / 0.9 > 0.1
        float factor = (heightNorm - 0.8) / 0.1;
        finalColor = mix(stoneColor, snowColor, factor);
    }
    else {
        finalColor = snowColor;
    }

    gl_FragColor =  vec4(col,1.0) * textureColor * vec4(finalColor, 1.0);
}