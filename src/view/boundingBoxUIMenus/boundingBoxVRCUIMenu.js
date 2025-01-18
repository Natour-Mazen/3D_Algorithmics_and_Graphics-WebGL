// src/view/boundingBoxUIMenu.js
/****************************************************/
/*         BOUNDING BOX GENERAL VARIABLES           */
/****************************************************/

/**
 * @type {Object}
 */
const boundingBoxVRCElements = {
    toggle: doc.getElementById('boundingBoxVRC_checkbox'),

    borderSelector: doc.getElementById('boundingBoxVRC_border_selector'),

    typeSelector: doc.getElementById('boundingBoxVRC_type_selector'),

    sizeSlider: doc.getElementById('boundingBoxVRC_size_slider'),
    sizeValueDisplay: doc.getElementById('boundingBoxVRC_size_value'),

    transferFuncCustomModal: doc.getElementById('boundingBoxVRC_transferFuncCustom_modal'),
    transferFuncCustomModalContent: doc.getElementById('boundingBoxVRC_transferFuncCustom_modalContent'),

    transferFuncSelector: doc.getElementById('boundingBoxVRC_voxelMap_transferFunc_selector'),

    voxelNoiseSlider: doc.getElementById('boundingBoxVRC_voxelMap_voxel-noise_slider'),
    voxelNoiseValueDisplay: doc.getElementById('boundingBoxVRC_voxelMap_voxel-noise_value'),

    voxelIntensitySlider: doc.getElementById('boundingBoxVRC_voxelMap_voxel-intensity'),
    voxelIntensityValueDisplay: doc.getElementById('boundingBoxVRC_voxelMap_voxel-intensity_value'),

    slicesDisplayButton: doc.getElementById('boundingBoxVRC_slicesDisplay'),

    slicesToDisplayCustomModal: doc.getElementById('boundingBoxVRC_slicesToDisplayCustom_modal'),
    slicesToDisplayCustomModalContent: doc.getElementById('boundingBoxVRC_slicesToDisplayCustom_modalContent'),
};

/****************************************************/
/*            BOUNDING BOX VRC VARIABLES            */
/****************************************************/

/**
 * @constant {Object[]}
 */
const boundingBoxVoxelMapTypeLoader = [
    {name: 'Hazelnut LQ', value: 'hazelnut_slices12x11_128x128.png', depth: 128., width: 12, height: 11}, // Low quality
    {name: 'Hazelnut NQ', value: 'hazelnut_slices16x16_256x256.png', depth: 256., width: 16, height: 16}, // Normal quality
    {name: 'Hazelnut HQ', value: 'hazelnut_slices23x23_512x512.png', depth: 512., width: 23, height: 23}, // High quality

    {name: 'Flower LQ', value: 'flower_slices12x11_128x128.png', depth: 128., width: 12, height: 11}, // Low quality
    {name: 'Flower NQ', value: 'flower_slices16x16_256x256.png', depth: 256., width: 16, height: 16}, // Normal quality
    {name: 'Flower HQ', value: 'flower_slices23x23_512x512.png', depth: 512., width: 23, height: 23}, // High quality

    {name: 'Beechnut LQ', value: 'beechnut_slices12x11_128x128.png', depth: 128., width: 12, height:11}, // Low quality
    {name: 'Beechnut NQ', value: 'beechnut_slices17x16_256x256.png', depth: 256., width: 17, height:16}, // Normal quality
    {name: 'Beechnut HQ', value: 'beechnut_slices23x23_512x512.png', depth: 512., width: 23, height:23}, // High quality

    {name: 'Woodbranch LQ', value: 'woodbranch_slices12x11_128x128.png', depth: 128., width: 12, height:11}, // Low quality
    {name: 'Woodbranch NQ', value: 'woodbranch_slices16x16_256x256.png', depth: 256., width: 16, height:16}, // Normal quality
    {name: 'Woodbranch HQ', value: 'woodbranch_slices23x23_512x512.png', depth: 512., width: 23, height:23}, // High quality
];

