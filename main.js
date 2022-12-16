import './style.css';
import * as THREE from 'three';
const nearDist = 0.1;
const farDist = 10000;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    nearDist,
    farDist
);
camera.position.x = farDist * -2;
camera.position.z = 500;
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setClearColor("#000000");
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// CREATE CUBES
const cubeSize = 120;
const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize); // BufferAttribute allows for more efficient passing of data to the GPU
const material = new THREE.MeshNormalMaterial(); // Maps the normal vectors to RGB colors
const group = new THREE.Group();
for (let i = 0; i < 350; i++) {
    const mesh = new THREE.Mesh(geometry, material);
    const dist = farDist / 3;
    const distDouble = dist * 2;
    const tau = 2 * Math.PI; // One turn
    mesh.position.x = Math.random() * distDouble - dist;
    mesh.position.y = Math.random() * distDouble - dist;
    mesh.position.z = Math.random() * distDouble - dist;
    mesh.rotation.x = Math.random() * tau;
    mesh.rotation.y = Math.random() * tau;
    mesh.rotation.z = Math.random() * tau;
    // Manually control when 3D transformations recalculation occurs for better performance
    mesh.matrixAutoUpdate = false;
    mesh.updateMatrix();

    group.add(mesh);
}
scene.add(group);

// CREATE PART OF THE MOUSE/TOUCH OVER EFFECT
let mouseX = 0;
let mouseY = 0;
const mouseFX = {
    windowHalfX: window.innerWidth / 2,
    windowHalfY: window.innerHeight / 2,
    coordinates: function(coordX, coordY) {
        mouseX = (coordX - mouseFX.windowHalfX) * 10;
        mouseY = (coordY - mouseFX.windowHalfY) * 10;
    },
    onMouseMove: function(e) {
        mouseFX.coordinates(e.clientX, e.clientY);
    },
    onTouchMove: function(e) {
        mouseFX.coordinates(
            e.changedTouches[0].clientX,
            e.changedTouches[0].clientY
        );
    },
};
document.addEventListener("mousemove", mouseFX.onMouseMove, false);
document.addEventListener("touchmove", mouseFX.onTouchMove, false);

// RENDER 3D GRAPHIC
const render = () => {
    requestAnimationFrame(render);
    // Camera animation
    // Works with onMouseMove and onTouchMove functions
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (mouseY * -1 - camera.position.y) * 0.05;
    camera.lookAt(scene.position); // Rotates the object to face a point in world space

    const t = Date.now() * 0.001;
    const rx = Math.sin(t * 0.7) * 0.5;
    const ry = Math.sin(t * 0.3) * 0.5;
    const rz = Math.sin(t * 0.2) * 0.5;
    group.rotation.x = rx;
    group.rotation.y = ry;
    group.rotation.z = rz;
    renderer.render(scene, camera);
};
render();

//resize
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
window.addEventListener("resize", () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
        //update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
});