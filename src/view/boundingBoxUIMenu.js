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