/**
 * @constant {Object[]}
 */
const boundingBoxVoxelMapTransferFuncLoader = [
    { name: 'Default', value: 0 },
    { name: 'Custom', value: 1 },
    { name: 'Red', value: 2 },
    { name: 'BleuToGreen', value: 3 },
    { name: 'Sepia', value: 4 },
    { name: 'Glitch', value: 5 },
    { name: 'Invert', value: 6 },
    { name: 'Heart Beat', value: 7 },
    { name: 'Thermal', value: 8},
    { name: 'Rainbow', value: 9 },
    { name: 'Red Jelly', value: 10 },
];

/**
 * @type {string|null}
 */
let boundingBoxVoxelMapType = null;

/**
 * @type {BoundingBoxVRC|null}
 */
let theVRCBoundingBox = null;

/**
 * @type {boolean}
 */
let isThereVRCBoundingBox = false;

/**
 * @type {Number[]}
 */
let boundingBoxVRCTransferFuncCustomValues = [
    1., 0., 0., 0., 0., // Red
    1., 1., 0., 1., 1., // Yellow
];

/**
 * @type {WebGLTexture|null}
 */
let boundingBoxVRCTransferFuncCustomTexture = null;


/**
 * @type {Number[]}
 */
let boundingBoxVRCSlicesToDisplay = [
    1., 1., 1., 1., 1., 1., 1., 1.
//Rouge,Vert,Bleu,Jaune,Rose,Cyan,Blanc,Gris
];

/**
 * @type {number} - The default voxel intensity for the bounding box.
 */
const boundingBoxVRCDefaultVoxelIntensity = 5;

/**
* @type {number} - The default voxel noise for the bounding box.
*/
const boundingBoxVRCDefaultVoxelNoise = 5;


/****************************************************/
/*            BOUNDING BOX VRC FUNCTIONS            */
/****************************************************/


/**
 * Creates or deletes bounding box objects based on the current state.
 * Filters out existing bounding box objects from the main objects to draw,
 * then creates new bounding box objects if necessary.
 *
 * @returns {Promise<void>} A promise that resolves when the bounding box objects have been created or deleted.
 */
async function handleCreateOrDeleteBoundingBoxVRCObjects() {
    const updateFunctions = {
        updateSize: handleUpdateBoundingBoxSize,
        updateSpecificProperties: (boundingBox, elements) => {
            boundingBox.setVoxelNoise(elements.voxelNoiseSlider.value);
            boundingBox.setVoxelIntensity(elements.voxelIntensitySlider.value);
        }
    };
    theVRCBoundingBox = await handleCreateOrDeleteBoundingBoxObjects(isThereVRCBoundingBox, BoundingBoxVRC, boundingBoxVRCElements, updateFunctions);
}

/**
 * Handles the bounding box voxel map selection.
 * @param selectedVoxelMap - The selected voxel map.
 */
function handleBoundingBoxVoxelMapSelection(selectedVoxelMap) {
    if (selectedVoxelMap === 'None' || selectedVoxelMap === '') {
        boundingBoxVoxelMapType = null;
        return;
    }

    const path = `res/voxelMaps/${selectedVoxelMap}`;

    if (path) {
        boundingBoxVoxelMapType = loadTexture(gl, path);
    }
}

/*****************************/
/*  BOUNDING BOX VRC MODALS  */
/*****************************/

