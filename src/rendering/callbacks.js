

// =====================================================
// Mouse management
// =====================================================
let mouseDown = false;
let lastMouseX = null;
let lastMouseY = null;
let rotY = 0;
let rotX = -1;
const DEFAULT_MAX_Z = -30;

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
	distCENTER[2] -= event.deltaY / 100.0;
	distCENTER[2] = Math.min(distCENTER[2], DEFAULT_MAX_Z);
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

	const newX = event.clientX;
	const newY = event.clientY;
	const deltaX = newX - lastMouseX;
	const deltaY = newY - lastMouseY;

	if (event.shiftKey) {
		distCENTER[2] += deltaY / 100.0;
		distCENTER[2] =Math.min(distCENTER[2], DEFAULT_MAX_Z); // Ensure distCENTER[2] stays -2
	}else {

		rotY += degToRad(deltaX / 5);
		rotX += degToRad(deltaY / 5);

		// Limit the rotation around the x-axis to the range -PI/2 to PI/2
		rotX = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, rotX));

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
			distCENTER[2] = Math.min(distCENTER[2], DEFAULT_MAX_Z); // Ensure distCENTER[2] -2
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
let DEFAULT_DISTCENTER = [0, -2, -35];

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