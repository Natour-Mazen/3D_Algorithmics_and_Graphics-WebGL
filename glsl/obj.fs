// Object fragment shader.
precision mediump float;

uniform vec4 uColor; // Color of the material.
uniform vec4 uAmbientLight; // The ambiant light.
uniform vec4 uLightColor; // The color light.
uniform vec3 uLightPosition; // Position of the light.
uniform float uLightIntensity; // The light intensity.
uniform float uPI;
uniform vec4 uLightSpecular;
uniform float uLightShininess;
uniform bool uIsPhongShader; // true if the shader is a phong shader, false otherwise.

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

	// OLD formula.
	//vec3 fragColor = uColor.rgb * (uAmbientLight.rgb + weight * uLightColor.rgb);

	vec3 fragColor;
	// Course Formula.
	if(uIsPhongShader){
		fragColor = phongLighting( // phongLighting function from glsl/common.glsl
			uLightShininess, // shininess
			lightDir, // lightDir
			uLightSpecular, // lightSpecular
			uLightColor, // lightColor
			uColor, // texColor or the color of the material
			uPI, // PI
			weight, // weight
			normal // normal
		);
	}else{
		fragColor = lambertLighting( // lambertLighting function from glsl/common.glsl
			uLightIntensity, // lightIntensity
			uLightColor, // lightColor
			uColor, // texColor the color of the material
			weight, // weight
			uPI // PI
		);
	}


	gl_FragColor = vec4(fragColor, 1.0);
}