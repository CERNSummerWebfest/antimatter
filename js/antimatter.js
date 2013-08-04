var scene;
var camera;
var renderer;

var color_background = 0x0C141F;
var color_mesh = 0x6FC3DF;
var color_lines = 0xFFE64D;

var max_height = 500;
var min_height = 0;
var grid_size = 5000;

var grid_x = 1280;
var grid_z = 1024;
var grid_step = 64;

var ratio = 12.82051282;

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
    generateCounter();
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
    var line = new THREE.Line(geometry, material);
    line.type = THREE.LinePieces;
    scene.add(line);
}

function generateCounter() {
    var counter = $("<div id='track-counter'></div>");
    counter.css("position", "absolute");
    counter.css("top", "15px");
    counter.css("left", "20px");
    counter.css("text-shadow", "2px 2px 2px #DF740C");
    counter.css("font-size", "30");
    counter.css("font-family", "'Oxygen', sans-serif");
    counter.css("color", "#E6FFFF");
    counter.css("-webkit-touch-callout", "none");
    counter.css("-webkit-user-select", "none");
    counter.css("-khtml-user-select", "none");
    counter.css("-moz-user-select", "none");
    counter.css("-ms-user-select", "none");
    counter.css("user-select", "none");
    counter.css("cursor", "default");
    $("#antimatter-visualization").append(counter);
}

function convert(pos) {
    var positions = {};

    positions["x"] = pos.x - grid_x/2;
    positions["y"] = pos.z * ratio;
    positions["z"] = pos.y - grid_z/2;

    return positions;
}

function fetch() {
    $.get("http://crowdcrafting.org/api/taskrun?app_id=794", function(data) {
        var material = new THREE.LineBasicMaterial({color: color_lines, opacity: 1});
        for (var i=0; i<data.length; ++i) {
            var track = data[i].info;
            for (var j=0; j<track.length; ++j) {
                var a = convert(track[j].entry);
                var b = convert(track[j].exit);
                var geometry = new THREE.Geometry();
                geometry.vertices.push(new THREE.Vector3(a.x, a.y, a.z));
                geometry.vertices.push(new THREE.Vector3(b.x, b.y, b.z));
                var line = new THREE.Line(geometry, material);
                scene.add(line);
            }
        }

        $("#track-counter").html(data.length + " tracks contributed");
    });
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
