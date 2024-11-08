/**
 * - This script is used to load all the scripts in the correct order.
 * - In a real project, you would use a bundler like Webpack or Parcel to do this.
 * - This is just a simple way to do it without any bundler. and it's not recommended for a real project,
 *   because it has some security issues like:
 *      --> client-side-unvalidated-url-redirection who allowed unvalidated redirection based on user-specified URLs
 *  - this can be used to redirect users to malicious websites, in our case, we are not using any user input so it's safe,
 *     and we are on our local machine.
 */


doc.addEventListener('DOMContentLoaded', () => {
    const scripts = [
        // ============== RENDERING ==============
        'src/rendering/glMatrix.js',
        'src/rendering/callbacks.js',
        'src/utils/color.js',
        'src/utils/light.js',
        'src/rendering/textureLoader.js',
        // ============== SHADERS ==============
        'src/shaders/shaders.js',
        // ============== OBJECTS ==============
        'src/objects/objectToDraw.js',
        'src/objects/entitiesObjects/objLoader.js',
        'src/objects/geometricObjects/plane.js',
        'src/objects/geometricObjects/heightMap.js',
        'src/objects/geometricObjects/boundingBox.js',
        'src/objects/entitiesObjects/bumpMap.js',
        'src/objects/entitiesObjects/objmesh.js',
        // ============== VIEW ==============
        'src/view/utilsUI.js',
        'src/view/objectsUIMenu.js',
        'src/view/bumpMapUIMenu.js',
        'src/view/heightMapUIMenu.js',
        'src/view/lightUIMenu.js',
        'src/view/boundingBoxUIMenu.js',
        // ============== MAIN ==============
        'src/main.js'
    ];

    loadScriptsSequentially(scripts, () => {
        webGLStart();
    });
});

function loadScriptsSequentially(scripts, callback) {
    let index = 0;

    function loadNextScript() {
        if (index < scripts.length) {
            const script = doc.createElement('script');
            script.src = scripts[index];
            script.onload = () => {
                index++;
                loadNextScript();
            };
            doc.head.appendChild(script);
        } else {
            callback();
        }
    }

    loadNextScript();
}