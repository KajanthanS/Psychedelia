// ********************************** IMPORTATION LIBRAIRIE THREE.JS ********************************

import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";

// Permet la camera de bouger à travers la scène
import {
  OrbitControls
} from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";

// Permet d'importer le fichier .gltf
import {
  GLTFLoader
} from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

//Création d'une scène Three.js
const scene = new THREE.Scene();



// ********************************** VARIABLES ********************************
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight

}

//Création d'une nouvelle caméra et définition de la position
const camera = new THREE.PerspectiveCamera(40, sizes.width / sizes.height, 1, 1000);
camera.position.set(7, 4, 1);
scene.add(camera)


// Permet de savoir ou la souris est situé afin de faire bouger le modèle 3D
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

// Page loader
const loadingPage = document.getElementById("loadingPage");

// Message loader
const loadingMessage = document.getElementById("loadingMessage");


// Variable globale pour le modèle 3D
let object;

// Contrôles du mouvement orbit de la caméra
let controls;

// Objet à être rendu
let objToRender = 'Psychedelia';

// Permet de charger le fichier .gltf
const loader = new GLTFLoader();


// ********************************** CHARGEMENT FICHIER + CAMÉRA ********************************

loader.load(
  `public/${objToRender}/scene.gltf`,
  function (gltf) {

    // Lorsque l'objet est chargé, il sera ajouté à la scène
    object = gltf.scene;
    scene.add(object);

    // cache la page loader après un délais de 2.5 secondes 
    setTimeout(() => {
      loaderPage.style.display = "none";
    }, 2500);

    // Calcule le bounding box de l'objet 3D
    const box = new THREE.Box3().setFromObject(object);
    const center = box.getCenter(new THREE.Vector3());

    // Calcule la distance afin de bouger la caméra
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    const cameraDistance = Math.abs(maxDim / Math.sin(fov / 2));

    // Position de la caméra
    camera.position.copy(center);
    camera.position.z += cameraDistance;

    // Placé au centre de l'objet
    camera.lookAt(center);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 2;
    controls.maxDistance = 500;
    controls.maxPolarAngle = Math.PI / 2;
    controls.target.set(0, 1, 0);
    controls.update();

  },

  function (xhr) {

    // Lorsque l'objet est en charge, cela garde le log
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },

  function (error) {
    // Si il y a une erreur, un message d'erreur s'affiche dans la console
    console.error(error);
  }
);



// ********************************** CONFIGURATION DE LA FENÊTRE ********************************

// Création de la fenêtre de rendu
const renderer = new THREE.WebGLRenderer({
  antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);

// Ajout de la fenêtre de rendu au DOM
document.getElementById("container3D").appendChild(renderer.domElement);

// Ajout des lumières afin qu'on puisse voir l'objet
const topLight = new THREE.DirectionalLight(0xffffff, 1);
topLight.position.set(0, 500, 0)
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, objToRender === "Psychedelia" ? 5 : 1);
scene.background = new THREE.Color(0xD397F8);
scene.add(ambientLight);

// Active le fog dans la scène
scene.fog = new THREE.Fog(0xFFFFFF, 100, 1000); // Ajuster la densité selon le besoin


// Ajout du contrôle de mouvement en orbit de la caméra
if (objToRender === "Psychedelia") {
  controls = new OrbitControls(camera, renderer.domElement);
}



// ********************************** RENDU + ANIMATION ********************************

// Prend l'élément checkbox pour le wireframe
const wireframeCheckbox = document.getElementById('wireframeCheckbox');

// Met le checkbox à checked
wireframeCheckbox.checked = false;

// Variable pour le wireframe
let wireframeActive = false;

// Ajout d'un event listener pour le checkbox du wireframe
wireframeCheckbox.addEventListener('change', function () {
  wireframeActive = this.checked; // Défini l'état du wireframe selon l'état du checkbox
  setWireframeMode(wireframeActive); // Active ou désactive le wireframe
});

// Prend l'élément checkbox pour l'animation
const animationCheckbox = document.getElementById('activerAnim');

