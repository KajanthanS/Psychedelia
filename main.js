//Importation de la librairie Three.js
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";

// Permet la camera de bouger à travers la scène
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";

// Permet d'importer le fichier .gltf
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

//Création d'une scène Three.js
const scene = new THREE.Scene();

// Variables pour la taille de la fenêtre
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
  
}

//Création d'une nouvelle caméra et définition de la position
const camera = new THREE.PerspectiveCamera(40, sizes.width / sizes.height, 1, 1000);
scene.add(camera)


// Permet de savoir ou la souris est situé afin de faire bouger le modèle 3D
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;



// Variable globale pour le modèle 3D
let object;

// Controls du mouvement orbit de la caméra
let controls;

// Objet à être rendu
let objToRender = 'Psychedelia';

// Permet de charger le fichier .gltf
const loader = new GLTFLoader();

// Chargement du fichier
loader.load(
  `public/${objToRender}/scene.gltf`,
  function (gltf) {

    // Lorsque l'objet est chargé, il sera ajouté à la scène
    object = gltf.scene;
    scene.add(object);

    // Calcule le bounding box de l'objet 3D
    const box = new THREE.Box3().setFromObject(object);
    const center = box.getCenter(new THREE.Vector3());
    

    // Calcule la distance afin de bouger la caméra
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    const cameraDistance = Math.abs(maxDim / Math.sin(fov / 2));

    // Posiiton de la caméra
    camera.position.copy(center);
    camera.position.z += cameraDistance;

    // Placé au centre de l'objet
    camera.lookAt(center);
  },

  function (xhr) {

    // Lorsque l'objet est en charge, cela garde le log
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },

  function (error) {
    // Si il y a une erreu, un message d'erreur s'affiche dans la console
    console.error(error);
  }
);





// Création de la fenêtre de rendu
const renderer = new THREE.WebGLRenderer({ antialias: true }); //Alpha: true allows for the transparent background
renderer.setSize(window.innerWidth, window.innerHeight);

// Ajout de la fenêtre de rendu au DOM
document.getElementById("container3D").appendChild(renderer.domElement);

// Ajout des lumières afin qu'on puisse voir l'objet
const topLight = new THREE.DirectionalLight(0xffffff, 1); 
topLight.position.set(500, 500, 500) 
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, objToRender === "Psychedelia" ? 5 : 1);
scene.background = new THREE.Color(0xD397F8);
scene.add(ambientLight);

//This adds controls to the camera, so we can rotate / zoom it with the mouse
if (objToRender === "Psychedelia") {
  controls = new OrbitControls(camera, renderer.domElement);
}

//Render the scene
function animate() {
  requestAnimationFrame(animate);

  // animateFireworks(); // Call the fireworks animation function
  // Rotate the object
  if (object) {
    object.rotation.y += 0.01; // Adjust the rotation speed as needed
  }

  renderer.render(scene, camera);
}

// Function to handle zoom slider change
document.getElementById("zoomSlider").addEventListener("input", function() {
  const value = parseFloat(this.value);
  const minZoom = 1; // Adjust as needed
  const maxZoom = 100; // Adjust as needed
  const range = maxZoom - minZoom;
  const zoom = minZoom + (value / 100) * range;

  // Update camera position based on zoom
  camera.position.z = zoom;
});

// Fonction pour gérer la luminosité de la scène
document.getElementById("brightnessSlider").addEventListener("input", function() {
  const luminos = parseFloat(this.value);
  ajusterLuminosite(luminos);
});

function ajusterLuminosite(luminos) {
  // Ajuster la luminosité de la scène en ajustant les lumières présentes dans la scène
  topLight.intensity = luminos; 
  ambientLight.intensity = luminos; 
}

// Fonction permettant de changer la couleur d'arrière-plan
document.getElementById("bgColorPicker").addEventListener("input", function(event) {
  const color = event.target.value;
  scene.background = new THREE.Color(color);
});

// Function to handle rotation based on slider value
function handleRotation() {
  const sliderValue = parseFloat(document.getElementById('rotationSlider').value);
  if (object) {
      // Convert slider value to radians (assuming Three.js uses radians for rotation)
      const radians = THREE.MathUtils.degToRad(sliderValue);
      // Apply rotation to the model
      object.rotation.y = radians;
  }
}

// Add event listener to the slider
document.getElementById('rotationSlider').addEventListener('input', handleRotation)

// Ajout d'un listener à la fenêtre, afin qu'on puisse changer la taille et ainsi de suite
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

// // Function to create fireworks particle system
// function createFireworks(scene) {
//   const fireworksGeometry = new THREE.BufferGeometry();
//   const fireworksVertices = [];
//   const fireworksColors = [];

//   // Create particles for the fireworks
//   for (let i = 0; i < 100; i++) {
//       fireworksVertices.push(
//           Math.random() * 200 - 100, // Random x position within a range
//           Math.random() * 100 + 50, // Random y position within a range
//           Math.random() * 200 - 100 // Random z position within a range
//       );

//       // Random color for each particle
//       fireworksColors.push(Math.random(), Math.random(), Math.random());
//   }

//   fireworksGeometry.setAttribute('position', new THREE.Float32BufferAttribute(fireworksVertices, 3));
//   fireworksGeometry.setAttribute('color', new THREE.Float32BufferAttribute(fireworksColors, 3));

//   // Define the material for the fireworks particles
//   const fireworksMaterial = new THREE.PointsMaterial({
//       size: 5,
//       vertexColors: true // Enable vertex colors
//   });

//   // Create the particle system
//   const fireworksParticleSystem = new THREE.Points(fireworksGeometry, fireworksMaterial);

//   scene.add(fireworksParticleSystem);

//   // Function to animate the fireworks
//   function animateFireworks() {
//       fireworksParticleSystem.rotation.y += 0.01; // Rotate the fireworks

//       // Update the positions and colors of the particles to create the effect
//       const positions = fireworksParticleSystem.geometry.attributes.position.array;
//       const colors = fireworksParticleSystem.geometry.attributes.color.array;
//       for (let i = 0; i < positions.length; i += 3) {
//           // Move particles downward
//           positions[i + 1] -= Math.random() * 0.5;
//           if (positions[i + 1] < -50) { // Reset particle position if it falls below a certain threshold
//               positions[i] = Math.random() * 200 - 100; // Random x position within a range
//               positions[i + 1] = Math.random() * 100 + 50; // Random y position within a range
//               positions[i + 2] = Math.random() * 200 - 100; // Random z position within a range
//           }

//           // Update colors randomly
//           colors[i] += (Math.random() - 0.5) * 0.1; // Red channel
//           colors[i + 1] += (Math.random() - 0.5) * 0.1; // Green channel
//           colors[i + 2] += (Math.random() - 0.5) * 0.1; // Blue channel
//       }

//       fireworksParticleSystem.geometry.attributes.position.needsUpdate = true; // Update position
//       fireworksParticleSystem.geometry.attributes.color.needsUpdate = true; // Update color
//   }

//   return animateFireworks;
// }

// // Add the fireworks effect to the scene
// const animateFireworks = createFireworks(scene);


// Commence le rendu de l'objet 3D
animate();