// src/view/boundingBoxUIMenu.js
/****************************************************/
/*         BOUNDING BOX GENERAL VARIABLES           */
/****************************************************/

/**
 * @type {Object}
 */
const boundingBoxElements = {
    toggle: doc.getElementById('boundingBox_checkbox'),
    borderSelector: doc.getElementById('boundingBox_border_selector'),
    typeSelector: doc.getElementById('boundingBox_type_selector'),
    renderTypeSwitch: doc.getElementById('boundingBox_renderingType_switch'),
    sizeSlider: doc.getElementById('boundingBox_size_slider'),
    sizeValueDisplay: doc.getElementById('boundingBox_size_value'),

    heightMapTextureSelector: doc.getElementById('boundingBox_heightMap_texture_selector'),
    heightMapFlattenSlider: doc.getElementById('boundingBox_heightMap_flatten_slider'),
    heightMapFlattenValueDisplay: doc.getElementById('boundingBox_heightMap_flatten_value'),

    voxelMapTransferFuncSelector: doc.getElementById('boundingBox_voxelMap_transferFunc_selector'),
    voxelMapRayDepthSlider: doc.getElementById('boundingBox_voxelMap_ray_depth_slider'),
    voxelMapRayDepthValueDisplay: doc.getElementById('boundingBox_voxelMap_ray_depth_value')
};

/**
 * @type {BoundingBoxRM|BoundingBoxVRC|null}
 */
let theBoundingBox = null;

/**
 * @type {Boolean}
 */
let isWireFrameActiveBoundingBox = false;

/**
 * @type {Boolean}
 */
let isOpaqueActiveBoundingBox = false;

/**
 * @type {boolean}
 */
let isThereBoundingBox = false;

/**
 * @type {string[]}
 */
const boundingBoxBorderLoader = ['WireFrame', 'Opaque'];


/****************************************************/
/*         BOUNDING BOX GENERAL FUNCTIONS           */
/****************************************************/

/**
 * Updates the bounding box size.
 * @param {number} value - The new size value.
 * @returns {Promise} {Promise<void>} - A promise that resolves when the bounding box has been updated.
 */
async function handleUpdateBoundingBoxSize(value) {
    if (theBoundingBox !== null) {
        theBoundingBox.setBoundingBoxSize(value);
        await theBoundingBox.initAll();
    }
}

/**
 * Initializes the types selector for the bounding box.
 * Removes all existing event listeners from the type selector element,
 * resets its content, and sets up new event listeners based on the current state.
 */
function initTypesSelectorBoundingBox() {
    // Récupérer l'élément et supprimer tous les listeners "change"
    boundingBoxElements.typeSelector = removeAllEventListeners(boundingBoxElements.typeSelector);

    const typesSelector = boundingBoxElements.typeSelector;

    // Réinitialiser le contenu du select
    typesSelector.innerHTML = '<option value="None">None</option>';

    if (isVolumeRayCastingActiveBoundingBox) {
        initSelector(typesSelector, boundingBoxVoxelMapTypeLoader, function () {
            handleBoundingBoxVoxelMapSelection(this.value);
        });
    } else {
        initGenericObjectSelector(
            typesSelector,
            boundingBoxHeightMapTypeLoader,
            function () {
                const selectedOption = this.options[this.selectedIndex];
                const isColor = selectedOption.dataset.isColor === 'true'; // Convert to boolean
                isColoredBoundingBoxHeightMapType = isColor;
                if (isColor || this.value === 'None') {
                    lastSelectedBoundingBoxHeightMapTexturePath = "";
                    boundingBoxElements.heightMapTextureSelector.value = 'None';
                    handleDisplayHTMLSelectorElement(boundingBoxElements.heightMapTextureSelector, 'none');
                } else {
                    handleDisplayHTMLSelectorElement(boundingBoxElements.heightMapTextureSelector, 'block');
                }
                handleBoundingBoxHeightMapSelection(this.value, 'type');
            },
            'value', // Property to use for option value
            'name', // Property to use for option text content
            { isColor: 'isColor' } // Additional data attributes
        );
    }
}

