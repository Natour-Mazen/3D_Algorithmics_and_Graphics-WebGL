const dropdowns = [
    {
        title: 'Objects',
        items: [
            { type: 'checkbox', label: 'Plane', id: 'plane_checkbox', checked: true },
            { type: 'select', label: 'Objects', id: 'models_select', options: ['None'] },
            { type: 'color', label: 'Colors:', id: 'model_color', value: '#ffff00' },
            { type: 'slider', label: 'Scale:', id: 'scale_slider', min: 5, max: 20, step: 1, value: 0, displayId: 'scale_value' }
        ]
    },
    {
        title: 'HeightMap',
        items: [
            { type: 'checkbox', label: 'On/Off', id: 'heightMap_checkbox' },
            { type: 'select', label: 'Type', id: 'heightMap_selector', options: ['None'] },
            { type: 'select', label: 'Texture', id: 'heightMap_texture_selector', options: ['None'] },
            { type: 'color', label: 'Colors:', id: 'heightMap_color', value: '#3f9cc0' },
            { type: 'slider', label: 'Scale:', id: 'heightMap_scale_slider', min: 1, max: 10, step: 1, value: 0, displayId: 'heightMap_scale_value' },
            { type: 'slider', label: 'Flatten Factor:', id: 'heightMap_flatten_slider', min: 1, max: 10, step: 1, value: 0, displayId: 'heightMap_flatten_value' }
        ]
    },
    {
        title: 'Bump Map',
        items: [
            { type: 'select', label: 'Type', id: 'bump_map_selector', options: ['None'] },
            { type: 'select', label: 'Texture', id: 'bump_map_texture_selector', options: ['None'] },
            { type: 'color', label: 'Colors:', id: 'bump_map_color', value: '#3f9cc0' }
        ]
    },
    // {
    //     title: 'Terrain',
    //     items: [
    //         { type: 'select', label: 'Type', id: 'ground_select', options: ['None'] },
    //         { type: 'select', label: 'Terrain', id: 'terrain_selector', options: ['None'] }
    //     ]
    // }
];