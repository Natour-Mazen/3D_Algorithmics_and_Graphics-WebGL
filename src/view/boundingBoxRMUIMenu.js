// src/view/boundingBoxUIMenu.js
/****************************************************/
/*         BOUNDING BOX GENERAL VARIABLES           */
/****************************************************/

/**
 * @type {Object}
 */
const boundingBoxRMElements = {
    toggle: doc.getElementById('boundingBoxRM_checkbox'),
    borderSelector: doc.getElementById('boundingBoxRM_border_selector'),
    typeSelector: doc.getElementById('boundingBoxRM_type_selector'),
    sizeSlider: doc.getElementById('boundingBoxRM_size_slider'),
    sizeValueDisplay: doc.getElementById('boundingBoxRM_size_value'),

    heightMapTextureSelector: doc.getElementById('boundingBoxRM_heightMap_texture_selector'),
    heightMapFlattenSlider: doc.getElementById('boundingBoxRM_heightMap_flatten_slider'),
    heightMapFlattenValueDisplay: doc.getElementById('boundingBoxRM_heightMap_flatten_value'),
};

/**
 * @type {BoundingBoxRM|null}
 */
let theRMBoundingBox = null;

/**
 * @type {boolean}
 */
let isThereRMBoundingBox = false;


/****************************************************/
/*         BOUNDING BOX GENERAL FUNCTIONS           */
/****************************************************/

/**
 * Creates or deletes bounding box objects based on the current state.
 * Filters out existing bounding box objects from the main objects to draw,
 * then creates new bounding box objects if necessary.
 *
 * @returns {Promise<void>} A promise that resolves when the bounding box objects have been created or deleted.
 */
async function handleCreateOrDeleteBoundingBoxRMObjects() {
    main_objectsToDraw = main_objectsToDraw.filter(obj => !(obj instanceof BoundingBoxRM) );
    theRMBoundingBox = null;
    if (isThereRMBoundingBox) {
        theRMBoundingBox = new BoundingBoxRM();
        await handleUpdateBoundingBoxSize(theRMBoundingBox, boundingBoxRMElements.sizeSlider.value);
        theRMBoundingBox.setBoundingBoxHeightMapFlattenFactor(boundingBoxRMElements.heightMapFlattenSlider.value);
        main_objectsToDraw.push(theRMBoundingBox);
        if(isTherePlane){
            setPlaneState(false);
        }
    } else {
        const isThereAnObjectBoundingBox = main_objectsToDraw.some(obj => obj instanceof BoundingBox);
        if(!isTherePlane && !isThereAnObjectBoundingBox){
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
        boundingBoxHeightMapTexture = boundingBoxHeightMapType ? loadTexture(gl, `res/heightMaps/${boundingBoxRMElements.typeSelector.value}`) : null;
    }
}


/****************************************************/
/*             BOUNDING BOX RM UI INIT              */
/****************************************************/

function initBoundingBoxRMUIComponents() {

    /***************BOUNDING BOX GENERAL INITS***************/
    initToggle(boundingBoxRMElements.toggle, isThereRMBoundingBox, async function () {
        isThereRMBoundingBox = this.checked;
        await handleCreateOrDeleteBoundingBoxRMObjects();
        handleUpdateBoundingBoxBorderType(theRMBoundingBox, boundingBoxRMElements.borderSelector.value);
    });

    initSelector(boundingBoxRMElements.borderSelector, boundingBoxBorderLoader, function () {
        handleUpdateBoundingBoxBorderType(theRMBoundingBox, this.value);
    });

    initSlider(boundingBoxRMElements.sizeSlider, async function () {
        await handleUpdateBoundingBoxSize(theRMBoundingBox, this.value);
        boundingBoxRMElements.sizeValueDisplay.innerHTML = this.value;
    });

    initGenericObjectSelector(
        boundingBoxRMElements.typeSelector,
        boundingBoxHeightMapTypeLoader,
        function () {
            const selectedOption = this.options[this.selectedIndex];
            const isColor = selectedOption.dataset.isColor === 'true'; // Convert to boolean
            isColoredBoundingBoxHeightMapType = isColor;
            if (isColor || this.value === 'None') {
                lastSelectedBoundingBoxHeightMapTexturePath = "";
                boundingBoxRMElements.heightMapTextureSelector.value = 'None';
                handleDisplayHTMLSelectorElement(boundingBoxRMElements.heightMapTextureSelector, 'none');
            } else {
                handleDisplayHTMLSelectorElement(boundingBoxRMElements.heightMapTextureSelector, 'block');
            }
            handleBoundingBoxHeightMapSelection(this.value, 'type');
        },
        'value', // Property to use for option value
        'name', // Property to use for option text content
        { isColor: 'isColor' } // Additional data attributes
    );

    /***************BOUNDING BOX RM INITS***************/
    initSlider(boundingBoxRMElements.heightMapFlattenSlider, function () {
        if(theRMBoundingBox !== null){
            theRMBoundingBox.setBoundingBoxHeightMapFlattenFactor(this.value);
            boundingBoxRMElements.heightMapFlattenValueDisplay.innerHTML = this.value;
        }
    });

    initSelector(boundingBoxRMElements.heightMapTextureSelector, boundingBoxHeightMapTextureLoader, function () {
        handleBoundingBoxHeightMapSelection(this.value, 'texture');
    });



    /***************BOUNDING BOX GENERAL UPDATES***************/

    const boundingBoxRMWrapper = boundingBoxRMElements.toggle.closest('.row').parentElement.parentElement.parentElement;
    const boundingBoxRMHeader = boundingBoxRMWrapper.querySelector('div.header');
    const boundingBoxRMSpan = boundingBoxRMHeader.querySelector('span');

    if (boundingBoxRMSpan) {
        boundingBoxRMSpan.style.top = '40px'; // Set the initial style
        const observer = new MutationObserver(() => {
            if (!boundingBoxRMSpan.classList.contains('cart') && !boundingBoxRMSpan.classList.contains('up')) {
                boundingBoxRMSpan.style.top = '40px';
            } else {
                boundingBoxRMSpan.style.top = ''; // Reset the style if the class is present
            }
        });

        observer.observe(boundingBoxRMSpan, { attributes: true, attributeFilter: ['class'] });
    }

    handleDisplayHTMLSelectorElement(boundingBoxRMElements.heightMapTextureSelector,'none');

}

initBoundingBoxRMUIComponents();