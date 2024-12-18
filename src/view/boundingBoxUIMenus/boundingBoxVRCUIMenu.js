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

    voxelMapTransferFuncCustomModal: doc.getElementById('boundingBoxVRC_transferFuncCustom_modal'),
    voxelMapTransferFuncCustomModalBody: doc.getElementById('boundingBoxVRC_transferFuncCustom_modalBody'),

    voxelMapTransferFuncSelector: doc.getElementById('boundingBoxVRC_voxelMap_transferFunc_selector'),
    voxelMapRayDepthSlider: doc.getElementById('boundingBoxVRC_voxelMap_ray_depth_slider'),
    voxelMapRayDepthValueDisplay: doc.getElementById('boundingBoxVRC_voxelMap_ray_depth_value')
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
let boundingBoxTransferFuncCustomValues = [
    1., 0., 0., 0.3, // Red
    0., 1., 0., 0.4, // Green
    0., 1., 0., 0.5, // Green
    1., 0., 1., 0.7, // Purple
    1., 1., 0., 0.8 // Yellow
];


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
            boundingBox.setBoundingBoxVoxelMapRayDepth(elements.voxelMapRayDepthSlider.value);
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

/***************************************/
/*       MODAL CUSTOM TRANSFER FUNC    */
/***************************************/

function handleCreateModalBody() {
    const modalContent = boundingBoxVRCElements.voxelMapTransferFuncCustomModalBody;
    modalContent.innerHTML = ''; // Clear existing content

    // Create modal header
    modalContent.appendChild(createModalHeader());

    // Create modal body
    const body = document.createElement('div');
    body.className = 'modal-body';

    // Set default values from boundingBoxTransferFuncCustomValues
    const defaultValues = getDefaultValues();
    defaultValues.forEach(({ color, alpha }) => {
        body.appendChild(createModalRow(color, alpha));
    });

    modalContent.appendChild(body);

    // Create modal footer
    const footer = document.createElement('div');
    footer.className = 'modal-footer';

    const validateButton = document.createElement('button');
    validateButton.className = 'modal-validate-button';
    validateButton.innerText = 'Validate';
    validateButton.onclick = function () {
        let colorAlphaValues = [];
        const rows = body.getElementsByClassName('modal-row');
        for (let row of rows) {
            const color = row.querySelector('.modal-color-selector').value;
            const alpha = row.querySelector('.modal-alpha-input').value;
            const colorRGB = Color.hextoRGB(color).toArray();
            
            colorRGB[3] = Number(alpha) || 0.0;
            colorAlphaValues.push(colorRGB);
        }

        // Replace global variable entirely with the new values
        boundingBoxTransferFuncCustomValues = colorAlphaValues.flat();
        console.log(boundingBoxTransferFuncCustomValues);

        // Apply the new values to the VRCBoundingBox
        if (theVRCBoundingBox !== null) {
            theVRCBoundingBox.setBoundingBoxVoxelMapTransferFuncCustomValues(boundingBoxTransferFuncCustomValues);
        }

        // Close the modal
        closeModal(boundingBoxVRCElements.voxelMapTransferFuncCustomModal);
    };

    footer.appendChild(validateButton);
    modalContent.appendChild(footer);
}

function createModalHeader() {
    const header = document.createElement('div');
    header.className = 'modal-header';

    const title = document.createElement('h3');
    title.innerText = 'Customize Transfer Function';

    const closeButton = document.createElement('span');
    closeButton.className = 'modal-close';
    closeButton.innerHTML = '&times;';
    closeButton.onclick = function () {
        closeModal(boundingBoxVRCElements.voxelMapTransferFuncCustomModal);
    };

    header.appendChild(title);
    header.appendChild(closeButton);
    return header;
}

function createModalRow(color, alpha) {
    const row = document.createElement('div');
    row.className = 'modal-row';

    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.className = 'modal-color-selector';
    colorInput.value = color;

    const labelAlpha = document.createElement('span');
    labelAlpha.innerText = 'Alpha : ';
    labelAlpha.className = 'modal-label';

    const alphaInput = document.createElement('input');
    alphaInput.type = 'number';
    alphaInput.className = 'modal-alpha-input';
    alphaInput.min = 0;
    alphaInput.max = 1;
    alphaInput.step = 0.01;
    alphaInput.value = alpha;

    row.appendChild(colorInput);
    row.appendChild(labelAlpha);
    row.appendChild(alphaInput);
    return row;
}

