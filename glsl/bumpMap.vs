// Lambert Vertex shader.
attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec3 aVertexTangent;
attribute vec2 aTexCoords;

uniform mat4 uMVMatrix; // Model View Matrix.
uniform mat4 uPMatrix; // Projection Matrix.
uniform mat4 uRMatrix; // Normal Matrix.
uniform vec3 uLightPosition; // Position of the light.

varying vec3 vVertexNormal;
varying vec2 vTexCoords;
varying vec3 vTangentVertexPosition;
varying vec3 vTangentLightPos;

mat3 transpose(mat3 m);
mat3 inverse(mat3 m);

void main(void)
{
    vec4 vertexPosition = uMVMatrix * vec4(aVertexPosition, 1.0);
    vVertexNormal = normalize(aVertexNormal);
    vTexCoords = aTexCoords;

    // Calculation for the bump map.
    mat3 normalMatrix = transpose(inverse(mat3(uRMatrix)));
    vec3 T = normalize(normalMatrix * aVertexTangent);
    vec3 N = normalize(normalMatrix * aVertexNormal);
    T = normalize(T - dot(T, N) * N);
    vec3 B = cross(N, T);

    // We use the tangent space.
    mat3 TBN = transpose(mat3(T, B, N));
    vTangentVertexPosition = TBN * vertexPosition.xyz;
    vTangentLightPos = TBN * uLightPosition;

    gl_Position = uPMatrix * vertexPosition;
}

mat3 transpose(mat3 m)
{
    return mat3(
    m[0][0], m[1][0], m[2][0],
    m[0][1], m[1][1], m[2][1],
    m[0][2], m[1][2], m[2][2]
    );
}

mat3 inverse(mat3 m)
{
    float a = m[0][0], b = m[0][1], c = m[0][2];
    float d = m[1][0], e = m[1][1], f = m[1][2];
    float g = m[2][0], h = m[2][1], i = m[2][2];

    float det = a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);

    if (abs(det) < 1e-8) {
        return mat3(1.0);
    }

    mat3 adj;
    adj[0][0] =  (e * i - f * h);
    adj[0][1] = -(b * i - c * h);
    adj[0][2] =  (b * f - c * e);
    adj[1][0] = -(d * i - f * g);
    adj[1][1] =  (a * i - c * g);
    adj[1][2] = -(a * f - c * d);
    adj[2][0] =  (d * h - e * g);
    adj[2][1] = -(a * h - b * g);
    adj[2][2] =  (a * e - b * d);

    return adj / det;
}