/**
 * Creates or deletes bounding box objects based on the current state.
 * Filters out existing bounding box objects from the main objects to draw,
 * then creates new bounding box objects if necessary.
 *
 * @returns {Promise<void>} A promise that resolves when the bounding box objects have been created or deleted.
 */
async function handleCreateOrDeleteBoundingBoxObjects() {
    main_objectsToDraw = main_objectsToDraw.filter(obj => !(obj instanceof BoundingBox) );
    theBoundingBox = null;
    if (isThereBoundingBox) {
        if (isVolumeRayCastingActiveBoundingBox) {
            theBoundingBox = new BoundingBoxVRC();
            await handleUpdateBoundingBoxSize(boundingBoxElements.sizeSlider.value);
            theBoundingBox.setBoundingBoxVoxelMapRayDepth(boundingBoxElements.voxelMapRayDepthSlider.value);
            main_objectsToDraw.push(theBoundingBox);
        } else {
            theBoundingBox = new BoundingBoxRM();
            await handleUpdateBoundingBoxSize(boundingBoxElements.sizeSlider.value);
            theBoundingBox.setBoundingBoxHeightMapFlattenFactor(boundingBoxElements.heightMapFlattenSlider.value);
            main_objectsToDraw.push(theBoundingBox);
        }
        if(isTherePlane){
            setPlaneState(false);
        }
    } else {
        if(!isTherePlane){
            setPlaneState(true);
        }
    }
}


/****************************************************/
/*            BOUNDING BOX RM VARIABLES             */
/****************************************************/

/**
 * @type {Boolean}
 */
let isColoredBoundingBoxHeightMapType = false;

/**
 * @type {string|null}
 */
let boundingBoxHeightMapType = null;

/**
 * @type {string|null}
 */
let boundingBoxHeightMapTexture = null;

/**
 *
 * @type {string}
 */
let lastSelectedBoundingBoxHeightMapTexturePath = "";

/**
 * @constant {Object[]}
 */
const boundingBoxHeightMapTypeLoader = [
    { value: 'texture1.png', name: 'texture1_RGB', isColor: false },
    { value: 'texture2.png', name: 'texture2_RGB', isColor: false },
    { value: 'texture3.png', name: 'texture3_RGB', isColor: false },
    { value: 'texture4.png', name: 'texture4_RGB', isColor: false },
    { value: 'texture5.png', name: 'texture5_LAB', isColor: true },
    { value: 'texture6.png', name: 'texture6_LAB', isColor: true },
    { value: 'texture7.png', name: 'texture7_LAB', isColor: true },
    { value: 'texture8.png', name: 'texture8_LAB', isColor: true },
    { value: 'texture14.png', name: 'texture9_LAB', isColor: true },
    { value: 'texture10.png', name: 'texture10_LAB', isColor: true },
    { value: 'texture10.png', name: 'texture10_RGB', isColor: false },
    { value: 'texture15.png', name: 'texture11_LAB', isColor: true },
];

/**
 * @type {string[]}
 */
const boundingBoxHeightMapTextureLoader = ['poolWater.png', 'seaWater.jpg', 'circle.png',
    "bumpWater.jpg", "brickWall.jpg", "waterReel.jpg"];

/****************************************************/
/*            BOUNDING BOX RM FUNCTIONS             */
/****************************************************/

/**
 * Handles the bounding box height map selection.
 * @param {string} selectedHeightMap - The selected height map.
 * @param {string} selectionType - The selection type ('type' or 'texture').
 */
function handleBoundingBoxHeightMapSelection(selectedHeightMap, selectionType) {
    if (selectedHeightMap === 'None') {
        resetBoundingBoxHeightMapSelection(selectionType);
        return;
    }

    const path = selectionType === 'type' ? `res/heightMaps/${selectedHeightMap}` : `res/textures/${selectedHeightMap}`;
    const texture = loadTexture(gl, path);

    if (selectionType === 'type') {
        boundingBoxHeightMapType = texture;
        boundingBoxHeightMapTexture = lastSelectedBoundingBoxHeightMapTexturePath ? loadTexture(gl, lastSelectedBoundingBoxHeightMapTexturePath) : texture;
    } else {
        lastSelectedBoundingBoxHeightMapTexturePath = path;
        boundingBoxHeightMapTexture = texture;
    }
}

