# Troisième Jalon - A3D2

## Auteurs
- AL NATOUR Mazen
- HERVOUET Léo


## Sommaire
- [Troisième Jalon - A3D2](#troisième-jalon---a3d2)
  - [Fonctionnalités Incluses (Jalon 3)](#fonctionnalités-incluses-jalon-3)
  - [Structure des Fichiers](#structure-des-fichiers)
    <details>

    - [`main.html`](#mainhtml)
    - [`src/main.js`](#srcmainjs)
    - [`src/domGeneration/`](#srcdomgeneration)
      - [`dropdownsMenus.js`](#dropdownsmenusjs)
      - [`menuGenerator.js`](#menugeneratorjs)
      - [`scriptsLoader.js`](#scriptsloaderjs)
    - [`src/objects/`](#srcobjects)
      - [`objectToDraw.js`](#objecttodrawjs)
      - [`entitiesObjects/objmesh.js`](#entitiesobjectsobjmeshjs)
      - [`geometricObjects/plane.js`](#geometricobjectsplanejs)
      - [`entitiesObjects/bumpMap.js`](#entitiesobjectsbumpmapjs)
      - [`geometricObjects/heightMap.js`](#geometricobjectsheightmapjs)
      - [`geometricObjects/boundingBox`](#geometricobjectsboundingbox)
        - [`boundingBox.js`](#boundingboxjs)
        - [`boundingBoxBorderType.js`](#boundingboxbordertypejs)
        - [`boundingBoxRM.js`](#boundingboxrmjs)
        - [`boundingBoxVRC.js`](#boundingboxvrcjs)
    - [`src/view/`](#srcview)
      - [`utilsUI.js`](#utilsuijs)
      - [`objectsUIMenu.js`](#objectsuimenujs)
      - [`heightMapUIMenu.js`](#heightmapuimenujs)
      - [`bumpMapUIMenu.js`](#bumpmapuimenujs)
      - [`lightUIMenu.js`](#lightuimenujs)
      - [`view/boundingBoxUIMenus`](#viewboundingboxuimenus)
        - [`boundingBoxUIMenu.js`](#boundingboxuimenujs)
        - [`boundingBoxRMUIMenu.js`](#boundingboxrmuimenujs)
        - [`boundingBoxVRCUIMenu.js`](#boundingboxvrcuimenujs)
    - [`utils/`](#utils)
      - [`color.js`](#colorjs)
      - [`light.js`](#lightjs)
    - [`rendering/`](#rendering)
      - [`callbacks.js`](#callbacksjs)
      - [`textureLoader.js`](#textureloaderjs)
      - [`glMatrix.js`](#glmatrixjs)
    - [`shaders/`](#shaders)
        - [`shaders.js`](#shadersjs)
    - [`css/`](#css)
    
    </details>
  - [Instructions pour Exécuter le Projet](#instructions-pour-exécuter-le-projet)
  - [Explication des nouvelles fonctionnalités faite dans le Jalon 3](#explication-des-nouvelles-fonctionnalités-faite-dans-le-jalon-3)
  - [Remarques](#remarques)
  


## Fonctionnalités Incluses (Jalon 3)

- Une seconde boîte englobante qui utilise un lancer de rayon volumique pour visualiser des objets.
- Affichage de cette boîte sans options, avec les faces intérieures colorées (opaques) ou avec seulement les coins de 
la boîte colorés (fils de fer).
- Affichage variable avec différentes fonctions de transfert prédéfinies et une paramétrable (Custom).
- Affichage de quatre objets : des noisettes, une fleur, une coque de châtaigne et un tronc d’arbre.
- Possibilité de changer l’intensité des voxels des images (Slider Voxel Intensity).
- Possibilité de changer le seuil des voxels selon leurs intensités de couleur (Slider Voxel Noise).
- Possibilité de choisir quelles tranches de la boîte englobante afficher (Slices Display).

## Structure des Fichiers

### `main.html`
- Contient la structure de base de la page Web, incluant le canvas WebGL et quelques menus interactifs non générés dynamiquement.

### `src/main.js`
- Ce fichier initialise le contexte WebGL, configure les matrices de transformation, et gère la boucle de rendu principale.
  Il contient également des fonctions pour redimensionner le canvas et dessiner la scène.

### `src/domGeneration/`

#### `dropdownsMenus.js`
- Ce fichier contient la configuration des menus déroulants pour l'interface utilisateur.
  Chaque menu déroulant est défini par un titre et une liste d'éléments (comme des cases à cocher, des sélecteurs, des curseurs, etc.).
  Ces éléments permettent à l'utilisateur de sélectionner et de manipuler les objets 3D, les cartes de hauteur, et les bump maps.

#### `menuGenerator.js`
- Ce fichier génère dynamiquement les menus déroulants basés sur la configuration définie dans `dropdownsMenus.js`.
  Il crée les éléments HTML nécessaires pour chaque menu et les ajoute à la page.
  Il gère également les interactions de l'utilisateur avec les menus, comme l'ouverture et la fermeture des menus déroulants.

#### `scriptsLoader.js`
- Ce fichier charge les scripts nécessaires dans le bon ordre pour initialiser l'application WebGL.
  Il utilise une méthode simple pour charger les scripts séquentiellement, en s'assurant que chaque script est chargé avant de passer au suivant.
  Une fois tous les scripts chargés, il appelle la fonction `webGLStart` pour démarrer l'application.

### `src/objects/`

#### `objectToDraw.js`
- Ce fichier définit la classe abstraite ObjectToDraw, qui sert de base pour tous les objets dessinables.
  Elle contient des méthodes communes pour initialiser les buffers, configurer les paramètres des shaders,
  définir les uniformes et dessiner les objets.

#### `entitiesObjects/objmesh.js`
- Ce fichier définit la classe ObjMesh, qui hérite de ObjectToDraw. Cette classe est responsable du chargement et du rendu des fichiers .obj.
  Elle configure les paramètres des shaders et les uniformes nécessaires pour dessiner les objets 3D.

#### `geometricObjects/plane.js`
- Ce fichier définit la classe Plane, qui hérite de ObjectToDraw. Cette classe est responsable de la création et du rendu d'un plan simple.
  Elle configure les paramètres des shaders, les uniformes et les buffers nécessaires pour dessiner le plan.

#### `entitiesObjects/bumpMap.js`
- Ce fichier définit la classe BumpMap, qui hérite de Plane. Cette classe est responsable de l'application des bump maps sur les plans.
  Elle configure les paramètres des shaders, les uniformes et les buffers nécessaires pour dessiner les plans avec des bump maps.

#### `geometricObjects/heightMap.js`
- Ce fichier définit la classe HeightMap, qui hérite de ObjectToDraw.
  Cette classe est responsable de la génération et du rendu des terrains à partir de cartes de hauteur.
  Elle configure les paramètres des shaders, les uniformes et les buffers nécessaires pour dessiner les terrains.

#### `geometricObjects/boundingBox`

##### `boundingBox.js`
- Ce fichier définit la classe abstraite BoundingBox, qui hérite de ObjectToDraw. Cette classe est responsable de la création et du rendu d'une boîte englobante générique.
  Elle configure les paramètres des shaders, les uniformes et les buffers nécessaires pour dessiner la boîte englobante.
  Cette classe doit être étendue pour implémenter des méthodes spécifiques de rendu de boîte englobante.

##### `boundingBoxBorderType.js`
- Ce fichier définit l'énumération BoundingBoxBorderType, qui contient les différents types de rendu de boîte englobante.
  Les types incluent les faces intérieures colorées (opaques), les faces extérieures colorées (fils de fer), etc.

##### `boundingBoxRM.js`
- Ce fichier définit la classe BoundingBoxRM qui effectue le ray marching, qui hérite de BoundingBox. Cette classe est responsable de la création et du rendu de la boîte englobante en mode ray marching.
  Elle configure les paramètres des shaders, les uniformes, les buffers et les méthodes nécessaires pour dessiner la boîte englobante en ray marching.

##### `boundingBoxVRC.js`
- Ce fichier définit la classe BoundingBoxVRC qui effectue le volume rendering, qui hérite de BoundingBox. Cette classe est responsable de la création et du rendu de la boîte englobante volume ray rendering.
  Elle configure les paramètres des shaders, les uniformes, les buffers et les méthodes nécessaires pour dessiner la boîte englobante en volume ray rendering.

### `src/view/`

#### `utilsUI.js`
- Ce fichier contient des fonctions utilitaires pour gérer l'interface utilisateur, telles que l'ouverture et la fermeture des menus,
  le basculement de la visibilité, et l'initialisation de divers composants UI comme les sélecteurs, les sélecteurs de couleur, les curseurs,
  les bascules et les interrupteurs.

#### `objectsUIMenu.js`
- Ce fichier gère les composants UI liés à la manipulation des objets. Il inclut des fonctions pour gérer la sélection des objets,
  mettre à jour la bascule du plan, définir l'état du plan, mettre à jour l'échelle des objets, et initialiser les composants UI pour
  la manipulation des objets.

#### `heightMapUIMenu.js`
- Ce fichier gère les composants UI liés aux cartes de hauteur.
  Il inclut des fonctions pour gérer la création de cartes de hauteur, la sélection, la mise à jour de l'échelle, la gestion de
  l'interrupteur de la carte de hauteur, et l'initialisation des composants UI pour les cartes de hauteur.

#### `bumpMapUIMenu.js`
- Ce fichier gère les composants UI liés aux bump maps. Il inclut des fonctions pour gérer la création de bump maps,
  réinitialiser les paramètres des bump maps, charger les textures, lier les shaders, mettre à jour la couleur de la lumière,
  et initialiser les composants UI pour les bump maps.

#### `lightUIMenu.js`
- Ce fichier gère les composants UI liés à la lumière. Il inclut des fonctions pour gérer la couleur de la lumière, l'intensité de la lumière,
  la position de la lumière, l'atténuation de la lumière, la visibilité de la lumière, le choix du type de lumiere utilisé (Lambert ou Phong) etc.,
  et l'initialisation des composants UI pour la lumière.

#### `view/boundingBoxUIMenus`

##### `boundingBoxUIMenu.js`
- Ce fichier gère des méthodes génériques pour la boîte englobante. Afin qu'il soit utilise par les fichiers boundingBoxRMUIMenu.js et boundingBoxVRCUIMenu.js.
  Cela pour éviter la redondance de code.

##### `boundingBoxRMUIMenu.js`
- Ce fichier gère les composants UI liés à la boîte englobante en mode ray marching. Il inclut des fonctions pour gérer la visibilité de la boîte englobante,
  la visibilité des différentes cartes de hauteurs, leurs tailles, textures, etc., l'initialisation des composants UI
  pour la boîte englobante en mode ray marching.

##### `boundingBoxVRCUIMenu.js`
- Ce fichier gère les composants UI liés à la boîte englobante en volume ray rendering. Il inclut des fonctions pour gérer la visibilité de la boîte englobante,
  la visibilité des différentes voxelMap, affichage des tranches, intensité des voxel, leurs tailles, textures, etc., l'initialisation des composants UI
  pour la boîte englobante en volume ray rendering.

### `utils/`

#### `color.js`
- Ce fichier contient des fonctions utilitaires pour manipuler les couleurs, telles que la conversion entre les espaces de couleurs,
  la génération de couleurs aléatoires, la génération de couleurs à partir de valeurs RGB, etc.

#### `light.js`
- Ce fichier contient la classe Light, qui définit une source de lumière pour la scène.
  Elle contient des propriétés pour la position, la couleur, l'intensité, l'atténuation, etc.

### `rendering/`

#### `callbacks.js`
- Ce fichier contient des fonctions de rappel pour les événements de la souris, tels que le clic, le déplacement, la rotation, etc.
  Ces fonctions sont utilisées pour interagir avec les objets 3D, les cartes de hauteur, les bump maps, etc.

#### `textureLoader.js`
- Ce fichier contient des fonctions utilitaires pour charger des textures à partir de fichiers image.
  Il contient des méthodes pour charger des textures 2D, etc.

#### `glMatrix.js`
- Ce fichier contient la bibliothèque glMatrix, qui fournit des fonctions pour la manipulation des matrices et des vecteurs en WebGL.
  Elle contient des fonctions pour la création, la multiplication, l'inversion, la transposition, etc. des matrices et des vecteurs.

### `shaders/`

#### `shaders.js`
- Ce fichier contient des fonctions pour charger et compiler les shaders. Il inclut des méthodes pour charger les shaders communs,
    injecter du code commun dans les shaders, compiler les shaders et lier les programmes de shaders.

### `css/`
- Contient les fichiers CSS pour le style de la page Web et des composants de l'interface utilisateur.


## Instructions pour Exécuter le Projet
1. Bien changé la configuration de Firefox avec : about:config --> security.fileuri.strict_origin_policy --> true to false
2. Ouvrez `main.html` dans Firefox.
3. Utilisez les menus pour interagir avec les objets 3D et ajuster les paramètres de visualisation.
4. Vous pourrez si vous le souhaitez, bouger avec la souris pour changer l'angle de vue ainsi que bouger dans l'espace avec les touches :
   - Z : Avancer
   - S : Reculer
   - Q : Aller à gauche
   - D : Aller à droite
   - Espace : Monter
   - Shift : Descendre

## Explication des nouvelles fonctionnalités faite dans le Jalon 3
Le Jalon 3 inclut toutes les fonctionnalités du Jalon 2 et ajoute les fonctionnalités demandées

### Explication du choix de stockage d’image
Pour nous permettre de transmettre les images du JavaScript vers le shader (GLSL), nous avons choisi d’envoyer une seule 
image vers le shader via une texture. Cette image est composée de plusieurs images, qui sont des tranches de l’objet 3D.
L’objet est chargé, puis découpé en tranches sur l’axe vertical pour chaque pixel. Ensuite, nous disposons les images 
les unes à côté des autres sous forme de grille.
Une fois la texture importée dans le shader (avec la taille de la grille), nous pouvons savoir, pour chaque hauteur de 
notre rayon, quelle texture utiliser pour afficher le bon voxel.

Cette méthode permet de réduire l’espace mémoire du projet. En effet, les fichiers .raw fournis par 
le site de référence étaient beaucoup trop volumineux (plusieurs gigaoctets). Cette technique permet donc de compresser 
ces fichiers .raw en données plus faciles à charger pour le navigateur. Elle permet aussi de nettoyer les .raw, car pour 
la coque de châtaigne et le tronc d’arbre, les données n’étaient pas affichables simplement.

De plus, cela permet de gérer différentes qualités d’affichage :
- LQ pour "Low Quality",
- NQ pour "Normal Quality",
- HQ pour "High Quality".

L’utilisation de textures permet également d’interpoler les couleurs en fonction de la position sur la texture, ce qui 
offre un rendu moins pixelisé, même si l’image est de moins bonne qualité que l’objet original contenu dans le fichier .raw.

Pour la création de ces images, nous avons développé un script Python qui utilise les fichiers .raw et .dat fournis 
par le site pour générer les images nécessaires. Ce script se trouve dans le dossier "script".


### Explication de la function de transfert Custom
La fonction de transfert custom permet de créer une texture 1D (de taille 1000, donc 1000 couleurs) représentant un gradient horizontal défini par des couleurs 
et des positions données. Les couleurs intermédiaires sont calculées par interpolation linéaire entre ces points. 
La texture générée est ensuite utilisée dans le shader pour transformer une couleur en fonction de sa transparence (alpha) : 
la valeur alpha sert de coordonnée pour récupérer la couleur correspondante dans le gradient. 

Bonus : vous pouvez enregistrer la texture générée en png en cliquant sur le bouton "Save as PNG".

## Remarques
- L'interface utilisateur est entièrement générée en JavaScript pour permettre une interaction dynamique.
- L'application a été testée plusieurs fois et tout fonctionne correctement sans erreurs
















