# Premier Jalon - A3D2

## Auteurs
- AL NATOUR Mazen
- HERVOUET Léo

## Fonctionnalités Incluses

- Chargement et affichage de plusieurs objets 3D à partir de fichiers .obj.
- Visualisation interactive de plusieurs objets 3D.
- Génération de terrain à partir d'une carte de hauteur avec options de texture et de couleur.
- Affichage du terrain en mode "fils de fer".
- Rivière ou océan texturé avec une bump map utilisant le modèle de Lambert.
- Source de lumière positionnée en (0,0,0).
- BONUS : Spécularité avec le modèle de Blinn-Phong.
- Interface JavaScript pour choisir le terrain, les textures, les bump maps.

## Structure des Fichiers

### `main.html`
- Contient la structure de base de la page Web, incluant le canvas WebGL et les menus interactifs.

### `src/main.js`
- Ce fichier initialise le contexte WebGL, configure les matrices de transformation, et gère la boucle de rendu principale. Il contient également des fonctions pour redimensionner le canvas et dessiner la scène.


### `src/domGeneration/dropdownsMenus.js`
- Ce fichier contient la configuration des menus déroulants pour l'interface utilisateur. Chaque menu déroulant est défini par un titre et une liste d'éléments (comme des cases à cocher, des sélecteurs, des curseurs, etc.). Ces éléments permettent à l'utilisateur de sélectionner et de manipuler les objets 3D, les cartes de hauteur, et les bump maps.

### `src/domGeneration/menuGenerator.js`
- Ce fichier génère dynamiquement les menus déroulants basés sur la configuration définie dans `dropdownsMenus.js`. Il crée les éléments HTML nécessaires pour chaque menu et les ajoute à la page. Il gère également les interactions de l'utilisateur avec les menus, comme l'ouverture et la fermeture des menus déroulants.

### `src/domGeneration/scriptsLoader.js`
- Ce fichier charge les scripts nécessaires dans le bon ordre pour initialiser l'application WebGL. Il utilise une méthode simple pour charger les scripts séquentiellement, en s'assurant que chaque script est chargé avant de passer au suivant. Une fois tous les scripts chargés, il appelle la fonction `webGLStart` pour démarrer l'application.

### `css/`
- Contient les fichiers CSS pour le style de la page Web et des composants de l'interface utilisateur.
 
### `src/objects/entitiesObjects/objmesh.js`
- Ce fichier définit la classe ObjMesh, qui hérite de ObjectToDraw. Cette classe est responsable du chargement et du rendu des fichiers .obj. Elle configure les paramètres des shaders et les uniformes nécessaires pour dessiner les objets 3D.

### `src/objects/entitiesObjects/bumpMap.js`
- Ce fichier définit la classe BumpMap, qui hérite de Plane. Cette classe est responsable de l'application des bump maps sur les plans. Elle configure les paramètres des shaders, les uniformes et les buffers nécessaires pour dessiner les plans avec des bump maps.

### `src/objects/geometricObjects/heightMap.js`
- Ce fichier définit la classe HeightMap, qui hérite de ObjectToDraw. Cette classe est responsable de la génération et du rendu des terrains à partir de cartes de hauteur. Elle configure les paramètres des shaders, les uniformes et les buffers nécessaires pour dessiner les terrains.

### `src/objects/geometricObjects/plane.js`
- Ce fichier définit la classe Plane, qui hérite de ObjectToDraw. Cette classe est responsable de la création et du rendu d'un plan simple. Elle configure les paramètres des shaders, les uniformes et les buffers nécessaires pour dessiner le plan.

### `src/objects/objectToDraw.js`
- Ce fichier définit la classe abstraite ObjectToDraw, qui sert de base pour tous les objets dessinables. Elle contient des méthodes communes pour initialiser les buffers, configurer les paramètres des shaders, définir les uniformes et dessiner les objets.

### `src/view/utilsUI.js`
- Ce fichier contient des fonctions utilitaires pour gérer l'interface utilisateur, telles que l'ouverture et la fermeture des menus, le basculement de la visibilité, et l'initialisation de divers composants UI comme les sélecteurs, les sélecteurs de couleur, les curseurs, les bascules et les interrupteurs.

### `src/view/objectsUIMenu.js`
- Ce fichier gère les composants UI liés à la manipulation des objets. Il inclut des fonctions pour gérer la sélection des objets, mettre à jour la bascule du plan, définir l'état du plan, mettre à jour l'échelle des objets, et initialiser les composants UI pour la manipulation des objets.

### `src/view/heightMapUIMenu.js`
- Ce fichier gère les composants UI liés aux cartes de hauteur. Il inclut des fonctions pour gérer la création de cartes de hauteur, la sélection, la mise à jour de l'échelle, la gestion de l'interrupteur de la carte de hauteur, et l'initialisation des composants UI pour les cartes de hauteur.

### `src/view/bumpMapUIMenu.js`
- Ce fichier gère les composants UI liés aux bump maps. Il inclut des fonctions pour gérer la création de bump maps, réinitialiser les paramètres des bump maps, charger les textures, lier les shaders, mettre à jour la couleur de la lumière, et initialiser les composants UI pour les bump maps.

## Instructions pour Exécuter le Projet
1. Bien changé la configuration de Firefox avec : about:config --> security.fileuri.strict_origin_policy --> true to false
2. Ouvrez `main.html` dans un navigateur Web.
3. Utilisez les menus pour interagir avec les objets 3D et ajuster les paramètres de visualisation.

## Remarques
- Ce projet utilise WebGL pour le rendu des objets 3D et des terrains.
- L'interface utilisateur est entièrement générée en JavaScript pour permettre une interaction dynamique.
- L'application a été testée plusieurs fois et tout fonctionne correctement sans erreurs.