/**
 * Resets the bounding box height map selection.
 * @param {string} selectionType - The selection type ('type' or 'texture').
 */
function resetBoundingBoxHeightMapSelection(selectionType) {
    if (selectionType === 'type') {
        boundingBoxHeightMapType = null;
        if(lastSelectedBoundingBoxHeightMapTexturePath === ""){
            boundingBoxHeightMapTexture = null;
        }

    } else {
        lastSelectedBoundingBoxHeightMapTexturePath = "";
        boundingBoxHeightMapTexture = boundingBoxHeightMapType ? loadTexture(gl, `res/heightMaps/${boundingBoxElements.typeSelector.value}`) : null;
    }
}



/****************************************************/
/*            BOUNDING BOX VRC VARIABLES            */
/****************************************************/

/**
 * @constant {string[]}
 */
const boundingBoxVoxelMapTypeLoader = ['hazelnut_256.png'];

/**
 * @constant {Object[]}
 */
const boundingBoxVoxelMapTransferFuncLoader = [
    { name: 'Default', value: 0 },
    { name: 'Red', value: 1 },
    { name: 'BleuToGreen', value: 2 },
    { name: 'Sepia', value: 3 },
    { name: 'YellowToCyan', value: 4 },
    { name: 'Invert', value: 5 },
    { name: 'Cartoon', value: 6 },
    { name: 'Thermal', value: 7 },
    { name: 'Rainbow', value: 8 },
];

/**
 * @type {Boolean}
 */
let isVolumeRayCastingActiveBoundingBox = false;

/**
 * @type {string|null}
 */
let boundingBoxVoxelMapType = null;


/****************************************************/
/*            BOUNDING BOX VRC FUNCTIONS            */
/****************************************************/

/**
 * Handles the bounding box voxel map selection.
 * @param selectedVoxelMap - The selected voxel map.
 */
function handleBoundingBoxVoxelMapSelection(selectedVoxelMap) {
    if (selectedVoxelMap === 'None') {
        boundingBoxVoxelMapType = null;
        return;
    }

    const path = `res/voxelMaps/${selectedVoxelMap}` ;
    if(path) {
        boundingBoxVoxelMapType = loadTexture(gl, path);
    }
}

/**
 * Activates the HTML elements related to volume ray casting for the bounding box.
 * Displays the voxel map elements and hides the height map elements.
 * Resets the height map type, texture, and last selected texture path.
 */
function handleActivateVolumeRayCastingBoundingBoxHTMLElements() {
    // active voxel map elements
    handleDisplayHTMLSelectorElement(boundingBoxElements.voxelMapTransferFuncSelector,'block');
    handleDisplayHTMLSelectorElement(boundingBoxElements.voxelMapRayDepthSlider,'block');

    // disable height map elements and reset values
    handleDisplayHTMLSelectorElement(boundingBoxElements.heightMapTextureSelector,'none');
    handleDisplayHTMLSelectorElement(boundingBoxElements.heightMapFlattenSlider,'none');
    boundingBoxHeightMapType = null;
    boundingBoxHeightMapTexture = null;
    lastSelectedBoundingBoxHeightMapTexturePath = "";
}

/**
 * Disables the HTML elements related to volume ray casting for the bounding box.
 * Hides the voxel map elements and displays the height map elements.
 * Resets the voxel map type.
 */
function handleDisableVolumeRayCastingBoundingBoxHTMLElements() {
    // active height map elements
    handleDisplayHTMLSelectorElement(boundingBoxElements.heightMapFlattenSlider,'block');

    // disable voxel map elements and reset values
    handleDisplayHTMLSelectorElement(boundingBoxElements.voxelMapTransferFuncSelector,'none');
    handleDisplayHTMLSelectorElement(boundingBoxElements.voxelMapRayDepthSlider,'none');
    boundingBoxVoxelMapType = null;
    boundingBoxElements.voxelMapTransferFuncSelector.value = boundingBoxVoxelMapTransferFuncLoader[0].value;
}

