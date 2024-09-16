// shaders.js
function loadShaders(Obj3D) {
    loadShaderText(Obj3D, '.vs');
    loadShaderText(Obj3D, '.fs');
}

function loadShaderText(Obj3D, ext) {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            if (ext === '.vs') { Obj3D.vsTxt = xhttp.responseText; Obj3D.loaded++; }
            if (ext === '.fs') { Obj3D.fsTxt = xhttp.responseText; Obj3D.loaded++; }
            if (Obj3D.loaded === 2) {
                Obj3D.loaded++;
                compileShaders(Obj3D);
                Obj3D.loaded++;
            }
        }
    }

    Obj3D.loaded = 0;
    xhttp.open("GET", Obj3D.shaderName + ext, true);
    xhttp.send();
}

function compileShaders(Obj3D) {
    Obj3D.vshader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(Obj3D.vshader, Obj3D.vsTxt);
    gl.compileShader(Obj3D.vshader);
    if (!gl.getShaderParameter(Obj3D.vshader, gl.COMPILE_STATUS)) {
        console.log("Vertex Shader FAILED... " + Obj3D.shaderName + ".vs");
        console.log(gl.getShaderInfoLog(Obj3D.vshader));
    }

    Obj3D.fshader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(Obj3D.fshader, Obj3D.fsTxt);
    gl.compileShader(Obj3D.fshader);
    if (!gl.getShaderParameter(Obj3D.fshader, gl.COMPILE_STATUS)) {
        console.log("Fragment Shader FAILED... " + Obj3D.shaderName + ".fs");
        console.log(gl.getShaderInfoLog(Obj3D.fshader));
    }

    Obj3D.shader = gl.createProgram();
    gl.attachShader(Obj3D.shader, Obj3D.vshader);
    gl.attachShader(Obj3D.shader, Obj3D.fshader);
    gl.linkProgram(Obj3D.shader);
    if (!gl.getProgramParameter(Obj3D.shader, gl.LINK_STATUS)) {
        console.log("Could not initialise shaders");
        console.log(gl.getShaderInfoLog(Obj3D.shader));
    }
}