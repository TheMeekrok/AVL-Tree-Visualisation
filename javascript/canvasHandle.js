"use strict";

const canvas = document.getElementById('canvas');
const renderer = new THREE.WebGLRenderer({canvas});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

const fov = 50;
const aspect = canvas.offsetWidth / canvas.offsetHeight;
const near = 0.1;
const far = 1000;

const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

camera.position.z = 5;
const setCameraPosition = (x, y, z) => {
    camera.position.x = x;
    camera.position.y = y;
    camera.position.z = z;
}


const onWindowResize = () => {
    canvas.style.width = "100%";
    canvas.style.height = "70%";

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
    const width = 0.7;
    const height = 0.7;
    const depth = 0.7;

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
    objects.push(line);
}

const displayTree = (root) => {
    if (root != null) {
        displayTree(root.left);

        addNode(root.x, root.y, root.key.toString());

        if (root.parent != null) 
            addLine(root.x, root.y, 0, root.parent.x, root.parent.y, 0);
        
        displayTree(root.right);
    }
}

const clearBuffer = () => {
    objects.forEach(element => {
        scene.remove(element);
    });

    objects.length = 0;
}

const updateTree = (root) => {
    clearBuffer();

    let treeHeight = Tree.getHeight();
    let defaultCameraZ = 5;

    controls.target = new THREE.Vector3(0,  treeHeight / 2, 0);
    camera.position.set(0, treeHeight / 2, Math.max(Math.pow(2, treeHeight - 1), 
        defaultCameraZ))
    
    controls.update();

    Tree.prepareForPrint();
    displayTree(root);
}


function animate(time) {
	time *= 0.001;

	renderer.render(scene, camera);
    
	requestAnimationFrame(animate);
}

animate();
