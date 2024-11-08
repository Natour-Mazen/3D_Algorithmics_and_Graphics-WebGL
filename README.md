# Deuxième Jalon - A3D2

## Auteurs
- AL NATOUR Mazen
- HERVOUET Léo

## Sommaire
- [Deuxième Jalon - A3D2](#deuxième-jalon---a3d2)
  - [Fonctionnalités Incluses (Jalon 2)](#fonctionnalités-incluses-jalon-2)
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
      - [`geometricObjects/boundingBox.js`](#geometricobjectsboundingboxjs)
    - [`src/view/`](#srcview)
      - [`utilsUI.js`](#utilsuijs)
      - [`objectsUIMenu.js`](#objectsuimenujs)
      - [`heightMapUIMenu.js`](#heightmapuimenujs)
      - [`bumpMapUIMenu.js`](#bumpmapuimenujs)
      - [`boundingBoxUIMenu.js`](#boundingboxuimenujs)
      - [`lightUIMenu.js`](#lightuimenujs)
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
  - [Explication des fonctionnalités du Jalon 2](#explication-des-fonctionnalités-du-jalon-2)
  - [Remarques](#remarques)
  


## Fonctionnalités Incluses (Jalon 2)

- Empêcher la camera d'aller "en dessous"
- Boite englobante, avec les options d'afficher juste la height map, les murs interieurs en opaque en couleur et avec en fils de fer de couleurs).
- Lancer de rayon sur une carte de hauteur avec le ray marching
- Choix entre différentes cartes de hauteur (avec la composante 'R' (RGB) ou la composante 'L' (LAB))
- Application une seconde texture sur la carte de hauteur.
- Utiliser une texture de couleur pour faire une carte de hauteur (pour avoir la hauteur et la couleur de la texture).
- Dlider pour gérer la hauteur de la texture.
- Optimisation du parcours avec le bon delta T.

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

#### `geometricObjects/boundingBox.js`
- Ce fichier définit la classe BoundingBox, qui hérite de ObjectToDraw. Cette classe est responsable de la création et du rendu d'une boîte englobante.
  Elle configure les paramètres des shaders, les uniformes et les buffers nécessaires pour dessiner la boîte englobante.

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

#### `boundingBoxUIMenu.js`
- Ce fichier gère les composants UI liés à la boîte englobante. Il inclut des fonctions pour gérer la visibilité de la boîte englobante,
  la visibilité des différentes cartes de hauteurs, leurs tailles, textures, etc., l'initialisation des composants UI
  pour la boîte englobante.

#### `lightUIMenu.js`
- Ce fichier gère les composants UI liés à la lumière. Il inclut des fonctions pour gérer la couleur de la lumière, l'intensité de la lumière,
  la position de la lumière, l'atténuation de la lumière, la visibilité de la lumière, le choix du type de lumiere utilisé (Lambert ou Phong) etc.,
  et l'initialisation des composants UI pour la lumière.

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

## Explication des nouvelles fonctionnalités faite dans le Jalon 2
- Le Jalon 2 inclut toutes les fonctionnalités du Jalon 1 et ajoute les fonctionnalités suivantes :
  - Empêcher la caméra d'aller "en dessous" en bloquant la caméra à une certaine hauteur dans le fichier callbacks.js.
  - L'ajout du **choix de la luminosité entre Lambert et Phong** pour toutes les fonctionnalités qui utilisent la lumière (excepté la boite englobante)
    cela a impliqué de changer les shaders en injectant le code de la luminosité donc nous avons ajouté une fonction dans le fichier shaders.js pour 
    injecter le code de la luminosité dans les shaders pour pouvoir utiliser la luminosité de Phong ou Lambert.
  - L'ajout de la **boite englobante**, avec les options d'afficher juste la height map, les murs intérieurs en couleur et avec en fils de fer de couleurs
  - **Ray Marching (explication) :**  
    Pour afficher notre height map en 3D, nous utilisons cette fois-ci le ray marching, qui consiste à lancer des rayons 
    et à calculer l'intersection avec la map pour pouvoir afficher les points de couleur sur une boîte placée au-dessus 
    de la height map. Pour obtenir l'intersection avec la map, nous parcourons notre rayon avec un pas régulier, et en 
    fonction de la position x,y, nous pouvons déterminer la hauteur du rayon par rapport à la map.  
    <br/>
    Cette technique que nous utilisons n'est pas parfaite. En effet, nous pouvons voir que sur les textures où il y a des 
    pics verticaux vers le bas ou le haut, la technique que nous utilisons avec un pas régulier n'est pas optimale car elle 
    peut manquer des pixels sur la map, ce qui engendre un non-affichage de ces pics.
    Une solution pour résoudre cela est d'utiliser l'algorithme de Bresenham pour passer par tous les pixels et donc 
    éviter le problème précédent (utilisation d'un pas variable cette fois-ci).  
    <br/>
    Pour commencer, l'algorithme de Bresenham est un algorithme qui peut manquer des pixels. Il faut donc une version 
    modifiée pour ne pas en manquer. Cette version modifiée permet d'obtenir tous les pixels par lesquels notre rayon 
    passe. Ensuite, nous parcourons tous les pixels au fil du calcul pour savoir si notre rayon est en dessous ou 
    au-dessus de la map. En fonction de cela, nous pouvons déterminer quand notre rayon intersecte avec la map.  
    <br/>
    Une fois que nous avons une intersection avec deux points en dessous et deux points au-dessus de la map 
    (un point sur le rayon et un point dans le même axe que le rayon, mais avec le 'z' que nous récupérons de la map), 
    nous pouvons utiliser ces quatre points pour former deux lignes : une qui est celle du rayon et l'autre entre les deux 
    points récupérés de la map. Avec ces deux lignes, nous trouvons l'intersection qui nous donne notre point à afficher.  
    <br/>
    Cette technique fonctionne en théorie, mais nous n'avons pas réussi à l'implémenter par manque de temps.  

## Remarques
- L'interface utilisateur est entièrement générée en JavaScript pour permettre une interaction dynamique.
- L'application a été testée plusieurs fois et tout fonctionne correctement sans erreurs
















