var scene;
var camera;
var renderer;

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.x = 20;
    camera.position.y = 7;
    camera.position.z = 20;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild(renderer.domElement);

    geometry = new THREE.CubeGeometry(10,10,10);
    material = new THREE.MeshBasicMaterial({color: 0x00ff00});
    cube = new THREE.Mesh(geometry, material);
    scene.add( cube );
}

function animate() {
    var timer = Date.now() * 0.0002;
    camera.position.x = Math.cos(timer) * 20;
    camera.position.z = Math.sin(timer) * 20;
    camera.lookAt(scene.position);
}

function render() {
    requestAnimationFrame(render);
    animate();
    renderer.render(scene, camera);
}

init();
render();
