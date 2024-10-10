const dropdowns = [
    {
        title: 'Light',
        items:
        [
            { type: 'color', label: 'Color:', id: 'light_color', value: '#ffffff' },
            { type: 'slider', label: 'Light Intensity:', id: 'lightIntensity_slider', min: 1, max: 6, step: 1, value: 1, displayId: 'lightIntensity_value' },

        ]
    },
    {
        title: 'Objects',
        items: [
            { type: 'checkbox', label: 'Plane', id: 'plane_checkbox', checked: true },
            { type: 'select', label: 'Objects', id: 'models_select', options: ['None'] },
            { type: 'color', label: 'Colors:', id: 'model_color', value: '#cccccc' },
            { type: 'slider', label: 'Scale:', id: 'scale_slider', min: 5, max: 20, step: 1, value: 0, displayId: 'scale_value' }
        ]
    },
    {
        title: 'Height Map',
        items: [
            { type: 'checkbox', label: 'WireFrame', id: 'heightMap_checkbox' },
            { type: 'select', label: 'Type', id: 'heightMap_selector', options: ['None'] },
            { type: 'switch', label1: 'Texture', label2: 'Color', id: 'heightMap_switch' },
            { type: 'select', label: 'Texture', id: 'heightMap_texture_selector', options: ['None'] },
            { type: 'slider', label: 'Scale:', id: 'heightMap_scale_slider', min: 1, max: 10, step: 1, value: 1, displayId: 'heightMap_scale_value' },
            { type: 'slider', label: 'Flatten Factor:', id: 'heightMap_flatten_slider', min: 1, max: 10, step: 1, value: 1, displayId: 'heightMap_flatten_value' }
        ]
    },
    {
        title: 'Bump Map',
        items: [
            { type: 'select', label: 'Shader', id: 'bump_map_shader_selector', options: ['None'] },
            { type: 'select', label: 'Type', id: 'bump_map_selector', options: ['None'] },
            { type: 'select', label: 'Texture', id: 'bump_map_texture_selector', options: ['None'] },
            { type: 'slider', label: 'Light Shininess:', id: 'bump_map_lightShininess_slider', min: 1, max: 10, step: 1, value: 1, displayId: 'bump_map_lightShininess_value' },
        ]
    },
    {
        title: 'Bounding Box',
        items: [
            { type: 'checkbox', label: 'On/off', id: 'boundingBox_checkbox', checked: false },
            { type: 'switch', label1: 'WireFrame', label2: 'Opaque', id: 'boundingBox_switch' },
            { type: 'select', label: 'Height Map Type', id: 'boundingBox_heightMap_texture_selector', options: ['None'] },
            { type: 'select', label: 'Height Map Texture', id: 'boundingBox_heightMap_texture_selector', options: ['None'] },
            { type: 'slider', label: 'Scale:', id: 'boundingBox_heightMap_scale_slider', min: 1, max: 10, step: 1, value: 1, displayId: 'boundingBox_heightMap_scale_value' },
            { type: 'slider', label: 'Flatten Factor:', id: 'boundingBox_heightMap_flatten_slider', min: 1, max: 10, step: 1, value: 1, displayId: 'boundingBox_heightMap_flatten_value' }

        ]
    },
];