function handleCreateModalBodyCustomTransferFunc() {
    createAndInitModal(
        boundingBoxVRCElements.transferFuncCustomModalContent,
        'Custom Transfer Function',
        getDefaultValues(),
        createModalRowCustomTransferFunc,
        null,
        (modalContent, body, header, footer) => {

            const buttonsDiv = document.createElement('div');
            buttonsDiv.style.display = 'flex';
            buttonsDiv.style.justifyContent = 'space-between';
            buttonsDiv.style.marginBottom = '15px';

            const addButton = document.createElement('button');
            addButton.innerText = 'Add a color';
            addButton.className = 'modal-footer-buttons'
            addButton.addEventListener('click', () => {
                // Crée une nouvelle ligne et l'ajoute au corps du modal
                const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
                // alpha et pos sont des valeurs aléatoires entre 0 et 1
                const randomAlpha = Math.random().toFixed(2);
                const randomPos = Math.random().toFixed(2);
                const newRow = createModalRowCustomTransferFunc({ color: randomColor, alpha: randomAlpha, position: randomPos });
                body.appendChild(newRow);
                saveTransferFunctionValues(false);
                reorderRowsByPosition();
            });

            const saveButton = document.createElement('button');
            saveButton.innerText = 'Save as PNG';
            saveButton.className = 'modal-footer-buttons'
            saveButton.addEventListener('click', () => {
                if(theVRCBoundingBox === null){
                    window.alert('You must create a bounding box to save the transfer function texture as png !');
                }else {
                   saveTextureAsPNG(boundingBoxVRCTransferFuncCustomTexture, 'transferFuncCustomTexture.png');
                }
            });

            buttonsDiv.appendChild(addButton);
            buttonsDiv.appendChild(saveButton);

            const imgDiv = document.createElement('div');
            imgDiv.style.display = 'flex';
            imgDiv.style.justifyContent = 'center';

            const imageLabel = document.createElement('span');
            imageLabel.innerText = 'Transfer Function Texture :';
            imageLabel.className = 'modal-label';

            const imageTexture = document.createElement('img');
            imageTexture.style.width = '100px';
            imageTexture.style.height = '50px';
            imageTexture.style.border = '3px ridge #a99f9f';
            imageTexture.style.borderRadius = '5px';

            imgDiv.appendChild(imageLabel);
            imgDiv.appendChild(imageTexture);

            footer.appendChild(buttonsDiv)
            footer.appendChild(imgDiv);
        }
    );
}

function handleCreateModalBodySlices() {
    createAndInitModal(
        boundingBoxVRCElements.slicesToDisplayCustomModalContent,
        'Check or uncheck the slices to display',
        ['Red', 'Lime', 'Blue', 'Yellow', 'Magenta', 'Cyan', 'White', 'Grey'],
        createModalRowSlicesCubes,
        () => {
            if (theVRCBoundingBox) {
                theVRCBoundingBox.setDisplaySlicesCubes(false);
            }
        },
        (modalContent, body, header, footer) => {
            body.style.maxHeight = '280px';
        }
    );
}

function reorderRowsByPosition() {
    const modalContent = boundingBoxVRCElements.transferFuncCustomModalContent;
    const modalBody = modalContent.querySelector('.modal-body');
    const rows = Array.from(modalBody.querySelectorAll('.modal-row'));

    rows.sort((a, b) => {
        const posA = parseFloat(a.querySelector('#posInput').value);
        const posB = parseFloat(b.querySelector('#posInput').value);
        return posA - posB;
    });

    rows.forEach(row => modalBody.appendChild(row));
}