function getDefaultValues() {
    const defaultValues = [];
    for (let i = 0; i < boundingBoxTransferFuncCustomValues.length; i += 4) {
        const adjustedColor = adjustLuminance(
            boundingBoxTransferFuncCustomValues[i],
            boundingBoxTransferFuncCustomValues[i + 1],
            boundingBoxTransferFuncCustomValues[i + 2]
        );
        defaultValues.push({
            color: adjustedColor,
            alpha: boundingBoxTransferFuncCustomValues[i + 3]
        });
    }
    return defaultValues;
}

function adjustLuminance(r, g, b, factor = 1.5) {
    const adjust = (value) => Math.min(255, Math.floor(value * factor));
    const hex = (value) => value.toString(16).padStart(2, '0');
    const adjustedR = adjust(r * 255); // Convert to 0-255 scale
    const adjustedG = adjust(g * 255);
    const adjustedB = adjust(b * 255);
    return `#${hex(adjustedR)}${hex(adjustedG)}${hex(adjustedB)}`;
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
                const selectedTransferFuncOption = boundingBoxVRCElements.voxelMapTransferFuncSelector.options[boundingBoxVRCElements.voxelMapTransferFuncSelector.selectedIndex];
                handleBoundingBoxVoxelMapSelection(selectedTypeOption.value);
                theVRCBoundingBox.setBoundingBoxVoxelMapSize(selectedTypeOption.dataset.depth);
                theVRCBoundingBox.setBoundingBoxVoxelMapNbImageWidth(selectedTypeOption.dataset.width);
                theVRCBoundingBox.setBoundingBoxVoxelMapNbImageHeight(selectedTypeOption.dataset.height);
                theVRCBoundingBox.setBoundingBoxVoxelMapTransfertFunc(selectedTransferFuncOption.value);
                // if the transfer function is custom, set the custom values to the bounding box by default
                theVRCBoundingBox.setBoundingBoxVoxelMapTransferFuncCustomValues(boundingBoxTransferFuncCustomValues);

            }
        });
    });

    initGenericObjectSelector(
        boundingBoxVRCElements.typeSelector,
        boundingBoxVoxelMapTypeLoader,
        function () {
            handleBoundingBoxVoxelMapSelection(this.value);
            if(theVRCBoundingBox !== null){
                const selectedOption = this.options[this.selectedIndex];
                theVRCBoundingBox.setBoundingBoxVoxelMapSize(selectedOption.dataset.depth);
                theVRCBoundingBox.setBoundingBoxVoxelMapNbImageWidth(selectedOption.dataset.width);
                theVRCBoundingBox.setBoundingBoxVoxelMapNbImageHeight(selectedOption.dataset.height);
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


    initSelector(boundingBoxVRCElements.borderSelector, boundingBoxBorderLoader, function () {
        handleUpdateBoundingBoxBorderType(theVRCBoundingBox, this.value);
    });


    initSlider(boundingBoxVRCElements.sizeSlider, async function () {
        await handleUpdateBoundingBoxSize(theVRCBoundingBox, this.value);
        boundingBoxVRCElements.sizeValueDisplay.innerHTML = this.value;
    });


    initGenericObjectSelector(
        boundingBoxVRCElements.voxelMapTransferFuncSelector,
        boundingBoxVoxelMapTransferFuncLoader,
        function () {
            if(Number(this.value) === -1){
                console.log('Custom transfer function selected');
                openModal(boundingBoxVRCElements.voxelMapTransferFuncCustomModal);
            }
            if(theVRCBoundingBox !== null){
                theVRCBoundingBox.setBoundingBoxVoxelMapTransfertFunc(this.value);
            }
        },
        'value',
        'name',
        { }
    )

    initSlider(boundingBoxVRCElements.voxelMapRayDepthSlider, function () {
        if(theVRCBoundingBox !== null){
            theVRCBoundingBox.setBoundingBoxVoxelMapRayDepth(this.value);
            boundingBoxVRCElements.voxelMapRayDepthValueDisplay.innerHTML = this.value;
        }
    });


    handleCreateModalBody();
    initStyleCaretBoundingBoxComponents(boundingBoxVRCElements);

    const customOption = boundingBoxVRCElements.voxelMapTransferFuncSelector.querySelector('option[value="1"]');
    customOption.addEventListener('click', function (e) {
        openModal(boundingBoxVRCElements.voxelMapTransferFuncCustomModal);
    });
}

initBoundingBoxVRCUIComponents();