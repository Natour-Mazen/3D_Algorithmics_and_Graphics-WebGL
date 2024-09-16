// main.js
let gl;
let mvMatrix = mat4.create();
let pMatrix = mat4.create();
let rotMatrix = mat4.create();
let distCENTER;
let objectsToDraw = [];

const canvasID = 'WebGL-canvas';


function initGL(canvas) {
    try {
        gl = canvas.getContext("experimental-webgl");
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
}

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

function drawScene() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    for (const obj of objectsToDraw) {
        obj.draw();
    }
}

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

    distCENTER = vec3.create([0, -0.2, -10]);

    const Plane = new plane();
    //const Bunny = new objmesh('res/obj/bunny.obj',5, Color.BROWN );
    const Porsche = new objmesh('res/obj/porsche.obj',10, Color.CYAN);

    objectsToDraw.push(Plane, Porsche);

    tick();
}



