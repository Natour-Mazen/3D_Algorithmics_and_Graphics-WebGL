// main.js
let gl;
let mvMatrix = mat4.create();
let pMatrix = mat4.create();
let rotMatrix = mat4.create();
let distCENTER;
let main_plane;
let main_objectsToDraw = [];


const canvasID = 'WebGL-canvas';


function initGL(canvas) {
    try {
        gl = canvas.getContext("webgl2");
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


/**
 * Draw the scene
 */
function drawScene() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    for (const obj of main_objectsToDraw) {
        if(obj !== null){
            if (obj instanceof plane) {
                if (isTherePlane) {
                    obj.draw();
                }
            } else if (obj instanceof heightMap) {
                if(isThereHeightMap){
                    obj.draw();
                }

            }else {
                obj.draw();
            }
            obj.setColor(obj.color);
        }
    }
}

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

    distCENTER = vec3.create([0, 0, -25]);

    main_plane = new plane();

    main_objectsToDraw.push(main_plane);

    tick();
}



