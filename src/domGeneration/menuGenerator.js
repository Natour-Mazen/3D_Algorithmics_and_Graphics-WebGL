/**
 * @file menuGenerator.js
 * @description This script generates dropdown menus based on the configuration defined in dropdownsMenus.js.
 */

const doc = document;

doc.addEventListener('DOMContentLoaded', () => {
    const dropdownContainer = doc.getElementById('dropdown');

    /**
     * @description The dropdowns to be created are defined in the dropdownsMenus.js file.
     */
    dropdowns.forEach(dropdown => {
        const dropdownElement = createDropdown(dropdown.title, dropdown.items);
        dropdownContainer.appendChild(dropdownElement);
    });


});

/**
 * @function createDropdown
 * @description Creates a dropdown menu element.
 * @param {string} title - The title of the dropdown.
 * @param {Array} items - The items to be included in the dropdown.
 * @returns {HTMLElement} The created dropdown element.
 */
function createDropdown(title, items) {
    const dropdown = doc.createElement('div');
    dropdown.className = 'dropdown';

    const header = doc.createElement('div');
    header.className = 'header';
    header.onclick = toggleDropdown;
    header.innerHTML = `<span class="caret down"></span>${title}`;
    dropdown.appendChild(header);

    const contentWrapper = doc.createElement('div');
    contentWrapper.className = 'content__wrapper';

    items.forEach(item => {
        const itemElement = createItemElement(item);
        contentWrapper.appendChild(itemElement);
    });

    dropdown.appendChild(contentWrapper);
    return dropdown;
}

/**
 * @function createItemElement
 * @description Creates an item element based on its type.
 * @param {Object} item - The item configuration object.
 * @param {string} item.type - The type of the item (checkbox, select, color, slider).
 * @param {string} item.label - The label of the item.
 * @param {string} item.id - The id of the item.
 * @param {boolean} [item.checked] - The checked state of the checkbox (if type is checkbox).
 * @param {Array} [item.options] - The options for the select element (if type is select).
 * @param {string} [item.value] - The value of the color input (if type is color).
 * @param {number} [item.min] - The minimum value for the slider (if type is slider).
 * @param {number} [item.max] - The maximum value for the slider (if type is slider).
 * @param {number} [item.step] - The step value for the slider (if type is slider).
 * @param {string} [item.displayId] - The id of the display element for the slider value (if type is slider).
 * @returns {HTMLElement} The created item element.
 */
function createItemElement(item) {
    const itemElement = doc.createElement('item');
    const row = doc.createElement('div');
    row.className = 'row';

    if (item.type === 'checkbox') {
        row.className += ' checkbox';
        row.innerHTML = `<label for="${item.id}">${item.label}</label><input type="checkbox" id="${item.id}" ${item.checked ? 'checked' : ''}>`;
    } else if (item.type === 'select') {
        row.innerHTML = `<label for="${item.id}">${item.label}</label><select id="${item.id}" name="${item.label}" class="selector">${item.options.map(option => `<option>${option}</option>`)}</select>`;
    } else if (item.type === 'color') {
        row.innerHTML = `<label for="${item.id}">${item.label}</label><input type="color" class="color_picker" id="${item.id}" name="color" value="${item.value}">`;
    } else if (item.type === 'slider') {
        row.className += ' slider';
        row.innerHTML = `<label for="${item.id}">${item.label}</label><input type="range" id="${item.id}" min="${item.min}" max="${item.max}" step="${item.step}" value="${item.value}"><span class="value_display" id="${item.displayId}" contenteditable="false"></span>`;
    } else if (item.type === 'switch') {
        row.className += ' switch__container';
        row.innerHTML = `
            <span class="switch__label1">${item.label1}</span>
            <label class="switch">
                <input type="checkbox" id="${item.id}">
                <span class="sliderSwitch round"></span>
            </label>
            <span class="switch__label2">${item.label2}</span>
        `;
    }else if (item.type === 'modal') {
        row.innerHTML = `
        <div class="modal" id="${item.id}">
            <div class="modal-content" id="${item.idContent}">
               <!-- Modal content should be added by each specific UI component/File, each modal should have a unique id -->
            </div>
        </div>
        `;
        row.style.height = "0px";
        row.style.overflow = "hidden";
    } else if(item.type === 'button') {
        row.innerHTML = `
        <label for="${item.id}">${item.label}</label>
        <button id="${item.id}" class="button-custom">${item.labelButton}</button>
        `;
    }

    itemElement.appendChild(row);
    return itemElement;
}

/**
 * @function toggleDropdown
 * @description Toggles the visibility of a dropdown menu.
 * @param {Event} evt - The on-click event.
 */
const openDropdowns = [];

function toggleDropdown(evt) {
    const header = evt.target;
    const dropdown = header.closest('.dropdown');
    const caret = header.querySelector('.caret');
    const dropdownConfig = dropdowns.find(d => d.title === header.textContent.trim());
    const isLong = dropdownConfig.isLong;

    // Close the current dropdown if it is active
    if (dropdown.classList.contains('active')) {
        dropdown.classList.remove('active');
        caret.classList.remove('up');
        caret.classList.add('down');
        const index = openDropdowns.indexOf(dropdown);
        if (index > -1) {
            openDropdowns.splice(index, 1);
        }
    } else {
        // Close the oldest dropdown if more than two are open
        if (openDropdowns.length >= 2) {
            const dropdownToClose = openDropdowns.shift();
            const caretToClose = dropdownToClose.querySelector('.caret');
            dropdownToClose.classList.remove('active');
            caretToClose.classList.remove('up');
            caretToClose.classList.add('down');
        }

        // Close other "isLong" dropdowns
        if (isLong) {
            openDropdowns.forEach(openDropdown => {
                const openDropdownHeader = openDropdown.querySelector('.header');
                const openDropdownConfig = dropdowns.find(d => d.title === openDropdownHeader.textContent.trim());
                if (openDropdownConfig.isLong) {
                    const openDropdownCaret = openDropdownHeader.querySelector('.caret');
                    openDropdown.classList.remove('active');
                    openDropdownCaret.classList.remove('up');
                    openDropdownCaret.classList.add('down');
                }
            });
        }

        // Open the current dropdown
        dropdown.classList.add('active');
        caret.classList.remove('down');
        caret.classList.add('up');
        openDropdowns.push(dropdown);
    }

    updateCollapseButtonVisibility();
}


