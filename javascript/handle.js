"use strict";

const canvas = document.getElementById('canvas');
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

const fov = 50;
const aspect = canvas.offsetWidth / canvas.offsetHeight;
const near = 0.1;
const far = 100;

const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 5;

const onWindowResize = () => {
    canvas.style.width = "100%";

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

    return canvas;
}

const addSolidGeometry = (x, y, z, geometry, text) => {
    //creating a texture
    const texture = new THREE.Texture(createCanvas(text));
    texture.needsUpdate = true;

    //creating materials
    const basicColor = nodeColor.hex;
    const materials = [
        new THREE.MeshBasicMaterial({color: basicColor}),
        new THREE.MeshBasicMaterial({color: basicColor}),
        new THREE.MeshBasicMaterial({color: basicColor}),
        new THREE.MeshBasicMaterial({color: basicColor}),
        new THREE.MeshBasicMaterial({map: texture}),
        new THREE.MeshBasicMaterial({color: basicColor}),
    ];

    const mesh = new  THREE.Mesh(geometry, materials);
    addObject(x, y, z, mesh);
}

const addNode = (x, y, text = "Sample Text") => {
    const width = 0.5;
    const height = 0.5;
    const depth = 0.5;

    addSolidGeometry(x, y, 0, new THREE.BoxGeometry(width, height, depth), text); 
}

const addLine = (x1, y1, z1, x2, y2, z2) => {
    const color = 0xFFFFFF;

    const material = new THREE.LineBasicMaterial({
        color: color,
    });

    const points = [];
    points.push(new THREE.Vector3(x1, y1, z1));
    points.push(new THREE.Vector3(x2, y2, z2));

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);

    scene.add(line);
}

const print_ = (root) => {
    if (root != null) {
        print_(root.left);
        addNode(root.x, root.y, root.key.toString());
        if (root.parent != null) {
            addLine(root.x, root.y, 0, root.parent.x, root.parent.y, 0);
        }
        print_(root.right);
    }
}


let A = new AVLTree();
A.Insert(5);
A.Insert(10);
A.Insert(0);
A.Insert(11);
A.Insert(7);
A.Insert(12);
A.Insert(87);
A.Insert(99);
A.Insert(100);
A.Insert(56);
A.Insert(34);

A.prepareForPrint();
print_(A.root);


function animate(time) {
	time *= 0.001;

	renderer.render(scene, camera);
	controls.update();

	requestAnimationFrame(animate);
}

animate();