/****************************************************/
/*               BOUNDING BOX UI INIT               */
/****************************************************/

function initBoundingBoxUIComponents() {

    /***************BOUNDING BOX GENERAL INITS***************/
    initToggle(boundingBoxElements.toggle, isThereBoundingBox, async function () {
        isThereBoundingBox = this.checked;
        await handleCreateOrDeleteBoundingBoxObjects();
    });

    initSelector(boundingBoxElements.borderSelector, boundingBoxBorderLoader, function () {
        if(this.value === 'WireFrame'){
            isWireFrameActiveBoundingBox = true;
            isOpaqueActiveBoundingBox = false;
        } else if (this.value === 'Opaque'){
            isWireFrameActiveBoundingBox = false;
            isOpaqueActiveBoundingBox = true;
        } else {
            isWireFrameActiveBoundingBox = false;
            isOpaqueActiveBoundingBox = false;
        }
    });

    initSlider(boundingBoxElements.sizeSlider, async function () {
        await handleUpdateBoundingBoxSize(this.value);
        boundingBoxElements.sizeValueDisplay.innerHTML = this.value;
    });

    initSwitch(boundingBoxElements.renderTypeSwitch, isVolumeRayCastingActiveBoundingBox, async function () {
        isVolumeRayCastingActiveBoundingBox = this.checked;
        if (isVolumeRayCastingActiveBoundingBox) {
            handleActivateVolumeRayCastingBoundingBoxHTMLElements();
        } else {
            handleDisableVolumeRayCastingBoundingBoxHTMLElements();
        }
        await handleCreateOrDeleteBoundingBoxObjects().then(
            () => {
                initTypesSelectorBoundingBox();
            }
        );

    });

    initTypesSelectorBoundingBox();

    /***************BOUNDING BOX RM INITS***************/
    initSlider(boundingBoxElements.heightMapFlattenSlider, function () {
        if(theBoundingBox !== null){
            theBoundingBox.setBoundingBoxHeightMapFlattenFactor(this.value);
            boundingBoxElements.heightMapFlattenValueDisplay.innerHTML = this.value;
        }
    });

    initSelector(boundingBoxElements.heightMapTextureSelector, boundingBoxHeightMapTextureLoader, function () {
        handleBoundingBoxHeightMapSelection(this.value, 'texture');
    });

    /***************BOUNDING BOX VRC INITS***************/
    initGenericObjectSelector(
        boundingBoxElements.voxelMapTransferFuncSelector,
        boundingBoxVoxelMapTransferFuncLoader,
        function () {
            if(theBoundingBox !== null){
                theBoundingBox.setBoundingBoxVoxelMapTransfertFunc(this.value);
            }
        },
        'value',
        'name',
        { }
    )

    initSlider(boundingBoxElements.voxelMapRayDepthSlider, function () {
        if(theBoundingBox !== null){
            theBoundingBox.setBoundingBoxVoxelMapRayDepth(this.value);
            boundingBoxElements.voxelMapRayDepthValueDisplay.innerHTML = this.value;
        }
    });

    /***************BOUNDING BOX GENERAL UPDATES***************/
    const element = boundingBoxElements.renderTypeSwitch.closest('.row');

    if(element !== null){
        element.style.margin = '7px 0 7px 0';
        const switchLabel2 = element.querySelector('.switch__label2');
        const switchBtn = element.querySelector('.switch');
        if(switchLabel2 === null || switchBtn === null) {
            return;
        }
        switchLabel2.style.margin = '0 0 0 62px';
        switchBtn.style.margin = '0 68px';
    }

    handleDisplayHTMLSelectorElement(boundingBoxElements.heightMapTextureSelector,'none');
    handleDisplayHTMLSelectorElement(boundingBoxElements.voxelMapTransferFuncSelector,'none');
    handleDisplayHTMLSelectorElement(boundingBoxElements.voxelMapRayDepthSlider,'none');
}

initBoundingBoxUIComponents();