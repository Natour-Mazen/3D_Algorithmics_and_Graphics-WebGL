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

    // Récupère la normale perturbée à partir de la bump map
    vec3 normal = texture2D(uBumpSampler, texCoords).rgb;
    normal = normalize(normal * 2.0 - 1.0); // Convertit les valeurs de [0, 1] à [-1, 1]

    // Combine la normale perturbée avec la normale transformée
    vec3 perturbedNormal = normalize(vTransformedNormal + normal);

    // Calcule l'éclairage de Lambert
    float lambertian = max(dot(perturbedNormal, lightDirection), 0.0);
    vec3 lightWeighting = vec3(1.0, 1.0, 1.0) * lambertian;

    // Récupère la couleur de la texture principale
    vec4 fragmentColor = texture2D(uSampler, texCoords);

    // Calcule le décalage de parallaxe
    float heightScale = 0.1; // Ajustez cette valeur pour contrôler l'effet de profondeur
    float height = normal.r; // Supposons que le canal rouge représente la hauteur
    vec2 parallaxOffset = vPosition.xy * (height * heightScale);

    // Ajuste les coordonnées de texture avec le décalage de parallaxe
    vec2 parallaxTexCoords = texCoords + parallaxOffset;

    // Échantillonne la texture avec les coordonnées ajustées
    vec4 texColor = texture2D(uSampler, parallaxTexCoords);

    // Récupère la couleur de la bump map pour ajuster la couleur finale
    float darknessFactor = 1.0 - normal.r;
    vec3 adjustedColor = texColor.rgb * (1.0 - darknessFactor * 0.5);

    // Combine la couleur ajustée, l'éclairage et la couleur de l'objet
    vec3 finalColor = adjustedColor * lightWeighting * uColor;

    // Définir la couleur finale du fragment
    gl_FragColor = vec4(finalColor, fragmentColor.a);
}