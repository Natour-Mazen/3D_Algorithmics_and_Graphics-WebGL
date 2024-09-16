
precision mediump float;

varying vec4 pos3D;
varying vec3 N;
uniform vec3 uColor;



// ==============================================
void main(void)
{
	vec3 col = uColor * dot(N,normalize(vec3(-pos3D))); // Lambert rendering, eye light source
	gl_FragColor = vec4(col,1.0);
}




