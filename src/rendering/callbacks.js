

// =====================================================
// Mouse management
// =====================================================
var mouseDown = false;
var lastMouseX = null;
var lastMouseY = null;
var rotY = 0;
var rotX = -1;

// =====================================================
window.requestAnimFrame = (function()
{
	return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         window.oRequestAnimationFrame ||
         window.msRequestAnimationFrame ||
         function(/* function FrameRequestCallback */ callback,
									/* DOMElement Element */ element)
         {
            window.setTimeout(callback, 1000/60);
         };
})();

// ==========================================
function tick() {
	requestAnimFrame(tick);
	drawScene();
}

// =====================================================
function degToRad(degrees) {
	return degrees * Math.PI / 180;
}


// =====================================================
function handleMouseWheel(event) {

	distCENTER[2] -= event.deltaY/100.0;
	updateCoordinates();
}

// =====================================================
function handleMouseDown(event) {
	mouseDown = true;
	lastMouseX = event.clientX;
	lastMouseY = event.clientY;
}


// =====================================================
function handleMouseUp(event) {
	mouseDown = false;
}


// =====================================================
function handleMouseMove(event) {
	
	if (!mouseDown) return;

	var newX = event.clientX;
	var newY = event.clientY;	
	var deltaX = newX - lastMouseX;
	var deltaY = newY - lastMouseY;
	
	if(event.shiftKey) {
		distCENTER[2] += deltaY/100.0;
	} else {

		rotY += degToRad(deltaX / 5);
		rotX += degToRad(deltaY / 5);

		mat4.identity(rotMatrix);
		mat4.rotate(rotMatrix, rotX, [1, 0, 0]);
		mat4.rotate(rotMatrix, rotY, [0, 0, 1]);
	}
	
	lastMouseX = newX
	lastMouseY = newY;
}

// =====================================================
function handleKeyDown(event) {
	const key = event.key.toLowerCase();
	const moveSpeed = 1;

	switch (key) {
		case 'z': // Move forward
			distCENTER[2] += moveSpeed;
			break;
		case 's': // Move backward
			distCENTER[2] -= moveSpeed;
			break;
		case 'q': // Move left
			distCENTER[0] += moveSpeed;
			break;
		case 'd': // Move right
			distCENTER[0] -= moveSpeed;
			break;
		case ' ': // Move up (spacebar)
			distCENTER[1] -= moveSpeed;
			break;
		case 'shift': // Move down (shift key)
			distCENTER[1] += moveSpeed;
			break;
	}
	updateCoordinates();
}

doc.addEventListener('keydown', handleKeyDown);



// =====================================================
function updateCoordinates() {
	doc.getElementById('coordinate__content__data__x').innerText = `X: ${distCENTER[0].toFixed(2)}`;
	doc.getElementById('coordinate__content__data__y').innerText = `Y: ${distCENTER[1].toFixed(2)}`;
	doc.getElementById('coordinate__content__data__z').innerText = `Z: ${distCENTER[2].toFixed(2)}`;
}
let DEFAULT_DISTCENTER = [0, 0, -30];

function resetCoordinates() {
	distCENTER = vec3.create(DEFAULT_DISTCENTER)
	updateCoordinates();
}

doc.getElementById('reset_coordinate_btn').addEventListener('click', resetCoordinates);

// =====================================================

const tooltipCoordinates = doc.getElementById('tooltip__Coordinate');
const targetElementCoordinates = doc.getElementById('coordinate__InfosBtn');

targetElementCoordinates.addEventListener('mouseenter', () => {
	tooltipCoordinates.classList.add('show');
});

targetElementCoordinates.addEventListener('mouseleave', () => {
	tooltipCoordinates.classList.remove('show');
});