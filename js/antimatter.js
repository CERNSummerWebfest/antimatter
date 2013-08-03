var scene;
var camera;
var renderer;

var color_background = 0x0C141F;
var color_mesh = 0x6FC3DF;
var color_lines = 0xDF740C;

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.x = 20;
    camera.position.y = 7;
    camera.position.z = 20;

    renderer = new THREE.WebGLRenderer({clearColor: color_background, clearAlpha: 1});
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild(renderer.domElement);

    generateGrid();
}

function generateGrid() {
    var size = 200;
    var step = 3;
    var geometry = new THREE.Geometry();

    for (var i=-size; i<=size; i+=step) {
        // Upper grid
        geometry.vertices.push(new THREE.Vector3(-size, 14, i));
        geometry.vertices.push(new THREE.Vector3(size, 14, i));
        geometry.vertices.push(new THREE.Vector3(i, 14, -size));
        geometry.vertices.push(new THREE.Vector3(i, 14, size));

        // Bottom grid
        geometry.vertices.push(new THREE.Vector3(-size, 0, i));
        geometry.vertices.push(new THREE.Vector3(size, 0, i));
        geometry.vertices.push(new THREE.Vector3(i, 0, -size));
        geometry.vertices.push(new THREE.Vector3(i, 0, size));
    }

    var material = new THREE.LineBasicMaterial({color: color_mesh, opacity: 1});
    var line = new THREE.Line( geometry, material );
    line.type = THREE.LinePieces;
    scene.add(line);
}

function fetch() {
    // TODO ajax request
    var material = new THREE.LineBasicMaterial({color: color_lines, opacity: 1});
    var result = [];

    result.push(
        [[10,14,5], [5,0,5]],
        [[11.1,14,5.3], [5.5,0,5.7]],
        [[10.6,14,4.9], [4.8,0,5.2]],
        [[10.3,14,5.2], [5.2,0,5.3]]
    );

    for (var i=0, len=result.length; i<len; ++i) {
        var a = result[i][0];
        var b = result[i][1];
        var geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(a[0], a[1], a[2]));
        geometry.vertices.push(new THREE.Vector3(b[0], b[1], b[2]));
        var line = new THREE.Line(geometry, material);
        scene.add(line);
    }
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
fetch();
render();
