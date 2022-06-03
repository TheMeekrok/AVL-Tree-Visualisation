"use strict";

const canvas = document.getElementById('canvas');
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

const fov = 50;
const aspect = 2;
const near = 0.1;
const far = 100;

const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 5;

const onWindowResize = () => {
    camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
}
window.addEventListener('resize', onWindowResize, false)

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x72A37F);

let controls = new THREE.OrbitControls(camera, renderer.domElement);


const objects = [];

const addObject = (x, y, z, obj) => {
    obj.position.x = x;
    obj.position.y = y;
    obj.position.z = z;

    scene.add(obj);
    objects.push(obj);

    camera.lookAt(obj.position);
}

const addSolidGeometry = (x, y, z, geometry) => {
    //creating a canvas
    const canvasHeight = 250, canvasWidth = 250;
    let canvas = document.createElement('canvas');
    {
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
    }

    let context = canvas.getContext('2d');
    {
        context.font = "Bold 40px Arial";
        context.fillStyle = "rgb(255, 0, 0)";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText('Hello World', 125, 125);
    }

    document.body.appendChild(canvas);

    //creating a texture
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    //creating materials
    const basicColor = 0x00ff00;
    const materials = [
        new THREE.MeshBasicMaterial({map: texture}),
        new THREE.MeshBasicMaterial({color: basicColor}),
        new THREE.MeshBasicMaterial({color: basicColor}),
        new THREE.MeshBasicMaterial({color: basicColor}),
        new THREE.MeshBasicMaterial({color: basicColor}),
        new THREE.MeshBasicMaterial({color: basicColor}),
    ];
    //material.color.setRGB(Math.random(), Math.random(), Math.random());

    const mesh = new  THREE.Mesh(geometry, materials);
    addObject(x, y, z, mesh);
}

const addNode = (x, y) => {
    const width = 1;
    const height = 1;
    const depth = 1;

    addSolidGeometry(x, y, 0, new THREE.BoxGeometry(width, height, depth)); 
}

addNode(0, 0);

function animate(time) {
	time *= 0.001;

	renderer.render(scene, camera);
	controls.update();

	requestAnimationFrame(animate);
}

animate();