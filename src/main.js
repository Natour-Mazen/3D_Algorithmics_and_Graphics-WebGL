// main.js
let gl;
let mvMatrix = mat4.create();
let pMatrix = mat4.create();
let rotMatrix = mat4.create();
let distCENTER;
let main_plane;
let main_objectsToDraw = [];
let main_light = new Light();
let main_aspectRatio = 1;
let main_FOV = 45;


const canvasID = 'WebGL-canvas';
const paddingCanvas = 18;
// =====================================================
function resizeCanvas() {
    const canvas = doc.getElementById(canvasID);

    canvas.width = window.innerWidth - paddingCanvas;
    canvas.height = window.innerHeight - paddingCanvas;

    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
    gl.viewport(0, 0, canvas.width, canvas.height);

    // a : fov
    // b : aspect ratio
    // c : zNear
    // d : zFar
    main_aspectRatio = gl.viewportWidth / gl.viewportHeight;
    mat4.perspective(main_FOV, main_aspectRatio, 0.1, 250.0, pMatrix);
}

window.addEventListener('load', resizeCanvas);
window.addEventListener('resize', resizeCanvas);

window.addEventListener('scroll', () => {
    const canvas = doc.getElementById(canvasID);
    if(openDropdowns.length === 2){
        canvas.height = window.innerHeight + window.scrollY * 2.05 - paddingCanvas;
        canvas.maxHeight = '1080'
    }else {
        canvas.height = window.innerHeight - paddingCanvas;
    }
});


// =====================================================

function initGL(canvas) {
    try {
        gl = canvas.getContext("webgl2");
        if (!gl) {
            console.log("WebGL 2.0 not supported.");
        } else {
            console.log("WebGL 2.0 supported.");
        }
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
        gl.viewport(0, 0, canvas.width, canvas.height);

        gl.clearColor(0.7, 0.7, 0.7, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);
    } catch (e) {}
    if (!gl) {
        console.log("Could not initialise WebGL");
    }
    console.log("Vendor graphic card: %s\n", gl.getParameter(gl.VENDOR));
    console.log("Renderer: %s\n", gl.getParameter(gl.RENDERER));
    console.log("Version GL: %s\n", gl.getParameter(gl.VERSION));
    console.log("Version GLSL: %s\n", gl.getParameter(gl.SHADING_LANGUAGE_VERSION));
}

// =====================================================

/**
 * Draw the scene
 */
function drawScene() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    for (const object of main_objectsToDraw) {
        if(object !== null){
            if(object.getLight() === null){
                object.setLight(main_light);
            }
            object.draw();
        }
    }
}

// =====================================================

/**
 * Update the scene, called every frame.
 */
function webGLStart() {
    const canvas = document.getElementById(canvasID);
    canvas.onmousedown = handleMouseDown;
    document.onmouseup = handleMouseUp;
    document.onmousemove = handleMouseMove;
    canvas.onwheel = handleMouseWheel;

    initGL(canvas);
    resizeCanvas();


    mat4.identity(rotMatrix);
    mat4.rotate(rotMatrix, rotX, [1, 0, 0]);
    mat4.rotate(rotMatrix, rotY, [0, 0, 1]);

    distCENTER = vec3.create(DEFAULT_DISTCENTER);
    updateCoordinates();

    main_plane = new Plane();

    main_objectsToDraw.push(main_plane);

    updateTheDefaultLightIntensitySliderValue(main_light.getLightIntensity());
    updateTheDefaultLightShininessSliderValue(main_light.getLightShininess());

    tick();
}



