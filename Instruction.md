# Jalon 3


## Config

In firefox :  
about:config --> security.fileuri.strict_origin_policy --> true to false  

Open the .html file in firefox.  

## TODO (in French)
L'objectif est de réaliser un lancer de rayon volumique avec une fonction de transfert pour le calcul de transparence et de la couleur.

- Construire la géométrie d'une boite englobante, mettre les options pour l'afficher (ou non, en opaque, fils de fer, etc.)
- Faire le lancer de rayon.
- IMPORTANT : WebGL ne permet pas de faire une texture 3D, pour palier à cela il suffit d'utiliser de manière 
intelligente les textures 2D pour stocker des séries d'images 3D. **Expliquez comment vous avez fait**.
- Faire une fonction de transfert paramétrable.
- Pouvoir choisir le modèle à visualiser.
- Choisir quelles tranches de la texture 3D afficher.

## TODO (in English)

The goal is to implement volumetric ray casting with a transfer function to calculate transparency and color.

- Build the geometry of a bounding box, with options to display it (or not, in opaque, wireframe, etc.).
- Perform the ray casting.
- IMPORTANT: WebGL does not support 3D textures, so to overcome this, you can intelligently use 2D textures to store 
3D image slices. **Explain how you did this**.
- Implement a configurable transfer function.
- Allow selection of the model to visualize.
- Choose which slices of the 3D texture to display.