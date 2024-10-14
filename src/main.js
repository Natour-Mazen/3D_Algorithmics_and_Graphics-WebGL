// main.js
let gl;
let mvMatrix = mat4.create();
let pMatrix = mat4.create();
let rotMatrix = mat4.create();
let distCENTER;
let main_plane;
let main_objectsToDraw = [];
let main_light = new Light();


const canvasID = 'WebGL-canvas';

// =====================================================
function resizeCanvas() {
    const canvas = doc.getElementById(canvasID);
    const padding = 18;
    //canvas.width = window.innerWidth - padding;
    //canvas.height = window.innerHeight - padding;
    canvas.width = 1280 - padding;
    canvas.height = 720 - padding;

    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
    gl.viewport(0, 0, canvas.width, canvas.height);

    // a : fov
    // b : aspect ratio
    // c : zNear
    // d : zFar
    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
}

window.addEventListener('load', resizeCanvas);
window.addEventListener('resize', resizeCanvas);
window.addEventListener('scroll', resizeCanvas);

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

    tick();
}