function createModalRowCustomTransferFunc({ color, alpha, position, id = null }) {
    const theRowElem = document.createElement('div');
    theRowElem.className = 'modal-row';
    theRowElem.style.display = 'block';
    theRowElem.style.marginBottom = '15px';
    if(id){
        theRowElem.id = id;
    }

    const theColorDiv = document.createElement('div');
    theColorDiv.style.display = 'flex';
    theColorDiv.style.justifyContent = 'space-evenly';
    theColorDiv.style.marginBottom = '3px';

    const labelColor = document.createElement('span');
    labelColor.innerText = 'Color ';
    labelColor.className = 'modal-label';

    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.className = 'modal-color-selector';
    colorInput.value = color;
    colorInput.oninput = () => {
        saveTransferFunctionValues(false);
    }


    theColorDiv.appendChild(labelColor);
    theColorDiv.appendChild(colorInput);

    if(!id){ // if we don't have an id, we can add a close button, that's mean the color is not representing the texture boundaries
        const closeButton = document.createElement('span');
        closeButton.className = 'modal-close-bis';
        closeButton.innerHTML = '&times;';
        closeButton.onclick = () => {
            theRowElem.remove();
            saveTransferFunctionValues(false);
        }
        theColorDiv.appendChild(closeButton);
    }

    const theAlphaPosDiv = document.createElement('div');
    theAlphaPosDiv.style.display = 'flex';
    theAlphaPosDiv.style.justifyContent = 'space-between';

    const labelAlpha = document.createElement('span');
    labelAlpha.innerText = 'Alpha';
    labelAlpha.className = 'modal-label';

    const alphaInput = document.createElement('input');
    alphaInput.type = 'number';
    alphaInput.className = 'modal-input';
    alphaInput.id = 'alphaInput';
    alphaInput.min = 0;
    alphaInput.max = 1;
    alphaInput.step = 0.01;
    alphaInput.value = alpha;
    alphaInput.oninput = () => {
        saveTransferFunctionValues(false);
    }

    const labelPos = document.createElement('span');
    labelPos.innerText = 'Pos';
    labelPos.className = 'modal-label';

    const posInput = document.createElement('input');
    posInput.type = 'number';
    posInput.className = 'modal-input';
    posInput.id = 'posInput';
    posInput.min = 0;
    posInput.max = 1;
    posInput.step = 0.01;
    posInput.value = position;
    posInput.oninput = () => {
        saveTransferFunctionValues(false);
        reorderRowsByPosition();
    }

    theAlphaPosDiv.appendChild(labelAlpha);
    theAlphaPosDiv.appendChild(alphaInput);
    theAlphaPosDiv.appendChild(labelPos);
    theAlphaPosDiv.appendChild(posInput);

    const borderDiv = document.createElement('div');
    borderDiv.style.borderBottom = '3px solid white';
    borderDiv.style.marginTop = '8px';

    theRowElem.appendChild(theColorDiv);
    theRowElem.appendChild(theAlphaPosDiv);
    theRowElem.appendChild(borderDiv);
    return theRowElem;
}

function createModalRowSlicesCubes(labelText) {
    const row = document.createElement('div');
    row.className = 'modal-row';

    const colorSquare = document.createElement('div');
    colorSquare.className = 'modal-color-square';
    colorSquare.style.width = '20px';
    colorSquare.style.height = '20px';
    colorSquare.style.backgroundColor = labelText.toLowerCase();
    colorSquare.style.display = 'inline-block';
    colorSquare.style.marginRight = '10px';

    const label = document.createElement('span');
    label.innerText = labelText;
    label.className = 'modal-label';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'modal-checkbox';
    checkbox.checked = true;
    checkbox.oninput = () => {
        saveSliceDisplayValues(false);
    }

    row.appendChild(colorSquare);
    row.appendChild(label);
    row.appendChild(checkbox);
    return row;
}

function saveTransferFunctionValues(closeTheModal = true) {
    const rows = boundingBoxVRCElements.transferFuncCustomModalContent.querySelectorAll('.modal-row');
    boundingBoxVRCTransferFuncCustomValues = Array.from(rows).flatMap(row => {
        const alphaInput = row.children[1].children[1];
        const posInput = row.children[1].children[3];
        const color = row.querySelector('.modal-color-selector').value;
        const alpha = parseFloat(alphaInput.value) || 0.0;
        const pos = parseFloat(posInput.value) || 0.0;
        const colorRGBAP = Color.hextoRGB(color).toArray();
        colorRGBAP[3] = alpha;
        colorRGBAP[4] = pos;
        return colorRGBAP;
    });

    if (theVRCBoundingBox) {
        boundingBoxVRCTransferFuncCustomTexture = createHorizontalGradientTexture(gl, boundingBoxVRCTransferFuncCustomValues);

        // get the footer of the modal and get the imageTexture and set the src to the new texture
        const png = getWebGlTextureAsPNG(boundingBoxVRCTransferFuncCustomTexture);
        const footer = boundingBoxVRCElements.transferFuncCustomModal.querySelector('.modal-footer');
        const imageTexture = footer.querySelector('img');
        imageTexture.src = png;
    }
    if(closeTheModal){
        closeModal(boundingBoxVRCElements.transferFuncCustomModal);
    }
}

