// main.js
let gl;
let mvMatrix = mat4.create();
let pMatrix = mat4.create();
let rotMatrix = mat4.create();
let distCENTER;
let main_plane;
let main_objectsToDraw = [];
// The light position in the world (vec3).
let lightPosition = [0.0, 0.0, 0.0];
// The ambient light in the world (vec4).
//let lightAmbient = [0.1, 0.1, 0.1, 0.1];
let lightAmbient = [0.1, 0.1, 0.1, 0.1];
// The light color in the world (vec4).
let lightColor = [0.8, 0.8, 0.8, 1.0];
// The light specular in the world (vec4).
let lightSpecular = [1.0, 1.0, 1.0, 1.0];
// The material specular (vec4).
let materialSpecular = [1.0, 1.0, 1.0, 1.0];
// The shininess of the material (float).
let materialShininess = 1000.0;

const canvasID = 'WebGL-canvas';

// =====================================================
function resizeCanvas() {
    const canvas = document.getElementById(canvasID);
    const padding = 9 * 2;
    canvas.width = window.innerWidth - padding;
    canvas.height = window.innerHeight - padding;

    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
    gl.viewport(0, 0, canvas.width, canvas.height);

    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
}

window.addEventListener('load', resizeCanvas);
window.addEventListener('resize', resizeCanvas);

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
    for (const obj of main_objectsToDraw) {
        if(obj !== null){
            if (obj instanceof plane) {
                if(obj instanceof bumpMap){
                    obj.draw();
                }else{
                    if (isTherePlane) {
                        obj.draw();
                    }
                }
            }else {
                obj.draw();
            }
            obj.setColor(obj.color);
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

    main_plane = new plane();
    cube = new boundingBox();

    main_objectsToDraw.push(main_plane, cube);

    tick();
}



