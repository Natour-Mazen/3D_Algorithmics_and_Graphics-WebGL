// src/view/utilsUI.js

// Selectors
const openMenuBtn = doc.getElementById('open_menu_btn');
const menu = doc.getElementById('menu__content');


/**
 * Open the Menu
 */
function openMenu() {
    toggleMenuVisibility(true);
}

/**
 * Close the Menu
 */
function closeMenu() {
    toggleMenuVisibility(false);
}

/**
 * Toggle Menu Visibility
 * @param {boolean} isVisible - Whether the menu should be visible
 */
function toggleMenuVisibility(isVisible) {
    openMenuBtn.style.display = isVisible ? 'none' : 'block';
    menu.classList.toggle('active', isVisible);
}

/**
 * close all dropdowns and hide the collapse button
 * @param evt
 */
function closeAllDropdowns(evt) {
    evt.stopPropagation(); // Prevent the event from bubbling up to the header
    openDropdowns.forEach(dropdown => {
        const caret = dropdown.querySelector('.caret');
        dropdown.classList.remove('active');
        caret.classList.remove('up');
        caret.classList.add('down');
    });
    openDropdowns.length = 0; // Clear the array
    updateCollapseButtonVisibility();
}

/**
 * Update the visibility of the collapse button
 */
function updateCollapseButtonVisibility() {
    const collapseButton = document.getElementById('close_all_dropdowns_btn');
    collapseButton.style.display = openDropdowns.length > 0 ? 'block' : 'none';
}

/**
 * Initialize an event listener for the load event to update the visibility of the collapse button.
 */
window.addEventListener('load', updateCollapseButtonVisibility);

/**
 * Initialize a selector with options and an event listener.
 * @param {HTMLElement} selector - The selector element.
 * @param {Array} options - The options to populate the selector with.
 * @param {Function} onChange - The event listener for the change event.
 */
function initSelector(selector, options, onChange) {
    options.forEach(function (optionName) {
        const option = document.createElement('option');
        const nameWithoutExtension = optionName.split('.')[0];
        option.value = optionName;
        option.textContent = nameWithoutExtension;
        selector.appendChild(option);
    });
    selector.addEventListener('change', onChange);
}

/**
 * Initialize a selector with options of type object and an event listener.
 * @param {HTMLElement} selector - The selector element.
 * @param {Array} options - The options to populate the selector with.
 * @param {Function} onChange - The event listener for the change event.
 * @param {string} valueProp - The property name to use for the option value.
 * @param {string} textProp - The property name to use for the option text content.
 * @param {Object} [dataProps] - An object mapping data attribute names to property names.
 */
function initGenericObjectSelector(selector, options, onChange, valueProp, textProp, dataProps = {}) {
    options.forEach(function (optionObj) {
        const option = document.createElement('option');
        option.value = optionObj[valueProp];
        option.textContent = optionObj[textProp].split('.')[0];

        // Store additional data attributes
        for (const [dataAttr, prop] of Object.entries(dataProps)) {
            option.dataset[dataAttr] = optionObj[prop];
        }

        selector.appendChild(option);
    });
    selector.addEventListener('change', onChange);
}

/**
 * Initialize a color picker with an event listener.
 * @param {HTMLElement} colorPicker - The color picker element.
 * @param {Function} onInput - The event listener for the input event.
 */
function initColorPicker(colorPicker, onInput) {
    colorPicker.addEventListener('input', onInput);
}

/**
 * Initialize a slider with an event listener.
 * @param {HTMLElement} slider - The slider element.
 * @param {Function} onInput - The event listener for the input event.
 * @param {number} defaultValue - The default value for the slider.
 * @param {HTMLElement} [displayElem] - The element that display the slider value.
 */
function initSlider(slider, onInput, defaultValue = 0 , displayElem = null) {
    slider.addEventListener('input', onInput);
    slider.value = defaultValue;
    if(displayElem !== null){
        displayElem.textContent = String(defaultValue);
    }
}

/**
 * Initialize a toggle with an event listener.
 * @param {HTMLElement} toggleElement - The toggle element.
 * @param {boolean} initialState - The initial state of the toggle.
 * @param {Function} onChange - The event listener for the input event.
 */
function initToggle(toggleElement, initialState, onChange) {
    toggleElement.checked = initialState;
    toggleElement.addEventListener('input', onChange);
}

