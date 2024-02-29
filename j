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
    // Si il y a une erreur, un message d'erreur s'affiche dans la console
    console.error(error);
  }
);


const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container3D").appendChild(renderer.domElement);

const topLight = new THREE.DirectionalLight(0xffffff, 1);
topLight.position.set(500, 500, 500);
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, objToRender === "Psychedelia" ? 5 : 1);
scene.background = new THREE.Color(0xD397F8);
scene.add(ambientLight);

if (objToRender === "Psychedelia") {
    controls = new OrbitControls(camera, renderer.domElement);
}

function animate() {
    requestAnimationFrame(animate);
    animateParticles();
    if (object) {
        object.rotation.y += 0.005;
    }
    renderer.render(scene, camera);
}

function montrerPopup() {
    document.getElementById("controlesPopup").style.display = "block";
}

function fermerPopup() {
    document.getElementById("controlesPopup").style.display = "none";
}

document.getElementById("montrerControles").addEventListener("click", montrerPopup);
document.getElementById("fermer").addEventListener("click", fermerPopup);

document.getElementById("zoomSlider").addEventListener("input", function () {
    const value = parseFloat(this.value);
    const minZoom = 1;
    const maxZoom = 100;
    const range = maxZoom - minZoom;
    const zoom = minZoom + (value / 100) * range;
    camera.position.z = zoom;
});

document.getElementById("brightnessSlider").addEventListener("input", function () {
    const luminos = parseFloat(this.value);
    ajusterLuminosite(luminos);
});

function ajusterLuminosite(luminos) {
    topLight.intensity = luminos;
    ambientLight.intensity = luminos;
}

document.getElementById("bgColorPicker").addEventListener("input", function (event) {
    const color = event.target.value;
    scene.background = new THREE.Color(color);
});

function handleRotation() {
    const valeurSlider = parseFloat(document.getElementById("rotationSlider").value);
    if (object) {
        const radians = THREE.MathUtils.degToRad(valeurSlider);
        object.rotation.y = radians;
    }
}

document.getElementById("rotationSlider").addEventListener("input", handleRotation);

window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

document.onmousemove = (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
}

// Create particle geometry and material
const particleGeometry = new THREE.BufferGeometry();
const particleMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.5, // Adjust the size of particles
    sizeAttenuation: true, // Ensures particles don't scale with distance
    transparent: true, // Enables transparency
    opacity: 0.5, // Adjust particle opacity
});

// Create a large number of particles
const numParticles = 1000; // Adjust the number of particles
const positions = new Float32Array(numParticles * 3); // Each particle has 3 coordinates (x, y, z)

for (let i = 0; i < numParticles * 3; i += 3) {
    // Randomize particle position within a certain range
    positions[i] = (Math.random() - 0.5) * 100; // x
    positions[i + 1] = (Math.random() - 0.5) * 100; // y
    positions[i + 2] = (Math.random() - 0.5) * 1000; // z (adjusted for background)
}

// Add positions to geometry
particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

// Create the particle system
const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particleSystem);

function animateParticles() {
    // No need to update particle positions since they are already set
}

animate();