function saveSliceDisplayValues(closeTheModal = true) {
    const rows = boundingBoxVRCElements.slicesToDisplayCustomModalContent.querySelectorAll('.modal-row');
    boundingBoxVRCSlicesToDisplay = Array.from(rows).map(row => row.querySelector('.modal-checkbox').checked ? 1. : 0.);

    if (theVRCBoundingBox) {
        theVRCBoundingBox.setSlicesToDisplay(boundingBoxVRCSlicesToDisplay);
        if (closeTheModal){
            theVRCBoundingBox.setDisplaySlicesCubes(false);
        }
    }
    if(closeTheModal){
        closeModal(boundingBoxVRCElements.slicesToDisplayCustomModal);
    }
}

function getDefaultValues() {
    return boundingBoxVRCTransferFuncCustomValues.reduce((acc, _, i) => {
        if (i % 5 === 0) {
            acc.push({
                color: adjustLuminance(
                    boundingBoxVRCTransferFuncCustomValues[i],
                    boundingBoxVRCTransferFuncCustomValues[i + 1],
                    boundingBoxVRCTransferFuncCustomValues[i + 2]
                ),
                alpha: boundingBoxVRCTransferFuncCustomValues[i + 3],
                position: boundingBoxVRCTransferFuncCustomValues[i + 4],
                id: `row-${i}`
            });
        }
        return acc;
    }, []);
}

function adjustLuminance(r, g, b, factor = 1.5) {
    const adjust = (value) => Math.min(255, Math.floor(value * factor));
    const hex = (value) => value.toString(16).padStart(2, '0');
    return `#${hex(adjust(r * 255))}${hex(adjust(g * 255))}${hex(adjust(b * 255))}`;
}

/****************************************************/
/*             BOUNDING BOX UI VRC INIT             */
/****************************************************/

