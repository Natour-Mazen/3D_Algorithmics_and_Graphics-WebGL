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

    voxelMapTransferFuncCustomModalButton: doc.getElementById('boundingBoxVRC_transferFuncCustom_modalButton'),
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
                handleDisplayHTMLSelectorElement(boundingBoxVRCElements.voxelMapTransferFuncCustomModalButton, 'block');
            }else {
                handleDisplayHTMLSelectorElement(boundingBoxVRCElements.voxelMapTransferFuncCustomModalButton, 'none');
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



    initStyleCaretBoundingBoxComponents(boundingBoxVRCElements);
    handleDisplayHTMLSelectorElement(boundingBoxVRCElements.voxelMapTransferFuncCustomModalButton, 'none');
}

initBoundingBoxVRCUIComponents();