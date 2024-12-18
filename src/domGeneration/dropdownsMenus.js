const dropdowns = [
    {
        title: 'Light',
        items:
        [
            { type: 'select', label: 'Type', id: 'light_shaderType_selector', options: [] },
            { type: 'color', label: 'Color:', id: 'light_color', value: '#ffffff' },
            { type: 'slider', label: 'Light Intensity:', id: 'lightIntensity_slider', min: 1, max: 6, step: 1, value: 1, displayId: 'lightIntensity_value' },
            { type: 'slider', label: 'Light Shininess:', id: 'lightShininess_slider', min: 1, max: 10, step: 1, value: 1, displayId: 'lightShininess_value' },
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

            { type: 'select', label: 'Type', id: 'bump_map_selector', options: ['None'] },
            { type: 'select', label: 'Texture', id: 'bump_map_texture_selector', options: ['None'] },
        ]
    },
    {
        title: 'Bounding Box Ray Marching',
        items: [
            { type: 'checkbox', label: 'BoundingBox', id: 'boundingBoxRM_checkbox', checked: false },
            { type: 'select', label: 'Border', id: 'boundingBoxRM_border_selector', options: [] },
            { type: 'slider', label: 'Size:', id: 'boundingBoxRM_size_slider', min: 1, max: 10, step: 1, value: 1, displayId: 'boundingBoxRM_size_value' },
            { type: 'select', label: 'Type', id: 'boundingBoxRM_type_selector', options: ['None'] },
            { type: 'select', label: 'Texture', id: 'boundingBoxRM_heightMap_texture_selector', options: ['None'] },
            { type: 'slider', label: 'Flatten Factor:', id: 'boundingBoxRM_heightMap_flatten_slider', min: 1, max: 10, step: 1, value: 1, displayId: 'boundingBoxRM_heightMap_flatten_value' },
        ]
    },
    {
        title: 'Bounding Box Volume Ray Casting',
        items: [
            { type: 'checkbox', label: 'BoundingBox', id: 'boundingBoxVRC_checkbox', checked: false },
            { type: 'select', label: 'Border', id: 'boundingBoxVRC_border_selector', options: [] },
            { type: 'slider', label: 'Size:', id: 'boundingBoxVRC_size_slider', min: 1, max: 10, step: 1, value: 1, displayId: 'boundingBoxVRC_size_value' },
            { type: 'select', label: 'Type', id: 'boundingBoxVRC_type_selector', options: ['None'] },
            { type: 'select', label: 'Transfer Func', id: 'boundingBoxVRC_voxelMap_transferFunc_selector', options: [] },
            { type: 'modal', id: 'boundingBoxVRC_transferFuncCustom_modal', idBody: 'boundingBoxVRC_transferFuncCustom_modalBody' },
            { type: 'slider', label: 'Voxel intensity:', id: 'boundingBoxVRC_voxelMap_voxel-intensity', min: 1, max: 100, step: 1, value: 1, displayId: 'boundingBoxVRC_voxelMap_voxel-intensity_value' },
            { type: 'slider', label: 'Ray Depth:', id: 'boundingBoxVRC_voxelMap_ray_depth_slider', min: 1, max: 50, step: 1, value: 1, displayId: 'boundingBoxVRC_voxelMap_ray_depth_value' }
        ]
    },
];