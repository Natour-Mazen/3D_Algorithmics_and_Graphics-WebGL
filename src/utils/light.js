class Light {

    constructor() {
        // The light position in the world (vec3).
        this.position = [0.0, 0.0, 10.0];
        // The light color in the world (vec4).
        this.color = [1.0, 1.0, 1.0, 1.0];
        // The light specular in the world (vec4).
        this.specular = [0.1, 0.1, 0.1, 1.0];
        // The material specular (vec4).
        this.materialSpecular = [1.0, 1.0, 1.0, 1.0];
        // The shininess of the material (float).
        this.materialShininess = 1000.0;
        // The light intensity
        this.intensity = 3.0;
    }

    // Getters
    getLightPosition() {
        return this.position;
    }

    getLightColor() {
        return this.color;
    }

    getLightSpecular() {
        return this.specular;
    }

    getMaterialSpecular() {
        return this.materialSpecular;
    }

    getMaterialShininess() {
        return this.materialShininess;
    }

    getLightIntensity() {
        return this.intensity;
    }

    // Setters
    setLightPosition(position) {
        this.position = position;
    }

    setLightColor(color) {
        this.color = color;
    }

    setLightSpecular(specular) {
        this.specular = specular;
    }

    setMaterialSpecular(specular) {
        this.materialSpecular = specular;
    }

    setMaterialShininess(shininess) {
        this.materialShininess = shininess;
    }

    setLightIntensity(intensity) {
        this.intensity = intensity;
    }

}