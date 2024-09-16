// objLoader.js
function loadObjFile(OBJ3D) {
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {
    if (xhttp.readyState === 4 && xhttp.status === 200) {
      var tmpMesh = new OBJ.Mesh(xhttp.responseText);
      OBJ.initMeshBuffers(gl, tmpMesh);
      OBJ3D.mesh = tmpMesh;
    }
  }

  xhttp.open("GET", OBJ3D.objName, true);
  xhttp.send();
}