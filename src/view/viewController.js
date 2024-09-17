
class viewController {

    constructor() {
        this.OBJECT             = null;
        this.COLOR              = Color.BLACK;
    }

    // Environment
    setObject(objectName) {
        this.OBJECT = new objmesh(objectName);
    }

    setScale(scale) {
        if (this.OBJECT) {
            this.OBJECT.setScale(scale);
        }
    }

    setColor(color) {
        let newColor = Color.hextoRGB(color);
        this.COLOR = newColor.toArray();
        if (this.OBJECT) {
            this.OBJECT.setColor(this.COLOR);
        }
    }

    getColor() {
        return this.COLOR;
    }
}

const CONTROLLER = new viewController();