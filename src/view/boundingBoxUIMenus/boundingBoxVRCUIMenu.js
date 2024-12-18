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
    { name: 'Custom', value: -1 },
    { name: 'Red', value: 1 },
    { name: 'BleuToGreen', value: 2 },
    { name: 'Sepia', value: 3 },
    { name: 'Glitch', value: 4 },
    { name: 'Invert', value: 5 },
    { name: 'Heart Beat', value: 6 },
    { name: 'Thermal', value: 7 },
    { name: 'Rainbow', value: 8 },
    { name: 'Red Jelly', value: 9 },
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

function addColorAlphaRows() {
    const modalContent = boundingBoxVRCElements.voxelMapTransferFuncCustomModalBody;
    modalContent.innerHTML = ''; // Clear existing content

    const header = document.createElement('div');
    header.className = 'modal-header';

    const title = document.createElement('h3');
    title.innerText = 'Customize Transfer Function';

    const closeButton = document.createElement('span');
    closeButton.className = 'modal-close';
    closeButton.innerHTML = '&times;';
    closeButton.onclick = function() {
        closeModal(boundingBoxVRCElements.voxelMapTransferFuncCustomModal);
    };

    header.appendChild(title);
    header.appendChild(closeButton);
    modalContent.appendChild(header);

    const body = document.createElement('div');
    body.className = 'modal-body';

    for (let i = 0; i < 5; i++) {
        const row = document.createElement('div');
        row.className = 'modal-row';

        const colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.className = 'modal-color-selector';

        const labelAlpha = document.createElement('span');
        labelAlpha.innerText = 'Alpha : ';
        labelAlpha.className = 'modal-label';


        const alphaInput = document.createElement('input');
        alphaInput.type = 'number';
        alphaInput.className = 'modal-alpha-input';
        alphaInput.min = 0;
        alphaInput.max = 1;
        alphaInput.step = 0.01;

        row.appendChild(colorInput);
        row.appendChild(labelAlpha);
        row.appendChild(alphaInput);
        body.appendChild(row);
    }

    modalContent.appendChild(body);

    const footer = document.createElement('div');
    footer.className = 'modal-footer';

    const validateButton = document.createElement('button');
    validateButton.className = 'modal-validate-button';
    validateButton.innerText = 'Validate';
    validateButton.onclick = function() {
        let colorAlphaValues = [];
        const rows = body.getElementsByClassName('modal-row');
        for (let row of rows) {
            const color = row.querySelector('.modal-color-selector').value;
            const alpha = row.querySelector('.modal-alpha-input').value;
            const colorRGB = Color.hextoRGB(color).toArray();
            // replace the third value of the color with the alpha value
            let numericAlpha = 0.5;
            try {
                numericAlpha = Number(alpha);
            } catch (e) {
                console.error(e);
            }
            colorRGB[3] = numericAlpha;
            colorAlphaValues.push(colorRGB);
        }
        console.log(colorAlphaValues);
        if(theVRCBoundingBox !== null){
            theVRCBoundingBox.setBoundingBoxVoxelMapTransferFuncCustomValues(colorAlphaValues);
        }
        closeModal(boundingBoxVRCElements.voxelMapTransferFuncCustomModal);
    };

    footer.appendChild(validateButton);
    modalContent.appendChild(footer);
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


    addColorAlphaRows();
    initStyleCaretBoundingBoxComponents(boundingBoxVRCElements);

    const customOption = boundingBoxVRCElements.voxelMapTransferFuncSelector.querySelector('option[value="-1"]');
    customOption.addEventListener('click', function (e) {
        openModal(boundingBoxVRCElements.voxelMapTransferFuncCustomModal);
    });
}

initBoundingBoxVRCUIComponents();