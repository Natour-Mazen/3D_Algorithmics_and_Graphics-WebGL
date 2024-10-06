// Object fragment shader.
precision mediump float;

uniform vec4 uColor; // Color of the material.
uniform vec4 uAmbientLight; // The ambiant light.
uniform vec4 uLightColor; // The color light.
uniform vec3 uLightPosition; // Position of the light.

varying vec4 vVertexPosition;
varying vec3 vVertexNormal;

void main(void)
{
	// We normalize the normals.
	vec3 normal = normalize(vVertexNormal);

	// Light direction.
	vec3 lightDir = normalize(uLightPosition - vVertexPosition.xyz);
	// Weight of the color.
	float weight = max(dot(normal, lightDir), 0.0);

	vec3 fragColor = uColor.rgb * (uAmbientLight.rgb + weight * uLightColor.rgb);

	gl_FragColor = vec4(fragColor, 1.0);
}