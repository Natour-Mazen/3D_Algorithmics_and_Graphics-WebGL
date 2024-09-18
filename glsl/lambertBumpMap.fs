// Fragment Shader
precision mediump float;

varying vec2 texCoords;
varying vec3 vTransformedNormal;
varying vec4 vPosition;

uniform sampler2D uSampler;       // Texture principale
uniform sampler2D uBumpSampler;   // Bump map
uniform vec3 uLightDirection;     // Direction de la lumière
uniform vec3 uColor;              // Couleur de l'objet

void main(void) {
    // Normalise la direction de la lumière
    vec3 lightDirection = normalize(uLightDirection);

    // Récupère la couleur de la bump map
    vec3 bumpColor = texture2D(uBumpSampler, texCoords).rgb;

    // Calcule la normale perturbée en fonction de la bump map
    vec3 normal = normalize(bumpColor * 2.0 - 1.0); // Convertit les valeurs de [0, 1] à [-1, 1]
    float darknessFactor = bumpColor.r; // Supposons que le canal rouge représente l'obscurité
    normal *= darknessFactor; // Ajuste la normale en fonction de l'obscurité

    // Combine la normale perturbée avec la normale transformée
    vec3 perturbedNormal = normalize(vTransformedNormal + normal);

    // Calcule l'éclairage de Lambert
    float lambertian = max(dot(perturbedNormal, lightDirection), 0.0);
    vec3 lightWeighting = vec3(1.0, 1.0, 1.0) * lambertian;

    // Récupère la couleur de la texture principale
    vec4 fragmentColor = texture2D(uSampler, texCoords);

    // Combine la couleur de la texture principale, l'éclairage et la couleur de l'objet
    vec3 finalColor = fragmentColor.rgb * lightWeighting * uColor;

    // Définir la couleur finale du fragment
    gl_FragColor = vec4(finalColor, fragmentColor.a);
}