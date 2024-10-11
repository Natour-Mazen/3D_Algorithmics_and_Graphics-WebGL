attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;

uniform mat4 uRMatrix;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

varying vec3 vVertexPosition;
varying vec3 vVertexNormal;
varying float vLambda;
varying vec2 vTexturePosition;

const int MAX_ITERATIONS = 100;

vec3 loop(vec3 startingPoint, vec3 lightDirection);
vec3 bigLoop(vec3 startingPoint, vec3 lightDirection);

void main(void) {
    vec4 vertexPosition = uMVMatrix * vec4(aVertexPosition,1.0);
    vVertexPosition = vertexPosition.xyz;
    vVertexNormal = vec3(uRMatrix * vec4(aVertexNormal,1.0));

    vec3 lightDirection = vVertexPosition.xyz;

    float division = dot(lightDirection, vVertexNormal);
    if(division == 0.){
        vLambda -1.;
    }
    else
    {
        // vec3(0., 0., 0.) player position.
        vLambda = dot(vVertexPosition, vVertexNormal) - dot(vec3(0., 0., 0.), vVertexNormal) / division;

        vec3 point = vec3(0., 0., 0.) + lightDirection * vLambda;

        vLambda = -1.;

        for (int i = 0; i < MAX_ITERATIONS; i++)
        {
            point = vec3(0., 0., 0.) + lightDirection * 0.01;
            if(point.x > -0.1 && point.x < 0.1 && point.y > -0.1 && point.y < 0.1 && point.z <= 0.)
            {
                vLambda = 1.;
            }
        }
    }


    gl_Position = uPMatrix * vertexPosition;
}


// TODO : Faire le shader de lambert
// TODO : Faire le calcul pour savoir si le ray touche la boite
// TODO : Dans le Frag, regarder si le point d'intersection avec la boite est en dessous ou au dessus de la bump map
// TODO : Dans le Frag, (si non on affiche rien, la couleur du fond), si oui on fait Bresenham pour avoir la ligne sur la height map.
// TODO : Dnas le Frag, passer par tout les points de la ligne et voir si en avançant le point en même temps que la ligne
// si on est à la même hauteur que la height map.