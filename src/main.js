// main.js
let gl;
let mvMatrix = mat4.create();
let pMatrix = mat4.create();
let rotMatrix = mat4.create();
let distCENTER;
let OBJ1 = null;
let PLANE = null;

function webGLStart() {
    const canvas = document.getElementById("WebGL-test");
    canvas.onmousedown = handleMouseDown;
    document.onmouseup = handleMouseUp;
    document.onmousemove = handleMouseMove;
    canvas.onwheel = handleMouseWheel;

    initGL(canvas);

    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
    mat4.identity(rotMatrix);
    mat4.rotate(rotMatrix, rotX, [1, 0, 0]);
    mat4.rotate(rotMatrix, rotY, [0, 0, 1]);

    distCENTER = vec3.create([0, -0.2, -3]);

    PLANE = new plane();
    OBJ1 = new objmesh('res/obj/bunny.obj');

    tick();
}

function drawScene() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  PLANE.draw();
  OBJ1.draw();
}