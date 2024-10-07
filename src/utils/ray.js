class Ray {

    constructor() {
        // The light position in the world (vec3).
        this.lightPosition = [0.0, 0.0, 10.0];
        // The ambient light in the world (vec4).
        this.lightAmbient = [0.1, 0.1, 0.1, 0.1];
        // The light color in the world (vec4).
        this.lightColor = [1.0, 1.0, 1.0, 1.0];
        // The light specular in the world (vec4).
        this.lightSpecular = [0.1, 0.1, 0.1, 1.0];
        // The material specular (vec4).
        this.materialSpecular = [1.0, 1.0, 1.0, 1.0];
        // The shininess of the material (float).
        this.materialShininess = 1000.0;
    }

    // Getters
    getLightPosition() {
        return this.lightPosition;
    }

    getLightAmbient() {
        return this.lightAmbient;
    }

    getLightColor() {
        return this.lightColor;
    }

    getLightSpecular() {
        return this.lightSpecular;
    }

    getMaterialSpecular() {
        return this.materialSpecular;
    }

    getMaterialShininess() {
        return this.materialShininess;
    }

    // Setters
    setLightPosition(position) {
        this.lightPosition = position;
    }

    setLightAmbient(ambient) {
        this.lightAmbient = ambient;
    }

    setLightColor(color) {
        this.lightColor = color;
    }

    setLightSpecular(specular) {
        this.lightSpecular = specular;
    }

    setMaterialSpecular(specular) {
        this.materialSpecular = specular;
    }

    setMaterialShininess(shininess) {
        this.materialShininess = shininess;
    }

}