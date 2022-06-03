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
const nodeColor = {
    hex: 0x4DFF4D,
    css: "#4DFF4D"
}

const addObject = (x, y, z, obj) => {
    obj.position.x = x;
    obj.position.y = y;
    obj.position.z = z;

    scene.add(obj);
    objects.push(obj);

    camera.lookAt(obj.position);
}

const createCanvas = (text) => {
    const canvasHeight = 250, canvasWidth = 250;
    let canvas = document.createElement('canvas');
    {
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
    }

    const resizeCoef = 1.5;
    const textSize = Math.min(canvas.width / text.length, 83);
    console.log(textSize);

    let context = canvas.getContext('2d');
    {
        //background
        context.fillStyle = nodeColor.css;
        context.fillRect(0, 0, canvasWidth, canvasHeight);

        //text
        context.font = "Bold " + String(textSize * resizeCoef) + "px Arial";
        context.fillStyle = "#FFFFFF";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(text, canvasWidth / 2, canvasHeight / 2 + 5);
    }

    document.body.appendChild(canvas);
    return canvas;
}

const addSolidGeometry = (x, y, z, geometry, text) => {
    //creating a texture
    const texture = new THREE.Texture(createCanvas(text));
    texture.needsUpdate = true;

    //creating materials
    const basicColor = nodeColor.hex;
    const materials = [
        new THREE.MeshBasicMaterial({map: texture}),
        new THREE.MeshBasicMaterial({color: basicColor}),
        new THREE.MeshBasicMaterial({color: basicColor}),
        new THREE.MeshBasicMaterial({color: basicColor}),
        new THREE.MeshBasicMaterial({color: basicColor}),
        new THREE.MeshBasicMaterial({color: basicColor}),
    ];

    const mesh = new  THREE.Mesh(geometry, materials);
    addObject(x, y, z, mesh);
}

const addNode = (x, y, text = "Sample Text") => {
    const width = 1;
    const height = 1;
    const depth = 1;

    addSolidGeometry(x, y, 0, new THREE.BoxGeometry(width, height, depth), text); 
}

addNode(0, 0);

function animate(time) {
	time *= 0.001;

	renderer.render(scene, camera);
	controls.update();

	requestAnimationFrame(animate);
}

animate();