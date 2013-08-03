var scene;
var camera;
var renderer;

var color_background = 0x0C141F;
var color_mesh = 0x6FC3DF;
var color_lines = 0xDF740C;

var max_height = 500;
var min_height = 0;
var grid_size = 5000;

var grid_x = 1280;
var grid_z = 1024;
var grid_step = 64;

var camera_pos = {
    "x": 700,
    "y": 250,
    "z": 700
};

function init() {
    width = $("#antimatter-visualization").width();
    height = width/1.31;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(100, width/height, 0.1, 4000);
    camera.position.x = camera_pos.x;
    camera.position.y = camera_pos.y;
    camera.position.z = camera_pos.z;

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setClearColor(color_background, 1);
    renderer.setSize(width, height);
    $("#antimatter-visualization").append(renderer.domElement);

    generateGrid();
}

function generateGrid() {
    var geometry = new THREE.Geometry();

    for (var i=-grid_size/2; i<=grid_size/2; i+=grid_step) {
        // Upper grid
        geometry.vertices.push(new THREE.Vector3(-grid_size/2, max_height, i));
        geometry.vertices.push(new THREE.Vector3(grid_size/2, max_height, i));
        geometry.vertices.push(new THREE.Vector3(i, max_height, -grid_size/2));
        geometry.vertices.push(new THREE.Vector3(i, max_height, grid_size/2));

        // Bottom grid
        geometry.vertices.push(new THREE.Vector3(-grid_size/2, min_height, i));
        geometry.vertices.push(new THREE.Vector3(grid_size/2, min_height, i));
        geometry.vertices.push(new THREE.Vector3(i, min_height, -grid_size/2));
        geometry.vertices.push(new THREE.Vector3(i, min_height, grid_size/2));
    }

    var material = new THREE.LineBasicMaterial({color: color_mesh, opacity: 1});
    var line = new THREE.Line( geometry, material );
    line.type = THREE.LinePieces;
    scene.add(line);
}

function convert(pos) {
    var positions = {};

    positions["x"] = pos.x - grid_x/2;
    positions["y"] = pos.z;
    positions["z"] = pos.y - grid_z/2;

    return positions;
}

function fetch() {
    // TODO ajax request
    var material = new THREE.LineBasicMaterial({color: color_lines, opacity: 1});

    var result = {
        "info": {
            "tracks": [
                {"entry": {"x": 0, "y": 0, "z": 0},
                 "exit": {"x": 1280, "y": 1024, "z": 500}}
            ]
        }
    };

    var tracks = result.info.tracks;
    for (var i=0, len=tracks.length; i<len; ++i) {
        var a = convert(tracks[i].entry);
        var b = convert(tracks[i].exit);
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
