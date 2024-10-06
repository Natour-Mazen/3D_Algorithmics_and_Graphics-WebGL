class Color {
    static RED =        [1.0, 0.0, 0.0, 1.0];
    static GREEN =      [0.0, 1.0, 0.0, 1.0];
    static BLUE =       [0.0, 0.0, 1.0, 1.0];
    static YELLOW =     [1.0, 1.0, 0.0, 1.0];
    static CYAN =       [0.0, 1.0, 1.0, 1.0];
    static MAGENTA =    [1.0, 0.0, 1.0, 1.0];
    static WHITE =      [1.0, 1.0, 1.0, 1.0];
    static BLACK =      [0.0, 0.0, 0.0, 1.0];
    static ORANGE =     [1.0, 0.5, 0.0, 1.0];
    static PURPLE =     [0.5, 0.0, 0.5, 1.0];
    static PINK =       [1.0, 0.75, 0.8, 1.0];
    static BROWN =      [0.6, 0.3, 0.0, 1.0];
    static GREY =       [0.5, 0.5, 0.5, 1.0];
    static LIGHT_BLUE = [0.68, 0.85, 0.9, 1.0];
    static DARK_GREEN = [0.0, 0.39, 0.0, 1.0];
    static LIGHT_GREEN = [0.56, 0.93, 0.56, 1.0];
    static GOLD =       [1.0, 0.84, 0.0, 1.0];
    static SILVER =     [0.75, 0.75, 0.75, 1.0];
    static BRONZE =     [0.8, 0.5, 0.2, 1.0];
    static NAVY =       [0.0, 0.0, 0.5, 1.0];
    static TEAL =       [0.0, 0.5, 0.5, 1.0];
    static LIME =       [0.0, 1.0, 0.0, 1.0];
    static INDIGO =     [0.29, 0.0, 0.51, 1.0];
    static VIOLET =     [0.93, 0.51, 0.93, 1.0];
    static TURQUOISE =  [0.25, 0.88, 0.82, 1.0];
    static BEIGE =      [0.96, 0.96, 0.86, 1.0];
    static MINT =       [0.6, 1.0, 0.6, 1.0];
    static CORAL =      [1.0, 0.5, 0.31, 1.0];
    static SALMON =     [0.98, 0.5, 0.45, 1.0];
    static KHAKI =      [0.76, 0.69, 0.57, 1.0];
    static PLUM =       [0.87, 0.63, 0.87, 1.0];

    constructor(r, g, b, a = 1.0) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    toArray() {
        return [this.r, this.g, this.b, this.a];
    }

    static hextoRGB(hex) {
        hex = hex.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16) / 255;
        const g = parseInt(hex.substring(2, 4), 16) / 255;
        const b = parseInt(hex.substring(4, 6), 16) / 255;
        return new Color(r, g, b);
    }

}