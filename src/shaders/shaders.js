// shaders.js
function loadShaders(Obj3D) {
    loadCommonShader(Obj3D, function() {
        loadShaderText(Obj3D, '.vs');
        loadShaderText(Obj3D, '.fs');
    });
    // loadShaderText(Obj3D, '.vs');
    // loadShaderText(Obj3D, '.fs');
}

function loadShaderText(Obj3D, ext) {
    const xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            if (ext === '.vs') { Obj3D.vsTxt = xhttp.responseText; Obj3D.loaded++; }
            if (ext === '.fs') { Obj3D.fsTxt = xhttp.responseText; Obj3D.loaded++; }
            if (Obj3D.loaded === 2) {
                Obj3D.loaded++;
                const commonCode = Obj3D.commonTxt;
                //Obj3D.vsTxt = injectCommonCode(Obj3D.vsTxt, commonCode);
                Obj3D.fsTxt = injectCommonCode(Obj3D.fsTxt, commonCode);
                compileShaders(Obj3D);
                Obj3D.loaded++;
            }
        }
    }

    Obj3D.loaded = 0;
    xhttp.open("GET", Obj3D.shaderName + ext, true);
    xhttp.overrideMimeType("text/plain")
    xhttp.send();
}

function injectCommonCode(shaderCode, commonCode) {
    const mainIndex = shaderCode.indexOf("void main(void)");
    if (mainIndex !== -1) {
        const beforeMain = shaderCode.substring(0, mainIndex);
        const afterMain = shaderCode.substring(mainIndex);
        return beforeMain + commonCode + "\n" + afterMain + "\n" ;
    }
    return shaderCode;
}

function loadCommonShader(Obj3D, callback) {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            Obj3D.commonTxt = xhttp.responseText;
            callback();
        }
    };
    xhttp.open("GET", "glsl/common.glsl", true);
    xhttp.overrideMimeType("text/plain");
    xhttp.send();
}

function compileShaders(Obj3D) {

    console.log("Compiling shaders for " + Obj3D.shaderName);
    console.log(Obj3D.vsTxt);
    console.log(Obj3D.fsTxt);


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