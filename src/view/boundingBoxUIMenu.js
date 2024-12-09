// src/view/boundingBoxUIMenu.js
/****************************************************/
/*         BOUNDING BOX GENERAL VARIABLES           */
/****************************************************/

/**
 * @type {string[]}
 */
const boundingBoxBorderLoader = [BoundingBoxBorderTypes.NONE, BoundingBoxBorderTypes.OPAQUE, BoundingBoxBorderTypes.WIREFRAME];


/****************************************************/
/*         BOUNDING BOX GENERAL FUNCTIONS           */
/****************************************************/

/**
 * Updates the bounding box size.
 * @param {BoundingBox|BoundingBoxVRC|null} boundingBoxObject - The bounding box object to update.
 * @param {number} value - The new size value.
 * @returns {Promise} {Promise<void>} - A promise that resolves when the bounding box has been updated.
 */
async function handleUpdateBoundingBoxSize(boundingBoxObject, value) {
    if (boundingBoxObject !== null) {
        boundingBoxObject.setBoundingBoxSize(value);
        await boundingBoxObject.initAll();
    }
}

/**
 * Updates the bounding box border type.
 * @param {BoundingBox|BoundingBoxVRC|null} boundingBoxObject - The bounding box object to update.
 * @param {string} value - The new border type value.
 */
function handleUpdateBoundingBoxBorderType(boundingBoxObject, value) {
    if (boundingBoxObject !== null) {
        boundingBoxObject.setBoundingBoxBorderType(value);
    }
}

/**
 * Creates or deletes bounding box objects based on the current state.
 * Filters out existing bounding box objects from the main objects to draw,
 * then creates new bounding box objects if necessary.
 * @param {boolean} isThereBoundingBox - Whether there is a bounding box.
 * @param {BoundingBox|BoundingBoxVRC} BoundingBoxClass - The bounding box class to create.
 * @param {Object} elements - The bounding box elements.
 * @param {Object} updateFunctions - The bounding box update functions.
 * @returns {Promise<BoundingBox|BoundingBoxVRC|null>} - A promise that resolves with the created bounding box object.
 */
async function handleCreateOrDeleteBoundingBoxObjects(isThereBoundingBox, BoundingBoxClass, elements, updateFunctions) {
    main_objectsToDraw = main_objectsToDraw.filter(obj => !(obj instanceof BoundingBoxClass));
    let boundingBox = null;
    if (isThereBoundingBox) {
        boundingBox = new BoundingBoxClass();
        await updateFunctions.updateSize(boundingBox, elements.sizeSlider.value);
        updateFunctions.updateSpecificProperties(boundingBox, elements);
        main_objectsToDraw.push(boundingBox);
        if (isTherePlane) {
            setPlaneState(false);
        }
    } else {
        const isThereAnObjectBoundingBox = main_objectsToDraw.some(obj => obj instanceof BoundingBox);
        if (!isTherePlane && !isThereAnObjectBoundingBox) {
            setPlaneState(true);
        }
    }
    return boundingBox;
}

/**
 * Initializes the bounding box UI components, By setting the initial style and observing the class changes.
 * @param elements - The bounding box elements.
 */
function initStyleCaretBoundingBoxComponents(elements) {
    const wrapper = elements.toggle.closest('.row').parentElement.parentElement.parentElement;
    const header = wrapper.querySelector('div.header');
    const span = header.querySelector('span');

    if (span) {
        span.style.top = '40px'; // Set the initial style
        const observer = new MutationObserver(() => {
            if (!span.classList.contains('cart') && !span.classList.contains('up')) {
                span.style.top = '40px';
            } else {
                span.style.top = ''; // Reset the style if the class is present
            }
        });

        observer.observe(span, { attributes: true, attributeFilter: ['class'] });
    }
}