/**
 * Initialize a switch with an event listener.
 * @param {HTMLElement} switchElement - The switch element.
 * @param {boolean} initialState - The initial state of the switch.
 * @param {Function} onChange - The event listener for the change event.
 */
function initSwitch(switchElement, initialState, onChange) {
   switchElement.checked = initialState;
   switchElement.addEventListener('change', onChange);
}

/**
 * initialize a button with an event listener
 * @param button - The button element
 * @param onClick - The event listener for the click event
 */
function initButton(button, onClick) {
    button.addEventListener('click', onClick);
}


/**
 * Handles the display of an HTML selector element.
 * @param {HTMLElement} htmlElem - The HTML element to display or hide.
 * @param {string} value - The display value ('block', 'none', etc.).
 */
function handleDisplayHTMLSelectorElement(htmlElem, value) {
    const element = htmlElem.closest('.row');
    element.style.display = value;
}

/**
 * Removes all event listeners from an element by cloning it.
 * @param {HTMLElement} element - The element from which to remove event listeners.
 * @returns {HTMLElement} - The new element without the event listeners.
 */
function removeAllEventListeners(element) {
    const clone = element.cloneNode(true);
    element.parentNode.replaceChild(clone, element);
    return clone; // return the new element without event listeners
}

/**
 * Opens a modal with the specified ID.
 * @param modal - The modal to open.
 */
function openModal(modal) {
    modal.style.display = 'block';
}

/**
 * Closes a modal with the specified ID.
 * @param modal - The modal to close.
 */
function closeModal(modal) {
    modal.style.display = 'none';
}

/**
 * Creates and initializes a modal with the specified content, title, default values, row creator, validation, and close handlers.
 *
 * @param {HTMLElement} modalContent - The content element of the modal.
 * @param {string} titleText - The title text to display in the modal header.
 * @param {Array} defaultValues - An array of default values to populate the modal body.
 * @param {Function} rowCreator - A function to create a row element for each default value.
 * @param {Function} onClose - The event handler for the close button click event.
 * @param {Function} afterInitCallBack - Optional. A callback function to execute after the modal is initialized.
 */
function createAndInitModal(modalContent, titleText, defaultValues, rowCreator,
                            onClose = null, afterInitCallBack) {
    modalContent.innerHTML = '';

    const header = createModalHeader(titleText, modalContent.parentElement, onClose);
    const body = createModalBodyWithRows(defaultValues, rowCreator);
    const footer = createModalFooter();

    modalContent.appendChild(header);
    modalContent.appendChild(body);
    modalContent.appendChild(footer);

    // Execute the afterInit callback if provided
    if (afterInitCallBack && typeof afterInitCallBack === 'function') {
        afterInitCallBack(modalContent, body, header, footer);
    }
}

/**
 * Creates a modal header with a title and a close button.
 *
 * @param {string} titleText - The text to display as the title of the modal.
 * @param {HTMLElement} modalElement - The modal element that this header belongs to.
 * @param {Function} [onClose] - Optional. A callback function to execute when the close button is clicked.
 * @returns {HTMLElement} - The created modal header element.
 */
function createModalHeader(titleText, modalElement, onClose) {
    const header = document.createElement('div');
    header.className = 'modal-header';

    const title = document.createElement('h3');
    title.innerText = titleText;

    const closeButton = document.createElement('span');
    closeButton.className = 'modal-close';
    closeButton.innerHTML = '&times;';
    closeButton.onclick = () => {
        closeModal(modalElement);
        if (onClose) onClose();
    };

    header.appendChild(title);
    header.appendChild(closeButton);
    return header;
}

/**
 * Creates a modal body with rows generated from default values.
 *
 * @param {Array} defaultValues - An array of default values to populate the modal body.
 * @param {Function} rowCreator - A function to create a row element for each default value.
 * @returns {HTMLElement} - The created modal body element with rows.
 */
function createModalBodyWithRows(defaultValues, rowCreator) {
    const body = document.createElement('div');
    body.className = 'modal-body';
    defaultValues.forEach(value => body.appendChild(rowCreator(value)));
    return body;
}

/**
 * Creates a modal footer with a validate button.
 *
 * @returns {HTMLElement} - The created modal footer element.
 */
function createModalFooter() {
    const footer = document.createElement('div');
    footer.className = 'modal-footer';

    return footer;
}