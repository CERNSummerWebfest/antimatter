var scene;
var camera;
var renderer;

var color_background = 0x0C141F;
var color_mesh = 0x6FC3DF;
var color_lines = 0xDF740C;

var max_height = 500;
var min_height = 0;
var plane_width = 1024;

var grid_x = 1280;
var grid_z = 1024;
var grid_step = 64;

var camera_pos = {
    "x": 700,
    "y": 250,
    "z": 700
};

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 4000);
    camera.position.x = camera_pos.x;
    camera.position.y = camera_pos.y;
    camera.position.z = camera_pos.z;

    renderer = new THREE.WebGLRenderer({clearColor: color_background, clearAlpha: 1});
    renderer.setSize( window.innerWidth, window.innerHeight );
    $("#antimatter-visualization").append(renderer.domElement);

    generateGrid();
}

function generateGrid() {
    var geometry = new THREE.Geometry();

    for (var i=-plane_width; i<=plane_width; i+=grid_step) {
        // Upper grid
        geometry.vertices.push(new THREE.Vector3(-plane_width/2, max_height, i));
        geometry.vertices.push(new THREE.Vector3(plane_width, max_height, i));
        geometry.vertices.push(new THREE.Vector3(i, max_height, -plane_width));
        geometry.vertices.push(new THREE.Vector3(i, max_height, plane_width));

        // Bottom grid
        geometry.vertices.push(new THREE.Vector3(-plane_width, min_height, i));
        geometry.vertices.push(new THREE.Vector3(plane_width, min_height, i));
        geometry.vertices.push(new THREE.Vector3(i, min_height, -plane_width));
        geometry.vertices.push(new THREE.Vector3(i, min_height, plane_width));
    }

    var material = new THREE.LineBasicMaterial({color: color_mesh, opacity: 1});
    var line = new THREE.Line( geometry, material );
    line.type = THREE.LinePieces;
    scene.add(line);
}

function convert(x, y, z) {
    var positions = {};

    positions["x"] = x * ratio_x;
    positions["y"] = z * ratio_y;
    positions["z"] = y * ratio_z;

    return positions;
}

function fetch() {
    // TODO ajax request
    var material = new THREE.LineBasicMaterial({color: color_lines, opacity: 1});

    var result = {
        "info": {
            "tracks": [
                {"entry": {"x": 200, "y": 1000, "z": 3},
                 "exit": {"x": 400, "y": 100, "z": 37}},
                {"entry": {"x": 567, "y": 100, "z": 37},
                 "exit": {"x": 400, "y": 100, "z": 0}},
                {"entry": {"x": 1, "y": 1, "z": 1},
                 "exit": {"x": 1000, "y": 1000, "z": 39}},
                {"entry": {"x": 150, "y": 150, "z": 3},
                 "exit": {"x": 200, "y": 200, "z": 7}},
                {"entry": {"x": 50, "y": 1000, "z": 20},
                 "exit": {"x": 900, "y": 100, "z": 10}},
                {"entry": {"x": 0, "y": 14, "z": 0},
                 "exit": {"x": 0, "y": 0, "z": 0}}
            ]
        }
    };

    var tracks = result.info.tracks;
    for (var i=0, len=tracks.length; i<len; ++i) {
        var a = tracks[i].entry;
        var b = tracks[i].exit;
        var geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(a.x, a.y, a.z));
        geometry.vertices.push(new THREE.Vector3(b.x, b.y, b.z));
        var line = new THREE.Line(geometry, material);
        scene.add(line);
    }
}

function animate() {
    var timer = Date.now() * 0.0002;
    camera.position.x = Math.cos(timer) * camera_pos.x;
    camera.position.z = Math.sin(timer) * camera_pos.z;
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