// Met le checkbox à checked
animationCheckbox.checked = true;

// Variable pour l'animation
let animationJoue = true;

// Variable pour vérifier si l'animation est en cours
let animationRunning = false;

// Ajout d'un event listener pour le checkbox de l'animation
animationCheckbox.addEventListener('change', function () {
  animationJoue = this.checked; // Défini l'état de l'animation selon l'état du checkbox

  // Si l'animation est activée et qu'elle n'est pas en cours, démarre l'animation
  if (animationJoue && !animationRunning) {
    animate();
  }
});

// Fonction pour gérer le rendu de la scène avec animation contrôlée par la variable animationJoue
function animate() {
  animationRunning = true; // Défini l'animation en cours

  requestAnimationFrame(animate);

  // Anime l'objet seulement si animationJoue est true
  if (animationJoue) {
    animateParticles();

    // Rotation de l'objet
    if (object) {
      object.rotation.y += 0.005;
    }
  }

  renderer.render(scene, camera);
}

// Prend les conteneurs de checkbox
const checkboxContainers = document.querySelectorAll('.checkbox-container');

// ajout du click event listener pour les checkbox
checkboxContainers.forEach(container => {
  container.addEventListener('click', function (event) {
    const checkbox = container.querySelector('input[type="checkbox"]');
    if (event.target !== checkbox) {
      checkbox.checked = !checkbox.checked; 
      if (checkbox === wireframeCheckbox) {
        wireframeActive = checkbox.checked;
        setWireframeMode(wireframeActive); 
      } else if (checkbox === animationCheckbox) {
        animationJoue = checkbox.checked; 
        if (animationJoue && !animationRunning) {
          animate(); 
        }
      }
    }
  });
});

// Prend tout les labels des checkbox
const checkboxLabels = document.querySelectorAll('.checkbox-label');


checkboxLabels.forEach(label => {
  label.addEventListener('click', function (event) {
    event.preventDefault(); 
    event.stopPropagation(); 
  });
});





// ********************************** CONTRÔLES ********************************

// Fonction pour ouvrir la fenêtre de contrôles
function montrerPopup() {
  const popup = document.getElementById('controlesPopup');
  popup.classList.add('active');
}

// Fonction pour fermer la fenêtre de contrôles
function fermerPopup() {
  const popup = document.getElementById('controlesPopup');
  popup.classList.remove('active');
}

// Ajout d'event listener pour detecter l'ouverture et la fermeture de la fenêtre de contrôles
document.getElementById('montrerControles').addEventListener('click', montrerPopup);
document.getElementById('fermer').addEventListener('click', fermerPopup);


// Fonction pour gérer le slider pour zoomer
document.getElementById("zoomSlider").addEventListener("input", function () {
  const value = parseFloat(this.value);
  const minZoom = 1;
  const maxZoom = 100;
  const range = Math.log(maxZoom - minZoom);
  const zoom = minZoom + Math.exp((value / 100) * range);

  // Prend le centre de l'objet
  const box = new THREE.Box3().setFromObject(object);
  const center = box.getCenter(new THREE.Vector3());

  // calcule la nouvelle position de la caméra au zoom
  const newCameraPosition = center.clone().add(camera.position.clone().sub(center).normalize().multiplyScalar(zoom));

  // Met à jour la position de la caméra
  camera.position.copy(newCameraPosition);
});

// Fonction pour gérer la luminosité de la scène
document.getElementById("brightnessSlider").addEventListener("input", function () {
  const luminos = parseFloat(this.value);
  ajusterLuminosite(luminos);
});

function ajusterLuminosite(luminos) {

  // Ajuster la luminosité de la scène en ajustant les lumières présentes dans la scène
  topLight.intensity = luminos;
  ambientLight.intensity = luminos;
}

// Fonction permettant de changer la couleur d'arrière-plan
document.getElementById("bgColorPicker").addEventListener("input", function (event) {
  const color = event.target.value;
  scene.background = new THREE.Color(color);
});