function initBoundingBoxVRCUIComponents() {

    /***************BOUNDING BOX GENERAL INITS***************/
    initToggle(boundingBoxVRCElements.toggle, isThereVRCBoundingBox, async function () {
        isThereVRCBoundingBox = this.checked;
        await handleCreateOrDeleteBoundingBoxVRCObjects().then(() => {
            handleUpdateBoundingBoxBorderType(theVRCBoundingBox, boundingBoxVRCElements.borderSelector.value);
            if(theVRCBoundingBox !== null){
                const selectedTypeOption = boundingBoxVRCElements.typeSelector.options[boundingBoxVRCElements.typeSelector.selectedIndex];
                const selectedTransferFuncOption = boundingBoxVRCElements.transferFuncSelector.options[boundingBoxVRCElements.transferFuncSelector.selectedIndex];
                handleBoundingBoxVoxelMapSelection(selectedTypeOption.value);
                theVRCBoundingBox.setNbImageDepth(selectedTypeOption.dataset.depth);
                theVRCBoundingBox.setNbImageWidth(selectedTypeOption.dataset.width);
                theVRCBoundingBox.setNbImageHeight(selectedTypeOption.dataset.height);
                theVRCBoundingBox.setTransferFunc(selectedTransferFuncOption.value);
                saveTransferFunctionValues();
                theVRCBoundingBox.setVoxelIntensity(boundingBoxVRCDefaultVoxelIntensity);
                theVRCBoundingBox.setSlicesToDisplay(boundingBoxVRCSlicesToDisplay);
                theVRCBoundingBox.setVoxelNoise(boundingBoxVRCDefaultVoxelNoise);
            }
        });
    });

    initSelector(boundingBoxVRCElements.borderSelector, boundingBoxBorderLoader, function () {
        handleUpdateBoundingBoxBorderType(theVRCBoundingBox, this.value);
    });

    initSlider(boundingBoxVRCElements.sizeSlider, async function () {
        await handleUpdateBoundingBoxSize(theVRCBoundingBox, this.value);
        boundingBoxVRCElements.sizeValueDisplay.innerHTML = this.value;
    });

    initGenericObjectSelector(
        boundingBoxVRCElements.typeSelector,
        boundingBoxVoxelMapTypeLoader,
        function () {
            handleBoundingBoxVoxelMapSelection(this.value);
            if(theVRCBoundingBox !== null){
                const selectedOption = this.options[this.selectedIndex];
                theVRCBoundingBox.setNbImageDepth(selectedOption.dataset.depth);
                theVRCBoundingBox.setNbImageWidth(selectedOption.dataset.width);
                theVRCBoundingBox.setNbImageHeight(selectedOption.dataset.height);
            }
        },
        'value', // Property to use for option value
        'name',// Property to use for option text content
        {
            depth: 'depth',
            width: 'width',
            height: 'height'
        }
    );

    initGenericObjectSelector(
        boundingBoxVRCElements.transferFuncSelector,
        boundingBoxVoxelMapTransferFuncLoader,
        function () {
            if(Number(this.value) === -1){
                openModal(boundingBoxVRCElements.transferFuncCustomModal);
            }
            if(theVRCBoundingBox !== null){
                theVRCBoundingBox.setTransferFunc(this.value);
            }
        },
        'value',
        'name',
        { }
    )

    initButton(boundingBoxVRCElements.slicesDisplayButton, function () {
        openModal(boundingBoxVRCElements.slicesToDisplayCustomModal);
        if(theVRCBoundingBox !== null){
            theVRCBoundingBox.setDisplaySlicesCubes(true);
        }
    });

    initSlider(boundingBoxVRCElements.voxelIntensitySlider, function () {
        if(theVRCBoundingBox !== null){
            theVRCBoundingBox.setVoxelIntensity(this.value);
            boundingBoxVRCElements.voxelIntensityValueDisplay.innerHTML = this.value;
        }
    }, boundingBoxVRCDefaultVoxelIntensity, boundingBoxVRCElements.voxelIntensityValueDisplay);

    initSlider(boundingBoxVRCElements.voxelNoiseSlider, function () {
        if(theVRCBoundingBox !== null){
            theVRCBoundingBox.setVoxelNoise(this.value);
            boundingBoxVRCElements.voxelNoiseValueDisplay.innerHTML = this.value;
        }
    }, boundingBoxVRCDefaultVoxelNoise, boundingBoxVRCElements.voxelNoiseValueDisplay);

    handleCreateModalBodyCustomTransferFunc();
    handleCreateModalBodySlices();
    initStyleCaretBoundingBoxComponents(boundingBoxVRCElements);

    const customOption = boundingBoxVRCElements.transferFuncSelector.querySelector('option[value="1"]');
    customOption.addEventListener('click', function (e) {
        openModal(boundingBoxVRCElements.transferFuncCustomModal);
    });

    const modalBody = boundingBoxVRCElements.transferFuncCustomModal.querySelector('.modal-body');
    const rows = modalBody.querySelectorAll('.modal-row');
    rows.forEach(row => {
        if(row.id){
            const posInput = row.children[1].children[3]; // children[1] is the div of alpha and pos and children[3] is the input of pos
            posInput.setAttribute('disabled', 'true');
        }
    });
}

initBoundingBoxVRCUIComponents();