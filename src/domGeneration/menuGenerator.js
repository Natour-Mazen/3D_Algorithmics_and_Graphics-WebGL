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
    }

    itemElement.appendChild(row);
    return itemElement;
}

/**
 * @function toggleDropdown
 * @description Toggles the visibility of a dropdown menu.
 * @param {Event} evt - The on-click event.
 */
function toggleDropdown(evt) {
    const header = evt.target;
    const dropdown = header.closest('.dropdown');
    const caret = header.querySelector('.caret');
    dropdown.classList.toggle('active');
    caret.classList.toggle('up', dropdown.classList.contains('active'));
    caret.classList.toggle('down', !dropdown.classList.contains('active'));
}