// Fonction permettant de gérer la rotation selon la valeur du slider
function handleRotation() {
  const valeurSlider = parseFloat(document.getElementById('rotationSlider').value);
  if (object) {

    // Convertit la valeur du slider en radians
    const radians = THREE.MathUtils.degToRad(valeurSlider);

    // Applique la rotation au modèle
    object.rotation.y = radians;
  }
}

// Ajout d'un event listener au slider
document.getElementById('rotationSlider').addEventListener('input', handleRotation)

const backgroundMusic = document.getElementById('backgroundMusic');
const toggleMusicButton = document.getElementById('toggleMusic');
let musiqueJoue = !backgroundMusic.paused; // Vérifie si la musique joue au début

updateButtonState(); // Met à jour le texte du bouton selon son état

toggleMusicButton.addEventListener('click', function () {
  musiqueJoue = !musiqueJoue;
  if (musiqueJoue) {
    backgroundMusic.play();
  } else {
    backgroundMusic.pause();
  }
  updateButtonState(); // Met à jour le texte du bouton selon son état
});

function updateButtonState() {
  toggleMusicButton.textContent = musiqueJoue ? 'Arrêter' : 'Jouer';
}

// Fonction permettant d'activer le wireframe
function setWireframeMode(enabled) {
  // Analyse les objets 3D présents dans la scène et active leurs wireframes
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.material.wireframe = enabled;
    }
  });
}


// Ajout d'un event listener à la fenêtre, afin qu'on puisse changer la taille et ainsi de suite
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});


// Ajout du position listener pour la souris afin qu'on puisse faire bouger l'objet dans la scène
document.onmousemove = (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
}

// Tableau pour garder les particules
const particules = [];



// Création des matériels des particules
const particuleGeometry = new THREE.BufferGeometry();
const particuleMaterial = new THREE.PointsMaterial({
  vertexColors: true, 
  size: 3, 

});

// Créer un nombre large de particules
const numParticules = 1000; // Ajuster le nombre de particules
const position = new Float32Array(numParticules * 3); // Chaque particule à trois type de coordonnées (x, y, z)
const couleurs = new Float32Array(numParticules * 3); // Tableau pour stocker les couleurs RGB de particules

for (let i = 0; i < numParticules * 3; i += 3) {

  //Défini une position aléatoire pour chaque particule selon l'intervalle
  position[i] = (Math.random() - 0.5) * 1000; // x
  position[i + 1] = (Math.random() - 0.5) * 1000; // y
  position[i + 2] = (Math.random() - 0.5) * 1000; // z

  // Défini une taille aléatoire pour chaque particule
  sizes[i] = Math.random() * 2;

  // Défini les valeurs RGB aléatoirement pour chaque particule
  couleurs[i] = Math.random(); // Rouge
  couleurs[i + 1] = Math.random(); // Vert
  couleurs[i + 2] = Math.random(); // Bleu
}

// Ajouter la position à la géométrie et la couleur
particuleGeometry.setAttribute('position', new THREE.BufferAttribute(position, 3));
particuleGeometry.setAttribute('color', new THREE.BufferAttribute(couleurs, 3));

// Créer le système de particules
const particuleSystem = new THREE.Points(particuleGeometry, particuleMaterial);
scene.add(particuleSystem);

// Fonction pour animer les particules
function animateParticles() {

  // Prend la position de tout les particules
  const position = particuleGeometry.attributes.position.array;

  // Defini la vitesse de rotation
  const rotationSpeed = 0.005;

  // Met à jour la position selon la rotation
  for (let i = 0; i < position.length; i += 3) {
    // Get the current position of the particle
    const x = position[i];
    const y = position[i + 1];
    const z = position[i + 2];

    // Met à jour la rotation selon la position
    position[i] = x * Math.cos(rotationSpeed) - z * Math.sin(rotationSpeed);
    position[i + 2] = x * Math.sin(rotationSpeed) + z * Math.cos(rotationSpeed);
  }

  // Met à jour la position des particules avec le buffer geometry
  particuleGeometry.attributes.position.needsUpdate = true;
}

// Commence le rendu de l'objet 3D
animate();