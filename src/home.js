import * as THREE from 'https://cdn.skypack.dev/three';

/* --------------- */
// Global Variables
/* --------------- */
var Colors = {
    red:0xf25346,
    white:0xd8d0d1,
    brown: 0x59332e,
    pink:0xf5986e,
    brownDark:0x23190f,
    blue:0x68c3c0,
    grass:0x567d46,
    road:0x47484c,
    ocean:0x064273,
    ground:0xcecdcb,
    brick:0x9d6055,
    glass:0xa8ccd7,
    wheel:0x040309
};
var Paint = [
    0xf25346,
    0xd8d0d1,
    0x59332e,
    0x23190f,
    0x68c3c0,
    0x9d6055
];

// Scene 
var scene, camera, fieldOfView, aspectRatio, nearPlane, farPlane, HEIGHT, WIDTH, renderer, container;
// Lights
var hemisphereLight, shadowLight, ambientLight;
// Objects

/* --------------- */
// Global Functions
/* --------------- */
function init() {
    var place = sessionStorage.getItem("Place");
    var time = sessionStorage.getItem("Time");
    var control = sessionStorage.getItem("Control");
    // set up the scene, the camera and the renderer
    createScene();

    // add the lights
    createLights();

    // add the objects
    createPlane();

    // Creating the time of day
    if (time == "day" || time == "dawn" || time == "cloudy" || time == null) {
        createSky();
        switchBackground();
        if (place == null) {
            document.getElementById("dawn").checked = true;
        } else {
            document.getElementById(time).checked = true;
        }
    }
    if (time == "night" || time == "dusk") {
        createNight();
        switchBackground();
        document.getElementById(time).checked = true;
    }

    // Creating the place of the floor.
    // Start a loop that will update the objects' positions
    // and render the scene on each frame.
    if (place == "runway" || place == null) {
        createRoad();
        roadLoop();
        if (place == null) {
            document.getElementById("runway").checked = true;
        } else {
            document.getElementById(place).checked = true;
        }
    }
    if (place == "sea") {
        createSea();
        seaLoop();
        document.getElementById(place).checked = true;
    }  
    if (place == "ocean") {
        createOcean();
        oceanLoop();
        document.getElementById(place).checked = true;
    } 
    if (place == "grass") {
        createGrass();
        grassLoop();
        document.getElementById(place).checked = true;
    } 
    if (place == "city") {
        createCity();
        cityLoop();
        document.getElementById(place).checked = true;
    }  
    if (place == "town") {
        createTown();
        townLoop();
        document.getElementById(place).checked = true;
    } 
    if (place == "forest") {
        createForest();
        forestLoop();
        document.getElementById(place).checked = true;
    }

    // Add the listener
    if (control == "manual") {
        document.getElementById(control).checked = true;
        document.addEventListener('mousemove', handleMouseMove, false);
    } else {
        document.getElementById("autoP").checked = true;
    }
}

/* ----- Running the visuals ----- */
window.addEventListener('load', init, false);


/* ----- Creating the Scene ----- */

function createScene() {
    // Get the width and the height of the screen, 
    // use them to set up the aspect ratio of the camera
    // and the size of the renderer.
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;

    // Create the scene 
    scene = new THREE.Scene();

    // Add a fog effect to the scene; same color as the 
    // background color used in the style sheet
    scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);

    // Create the camera 
    aspectRatio = WIDTH / HEIGHT;
    fieldOfView = 60;
    nearPlane = 1;
    farPlane = 10000;
    camera = new THREE.PerspectiveCamera(
        fieldOfView,
        aspectRatio,
        nearPlane,
        farPlane
    );

    // Set the position of the camera
    camera.position.set(0, 100, 200);

    // Create the renderer
    renderer = new THREE.WebGLRenderer({
        // Allow transparency to show the gradient background
        // we defined in the CSS
        alpha: true,

        // Activate the anti-aliasing; this is less performant
        antialias: true
    });

    // Define the size of the renderer; in this case,
    // it will fill the entire screen
    renderer.setSize(WIDTH, HEIGHT);

    // Enable shadow rendering 
    renderer.shadowMap.enabled = true;

    // Add the DOM element of the renderer to the
    // container we created in the HTML
    container = document.getElementById('world');
    container.appendChild(renderer.domElement);

    // Listen to the screen: if the user resizes it
    // we have to update the camera and the renderer size
    window.addEventListener('resize', handleWindowResize, false);
}

// Helper Functions
function handleWindowResize() {
    // update height and width of the renderer and the camera
    HEIGHT = window.innerHEIGHT;
    WIDTH = window.innerWIDTH;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectMatrix4();
}

/* ----- Setting up the lights ----- */

function createLights() {
    // A hemisphere light is a gradient colored light;
    // the first parametet is the sky color, the second parameter is the ground color,
    // the third parameter is the intensity of the light
    hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, .9);

    // A directional light shines from a specific direction.
    // It acts like the sun, that means that all the rays produced are parallel.
    shadowLight = new THREE.DirectionalLight(0xffffff, .9);

    // Set the direction of the light
    shadowLight.position.set(150, 350, 350);

    // Allow shadow casting
    shadowLight.castShadow = true;

    // Define the visible area of the projected shadow
    shadowLight.shadow.camera.left = -400;
    shadowLight.shadow.camera.right = 400;
    shadowLight.shadow.camera.top = 400;
    shadowLight.shadow.camera.bottom = -400;
    shadowLight.shadow.camera.near = 1;
    shadowLight.shadow.camera.far = 1000;

    // Define the resolution of the shadow
    shadowLight.shadow.mapSize.width = 2048;
    shadowLight.shadow.mapSize.height = 2048;

    // Activating the lights
    scene.add(hemisphereLight);
    scene.add(shadowLight);

    // An ambient light modifies the global color of a scene and makes the shadows softer
    ambientLight = new THREE.AmbientLight(0xdc8874, .5);
    scene.add(ambientLight);
}


/* ------------------------------------------------ */
/* ----- Creating the different floor objects ----- */
/* ------------------------------------------------ */

// Constructors
var Sea = function() {
    // create the geometry (shape) of the cylinder;
    // the parameters are: 
    // radius top, radius bottom, height, number of segments on the radius, number of segments vertically
    var geom = new THREE.CylinderGeometry(600, 600, 800, 40, 10);

    // Rotate the geometry on the x axis
    geom.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI/2));

    // Create the material
    var mat = new THREE.MeshPhongMaterial({
        color:Colors.blue,
        transparent:true,
        opacity:.8,
        flatShading: THREE.FlatShading
    });

    // Create a Mesh object/material
    this.mesh = new THREE.Mesh(geom, mat);

    // Allow the sea to receive shadows
    this.mesh.receiveShadow = true;
};
var Ocean = function() {
    // create the geometry (shape) of the cylinder;
    // the parameters are: 
    // radius top, radius bottom, height, number of segments on the radius, number of segments vertically
    var geom = new THREE.CylinderGeometry(600, 600, 800, 40, 10);

    // Rotate the geometry on the x axis
    geom.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI/2));

    // Create the material
    var mat = new THREE.MeshPhongMaterial({
        color:Colors.ocean,
        transparent:true,
        opacity:.8,
        flatShading: THREE.FlatShading
    });

    // Create a Mesh object/material
    this.mesh = new THREE.Mesh(geom, mat);

    // Allow the sea to receive shadows
    this.mesh.receiveShadow = true;
};
var Grass = function() {
    // create the geometry (shape) of the cylinder;
    // the parameters are: 
    // radius top, radius bottom, height, number of segments on the radius, number of segments vertically
    var geom = new THREE.CylinderGeometry(600, 600, 800, 40, 10);

    // Rotate the geometry on the x axis
    geom.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI/2));

    // Create the material
    var mat = new THREE.MeshPhongMaterial({
        color:Colors.grass,
        transparent:true,
        opacity:.8,
        flatShading: THREE.FlatShading
    });

    // Create a Mesh object/material
    this.mesh = new THREE.Mesh(geom, mat);

    // Allow the sea to receive shadows
    this.mesh.receiveShadow = true;
};
var Marking = function() {
    var geomLanes = new THREE.PlaneGeometry(20, 5);
    var matLanes = new THREE.MeshPhongMaterial({color:Colors.white, flatShading:THREE.FlatShading});
    this.mesh = new THREE.Mesh(geomLanes, matLanes);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
};
var Road = function() {
    // create the geometry (shape) of the cylinder;
    // the parameters are: 
    // radius top, radius bottom, height, number of segments on the radius, number of segments vertically
    var geom = new THREE.CylinderGeometry(600, 600, 800, 40, 10);

    // Rotate the geometry on the x axis
    geom.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI/2));

    // Create the material
    var mat = new THREE.MeshPhongMaterial({
        color:Colors.road,
        transparent:true,
        opacity:.8,
        flatShading: THREE.FlatShading
    });

    // Create a Mesh object/material
    this.mesh = new THREE.Mesh(geom, mat);

    // Allow the sea to receive shadows
    this.mesh.receiveShadow = true;

    // Additional road markings
    // To distribute the clouds consistently, 
    // we need to place them according to a uniform angle
    var stepAngle = Math.PI * 2 / 50;
    // Create the lines
    for (var i = 0; i < 50; i++) {
        var m = new Marking();
        // Set the rotation and the position of each cloud;
        // for that we use a bit of trigonometry 
        var a = stepAngle * i; // this is the final angle of the cloud
        // var h = 750 + Math.random() * 200;
        var h = 600;
        // this is the distance between the center of the axis and the cloud itself
        // We are simply converting polar coordants (angle, distance) into Cartesian Coordinates (x, y)
        m.mesh.position.y = Math.sin(a)*h;
        m.mesh.position.x = Math.cos(a)*h;
        // Rotate the cloud according to its position
        m.mesh.rotation.z = a + Math.PI/2;
        // for a better result, we position the clouds
        // at random depths inside of the scene
        m.mesh.position.z = -50;
        // Add the mesh of each scene  
        this.mesh.add(m.mesh);
    }
};
var Building = function(height) {
    var geomBuilding = new THREE.BoxGeometry(Math.floor(Math.random()*30)+30, height, Math.floor(Math.random()*30)+30, 1, 1, 1);
    var matBuilding = new THREE.MeshPhongMaterial({color:pickRandom(Paint), flatShading:THREE.FlatShading});
    this.mesh = new THREE.Mesh(geomBuilding, matBuilding);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
};
var City = function() {
    // create the geometry (shape) of the cylinder;
    // the parameters are: 
    // radius top, radius bottom, height, number of segments on the radius, number of segments vertically
    var geom = new THREE.CylinderGeometry(600, 600, 800, 40, 10);

    // Rotate the geometry on the x axis
    geom.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI/2));

    // Create the material
    var mat = new THREE.MeshPhongMaterial({
        color:Colors.road,
        transparent:true,
        opacity:.8,
        flatShading: THREE.FlatShading
    });

    // Create a Mesh object/material
    this.mesh = new THREE.Mesh(geom, mat);

    // Allow the sea to receive shadows
    this.mesh.receiveShadow = true;

    var stepAngle = Math.PI * 2 / 50;
    for (var i = 0; i < Math.floor(Math.random()*30)+10; i++) {
        // Random Height
        var tempH = Math.floor(Math.random()*50)+50;
        var b = new Building(tempH);
        // Set the rotation and the position of each cloud;
        // for that we use a bit of trigonometry 
        var a = stepAngle * i; // this is the final angle of the cloud
        // var h = 750 + Math.random() * 200;
        var h = 590 + (tempH/2);
        // this is the distance between the center of the axis and the cloud itself
        // We are simply converting polar coordants (angle, distance) into Cartesian Coordinates (x, y)
        b.mesh.position.y = Math.sin(a)*h;
        b.mesh.position.x = Math.cos(a)*h;
        // Rotate the cloud according to its position
        b.mesh.rotation.z = a + Math.PI/2;
        // for a better result, we position the clouds
        // at random depths inside of the scene
        b.mesh.position.z = -100+Math.random()*100;
        // Add the mesh of each scene 
        this.mesh.add(b.mesh);
    }
};
var House = function() {
    // Main section
    var geomBuilding = new THREE.BoxGeometry(50, 50, 50, 1, 1, 1);
    var matBuilding = new THREE.MeshPhongMaterial({color:pickRandom(Paint), flatShading:THREE.FlatShading});
    this.mesh = new THREE.Mesh(geomBuilding, matBuilding);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

    // Roof 
    var geomRoof = new THREE.ConeGeometry(40, 30, 4);
    var matRoof = new THREE.MeshPhongMaterial({color:Colors.brick, flatShading:THREE.FlatShading});
    var roof = new THREE.Mesh(geomRoof, matRoof);
    roof.castShadow = true;
    roof.receiveShadow = true;
    roof.position.y = -39;
    roof.rotation.z = 3.2;
    roof.rotation.y = .8;
    this.mesh.add(roof);

    // Door
    var geomDoor = new THREE.PlaneGeometry(10, 15);
    var matDoor = new THREE.MeshPhongMaterial({color:Colors.white, flatShading:THREE.FlatShading});
    var door = new THREE.Mesh(geomDoor, matDoor);
    door.castShadow = true;
    door.receiveShadow = true;
    door.position.y = 15;
    door.position.z = 25;
    this.mesh.add(door);

    // Windows
    for (var i = 0; i <= 20; i += 20) {
        var geomWindow = new THREE.PlaneGeometry(7, 7);
        var matWindow = new THREE.MeshPhongMaterial({color:Colors.glass, flatShading:THREE.FlatShading});
        var window = new THREE.Mesh(geomWindow, matWindow);
        window.castShadow = true;
        window.receiveShadow = true;
        window.position.x = -10 + i;
        window.position.y = -10;
        window.position.z = 25;
        this.mesh.add(window);
    }
};
var Tree = function() {
    // Trunk
    var geomTrunk = new THREE.BoxGeometry(10, 10, 30, 1, 1, 1);
    var matTrunk = new THREE.MeshPhongMaterial({color:Colors.brown, flatShading:THREE.FlatShading});
    this.mesh = new THREE.Mesh(geomTrunk, matTrunk);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

    // Leaves 
    var geomLeaf = new THREE.SphereGeometry(20, 20, 16);
    var matLeaf = new THREE.MeshPhongMaterial({color:Colors.grass, flatShading:THREE.FlatShading});
    var leaf = new THREE.Mesh(geomLeaf, matLeaf);
    leaf.castShadow = true;
    leaf.receiveShadow = true;
    leaf.position.y = -20;
    this.mesh.add(leaf);
};
var Town = function() {
    // create the geometry (shape) of the cylinder;
    // the parameters are: 
    // radius top, radius bottom, height, number of segments on the radius, number of segments vertically
    var geom = new THREE.CylinderGeometry(600, 600, 800, 40, 10);

    // Rotate the geometry on the x axis
    geom.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI/2));

    // Create the material
    var mat = new THREE.MeshPhongMaterial({
        color:Colors.grass,
        transparent:true,
        opacity:.8,
        flatShading: THREE.FlatShading
    });

    // Create a Mesh object/material
    this.mesh = new THREE.Mesh(geom, mat);

    // Allow the sea to receive shadows
    this.mesh.receiveShadow = true;

    var stepAngle = Math.PI * 2 / 50;
    for (var i = 0; i < Math.floor(Math.random()*30)+10; i++) {
        // Random Height
        var b = new House();
        var t = new Tree();
        // Set the rotation and the position of each cloud;
        // for that we use a bit of trigonometry 
        var a = stepAngle * i; // this is the final angle of the cloud
        // var h = 750 + Math.random() * 200;
        var h = 620;
        // this is the distance between the center of the axis and the cloud itself
        // We are simply converting polar coordants (angle, distance) into Cartesian Coordinates (x, y)
        b.mesh.position.y = Math.sin(a)*h;
        b.mesh.position.x = Math.cos(a)*h;
        t.mesh.position.y = Math.sin(a)*h;
        t.mesh.position.x = Math.cos(a)*h;
        // Rotate the cloud according to its position
        b.mesh.rotation.z = a + Math.PI/2;
        t.mesh.rotation.z = a + Math.PI/2;
        // for a better result, we position the clouds
        // at random depths inside of the scene
        b.mesh.position.z = -200;
        t.mesh.position.z = 50;
        // Add the mesh of each scene  
        this.mesh.add(b.mesh);
        this.mesh.add(t.mesh);
    }
};
var Forest = function() {
    // create the geometry (shape) of the cylinder;
    // the parameters are: 
    // radius top, radius bottom, height, number of segments on the radius, number of segments vertically
    var geom = new THREE.CylinderGeometry(600, 600, 800, 40, 10);

    // Rotate the geometry on the x axis
    geom.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI/2));

    // Create the material
    var mat = new THREE.MeshPhongMaterial({
        color:Colors.grass,
        transparent:true,
        opacity:.8,
        flatShading: THREE.FlatShading
    });

    // Create a Mesh object/material
    this.mesh = new THREE.Mesh(geom, mat);

    // Allow the sea to receive shadows
    this.mesh.receiveShadow = true;

    var stepAngle = Math.PI * 2 / 50;
    for (var i = 0; i < Math.floor(Math.random()*30)+10; i++) {
        var t = new Tree();
        var a = stepAngle * i;
        var h = 620;
        t.mesh.position.y = Math.sin(a)*h;
        t.mesh.position.x = Math.cos(a)*h;
        t.mesh.rotation.z = a + Math.PI/2;
        t.mesh.position.z = 50;
        this.mesh.add(t.mesh);
    }
    for (var i = 0; i < Math.floor(Math.random()*30)+10; i++) {
        var t = new Tree();
        var a = stepAngle * i;
        var h = 620;
        t.mesh.position.y = Math.sin(a)*h;
        t.mesh.position.x = Math.cos(a)*h;
        t.mesh.rotation.z = a + Math.PI/2;
        t.mesh.position.z = 80;
        this.mesh.add(t.mesh);
    }
};

// Instantiate the floor and add it to the scene:
var sea, ocean, grass, road, city, town, forest;

function createSea() {
    sea = new Sea();

    // Push it a little bit at the bottom of the scene to add effect
    sea.mesh.position.y = -600;

    // Add the mesh of the sea to the scene
    scene.add(sea.mesh);
}
function createOcean() {
    ocean = new Ocean();

    // Push it a little bit at the bottom of the scene to add effect
    ocean.mesh.position.y = -600;

    // Add the mesh of the sea to the scene
    scene.add(ocean.mesh);
}
function createGrass() {
    grass = new Grass();

    // Push it a little bit at the bottom of the scene to add effect
    grass.mesh.position.y = -600;

    // Add the mesh of the sea to the scene
    scene.add(grass.mesh);
}
function createRoad() {
    road = new Road();

    // Push it a little bit at the bottom of the scene to add effect
    road.mesh.position.y = -600;

    // Add the mesh of the sea to the scene
    scene.add(road.mesh);
}
function createCity() {
    city = new City();

    // Push it a little bit at the bottom of the scene to add effect
    city.mesh.position.y = -600;

    // Add the mesh of the sea to the scene
    scene.add(city.mesh);
}
function createTown() {
    town = new Town();

    // Push it a little bit at the bottom of the scene to add effect
    town.mesh.position.y = -600;

    // Add the mesh of the sea to the scene
    scene.add(town.mesh);
}
function createForest() {
    forest = new Forest();

    // Push it a little bit at the bottom of the scene to add effect
    forest.mesh.position.y = -600;

    // Add the mesh of the sea to the scene
    scene.add(forest.mesh);
}

/* ----- Creating Clouds and objects ----- */

// Constructor 
var Cloud = function() {
    // Create the empty container that will hold the different parts of the cloud
    this.mesh = new THREE.Object3D();

    // Create a cube geometry;
    // this shape will be duplicated to create the cloud
    var geom = new THREE.BoxGeometry(20, 20, 20);

    // Create a material
    var mat = new THREE.MeshPhongMaterial({
        color:Colors.white,
    });

    // Duplicate the geometry a random number of times
    var nBlocs = 3 + Math.floor(Math.random() * 3);
    for (var i = 0; i < nBlocs; i++) {
        // Create the mesh by cloning the geometry
        var m = new THREE.Mesh(geom, mat);

        // Set the position and the rotation of each cube randomly
        m.position.x = i * 15;
        m.position.y = Math.random() * 10;
        m.position.z = Math.random() * 10;
        m.rotation.z = Math.random() * Math.PI*2;
        m.rotation.y = Math.random() * Math.PI*2;

        // Set the size of the cube randomly
        var s = .1 + Math.random() * .9;
        m.scale.set(s, s, s);

        // Allow each cube to cast and to receive shadows
        m.castShadow = true;
        m.receiveShadow = true;

        // Add the cube to the container we first created
        this.mesh.add(m);
    }
}
var Star = function() {
    // Create the empty container that will hold the different parts of the cloud
    this.mesh = new THREE.Object3D();

    // Create a cube geometry;
    // this shape will be duplicated to create the cloud
    var geom = new THREE.BoxGeometry(5, 5, 5);

    // Create a material
    var mat = new THREE.MeshPhongMaterial({
        color:Colors.white
    });

    // Duplicate the geometry a random number of times
    var nBlocs = 3 + Math.floor(Math.random() * 3);
    for (var i = 0; i < nBlocs; i++) {
        // Create the mesh by cloning the geometry
        var m = new THREE.Mesh(geom, mat);

        // Set the position and the rotation of each cube randomly
        m.position.x = i * 15;
        m.position.y = Math.random() * 10;
        m.position.z = Math.random() * 10;
        m.rotation.z = Math.random() * Math.PI*2;
        m.rotation.y = Math.random() * Math.PI*2;

        // Set the size of the cube randomly
        var s = .1 + Math.random() * .9;
        m.scale.set(s, s, s);

        // Allow each cube to cast and to receive shadows
        m.castShadow = true;
        m.receiveShadow = true;

        // Add the cube to the container we first created
        this.mesh.add(m);
    }
}

/* ----- Creating the Sky object ----- */

// Constructor
var Sky = function() {
    // Create an empty container
    this.mesh = new THREE.Object3D();

    // Choose a number of clouds to be scattered in the sky
    this.nClouds = 20;

    // To distribute the clouds consistently, 
    // we need to place them according to a uniform angle
    var stepAngle = Math.PI * 2 / this.nClouds;

    // Create the clouds
    for (var i = 0; i < this.nClouds; i++) {
        var c = new Cloud();
        
        // Set the rotation and the position of each cloud;
        // for that we use a bit of trigonometry 
        var a = stepAngle * i; // this is the final angle of the cloud
        var h = 750 + Math.random() * 200;
        // this is the distance between the center of the axis and the cloud itself

        // We are simply converting polar coordants (angle, distance) into Cartesian Coordinates (x, y)
        c.mesh.position.y = Math.sin(a)*h;
        c.mesh.position.x = Math.cos(a)*h;

        // Rotate the cloud according to its position
        c.mesh.rotation.z = a + Math.PI/2;

        // for a better result, we position the clouds
        // at random depths inside of the scene
        c.mesh.position.z = -400-Math.random()*400;

        // we also set a random scale for each cloud
        var s = 1 + Math.random()*2;
        c.mesh.scale.set(s, s, s);

        // Add the mesh of each scene  
        this.mesh.add(c.mesh);
    }
}
var Night = function() {
    // Create an empty container
    this.mesh = new THREE.Object3D();

    // To distribute the clouds consistently, 
    // we need to place them according to a uniform angle
    var stepAngle = Math.PI * 2 / 30;

    // Create the clouds
    for (var i = 0; i < 30; i++) {
        var n = new Star();
        
        // Set the rotation and the position of each cloud;
        // for that we use a bit of trigonometry 
        var a = stepAngle * i; // this is the final angle of the cloud
        var h = 750 + Math.random() * 200;
        // this is the distance between the center of the axis and the cloud itself

        // We are simply converting polar coordants (angle, distance) into Cartesian Coordinates (x, y)
        n.mesh.position.y = Math.sin(a)*h;
        n.mesh.position.x = Math.cos(a)*h;

        // Rotate the cloud according to its position
        n.mesh.rotation.z = a + Math.PI/2;

        // for a better result, we position the clouds
        // at random depths inside of the scene
        n.mesh.position.z = -500-Math.random()*400;

        // we also set a random scale for each cloud
        var s = 1 + Math.random()*2;
        n.mesh.scale.set(s, s, s);

        // Add the mesh of each scene  
        this.mesh.add(n.mesh);
    }
}

// Instantiate the sky and push its center a bit
// towards the bottom of the screen
var sky, night; 

function createSky() {
    sky = new Sky();
    sky.mesh.position.y = -600;
    scene.add (sky.mesh);
}
function createNight() {
    night = new Night();
    night.mesh.position.y = -600;
    scene.add (night.mesh);
}

/* ----- Creating the Airplane ----- */

// Constructor 
var AirPlane  = function() {
    this.mesh = new THREE.Object3D();

    // Create the cabin
    var geomCockpit = new THREE.BoxGeometry(80, 50, 50, 1, 1, 1);
    var matCockpit = new THREE.MeshPhongMaterial({color:Colors.red, flatShading:THREE.FlatShading});
    var cockpit = new THREE.Mesh(geomCockpit, matCockpit);
    cockpit.castShadow = true;
    cockpit.receiveShadow = true;
    this.mesh.add(cockpit);

    // Create the engine
    var geomEngine = new THREE.BoxGeometry(20, 50, 50, 1, 1, 1);
    var matEngine = new THREE.MeshPhongMaterial({color:Colors.white, flatShading:THREE.FlatShading});
    var engine = new THREE.Mesh(geomEngine, matEngine);
    engine.position.x = 40;
    engine.castShadow = true;
    engine.receiveShadow = true;
    this.mesh.add(engine);

    // Create the tail
    var geomTailPlane = new THREE.BoxGeometry(20, 30, 5, 1, 1, 1);
    var matTailPlane = new THREE.MeshPhongMaterial({color:Colors.red, flatShading:THREE.FlatShading});
    var tailPlane = new THREE.Mesh(geomTailPlane, matTailPlane);
    tailPlane.position.set(-40, 25, 0);
    tailPlane.castShadow = true;
    tailPlane.receiveShadow = true;
    this.mesh.add(tailPlane);

    // Create the wing
    var geomSideWing = new THREE.BoxGeometry(40, 8, 150, 1, 1, 1);
    var matSideWing = new THREE.MeshPhongMaterial({color:Colors.red, flatShading:THREE.FlatShading});
    var sideWing = new THREE.Mesh(geomSideWing, matSideWing);
    sideWing.castShadow = true;
    sideWing.receiveShadow = true;
    this.mesh.add(sideWing);

    // Propeller
    var geomPropeller = new THREE.BoxGeometry(20, 10, 10, 1, 1, 1);
    var matPropeller = new THREE.MeshPhongMaterial({color:Colors.brownDark, flatShading:THREE.FlatShading});
    this.propeller = new THREE.Mesh(geomPropeller, matPropeller);
    this.propeller.castShadow = true;
    this.propeller.receiveShadow = true;

    // Blades
    var geomBlade = new THREE.BoxGeometry(1, 100, 20, 1, 1, 1);
    var matBlade = new THREE.MeshPhongMaterial({color:Colors.brownDark, flatShading:THREE.FlatShading});
    var blade = new THREE.Mesh(geomBlade, matBlade);
    blade.position.set(8, 0, 0);
    blade.castShadow = true;
    blade.receiveShadow = true;
    this.propeller.add(blade);
    this.propeller.position.set(50, 0, 0);
    this.mesh.add(this.propeller);

    // Windshield Glass
    var geomGlass = new THREE.BoxGeometry(5, 30, 50, 1, 1, 1);
    var matGlass = new THREE.MeshPhongMaterial({color:Colors.glass, flatShading:THREE.FlatShading});
    var glass = new THREE.Mesh(geomGlass, matGlass);
    glass.castShadow = true;
    glass.receiveShadow = true;
    glass.position.y = 40;
    glass.position.x = 20;
    this.mesh.add(glass);

    // Wheels
    var geomWheel = new THREE.BoxGeometry(10, 10, 5, 1, 1, 1);
    var matWheel = new THREE.MeshPhongMaterial({color:Colors.wheel, flatShading:THREE.FlatShading});
    var wheel = new THREE.Mesh(geomWheel, matWheel);
    wheel.castShadow = true;
    wheel.receiveShadow = true;
    wheel.position.y = -30;
    wheel.position.x = -25;
    this.mesh.add(wheel);
    var geomWheelFLC = new THREE.BoxGeometry(25, 10, 10, 1, 1, 1);
    var matWheelFLC = new THREE.MeshPhongMaterial({color:Colors.red, flatShading:THREE.FlatShading});
    var wheelFLC = new THREE.Mesh(geomWheelFLC, matWheelFLC);
    wheelFLC.castShadow = true;
    wheelFLC.receiveShadow = true;
    wheelFLC.position.set(25, -30, 30);
    this.mesh.add(wheelFLC);
    var geomWheelFR = new THREE.BoxGeometry(15, 15, 10, 1, 1, 1);
    var matWheelFR = new THREE.MeshPhongMaterial({color:Colors.wheel, flatShading:THREE.FlatShading});
    var wheelFR = new THREE.Mesh(geomWheelFR, matWheelFR);
    wheelFR.castShadow = true;
    wheelFR.receiveShadow = true;
    wheelFR.position.set(25, -40, 25);
    this.mesh.add(wheelFR);
    var geomWheelFLC = new THREE.BoxGeometry(25, 10, 10, 1, 1, 1);
    var matWheelFLC = new THREE.MeshPhongMaterial({color:Colors.red, flatShading:THREE.FlatShading});
    var wheelFLC = new THREE.Mesh(geomWheelFLC, matWheelFLC);
    wheelFLC.castShadow = true;
    wheelFLC.receiveShadow = true;
    wheelFLC.position.set(25, -30, -30);
    this.mesh.add(wheelFLC);
    var geomWheelFR = new THREE.BoxGeometry(15, 15, 10, 1, 1, 1);
    var matWheelFR = new THREE.MeshPhongMaterial({color:Colors.wheel, flatShading:THREE.FlatShading});
    var wheelFR = new THREE.Mesh(geomWheelFR, matWheelFR);
    wheelFR.castShadow = true;
    wheelFR.receiveShadow = true;
    wheelFR.position.set(25, -40, -25);
    this.mesh.add(wheelFR);
};

// Instantiate the Airplane
var airplane;

function createPlane() {
    airplane = new AirPlane();
    airplane.mesh.scale.set(.25, .25, .25);
    airplane.mesh.position.y = 100;
    scene.add(airplane.mesh);
}


/* ----- Making the Animations loop ----- */

function seaLoop() {
    // Rotate the propeller, the sea and the sky
    sea.mesh.rotation.z += .005;
    var t = sessionStorage.getItem("Time");
    if (t == "night" || t == "dusk") {
        night.mesh.rotation.z += .01;
    } else {
        sky.mesh.rotation.z += .01;
    }

    // update the plane on each frame
    updatePlane();

    // Render the scene
    renderer.render(scene, camera);

    // Call the loop function again
    requestAnimationFrame(seaLoop);
}
function oceanLoop() {
    // Rotate the propeller, the sea and the sky
    ocean.mesh.rotation.z += .005;
    var t = sessionStorage.getItem("Time");
    if (t == "night" || t == "dusk") {
        night.mesh.rotation.z += .01;
    } else {
        sky.mesh.rotation.z += .01;
    }

    // update the plane on each frame
    updatePlane();

    // Render the scene
    renderer.render(scene, camera);

    // Call the loop function again
    requestAnimationFrame(oceanLoop);
}
function grassLoop() {
    // Rotate the propeller, the sea and the sky
    grass.mesh.rotation.z += .005;
    var t = sessionStorage.getItem("Time");
    if (t == "night" || t == "dusk") {
        night.mesh.rotation.z += .01;
    } else {
        sky.mesh.rotation.z += .01;
    }

    // update the plane on each frame
    updatePlane();

    // Render the scene
    renderer.render(scene, camera);

    // Call the loop function again
    requestAnimationFrame(grassLoop);
}
function roadLoop() {
    // Rotate the propeller, the sea and the sky
    road.mesh.rotation.z += .005;
    var t = sessionStorage.getItem("Time");
    if (t == "night" || t == "dusk") {
        night.mesh.rotation.z += .01;
    } else {
        sky.mesh.rotation.z += .01;
    }

    // update the plane on each frame
    updatePlane();

    // Render the scene
    renderer.render(scene, camera);

    // Call the loop function again
    requestAnimationFrame(roadLoop);
}
function cityLoop() {
    // Rotate the propeller, the sea and the sky
    city.mesh.rotation.z += .005;
    var t = sessionStorage.getItem("Time");
    if (t == "night" || t == "dusk") {
        night.mesh.rotation.z += .01;
    } else {
        sky.mesh.rotation.z += .01;
    }

    // update the plane on each frame
    updatePlane();

    // Render the scene
    renderer.render(scene, camera);

    // Call the loop function again
    requestAnimationFrame(cityLoop);
}
function townLoop() {
    // Rotate the propeller, the sea and the sky
    town.mesh.rotation.z += .005;
    var t = sessionStorage.getItem("Time");
    if (t == "night" || t == "dusk") {
        night.mesh.rotation.z += .01;
    } else {
        sky.mesh.rotation.z += .01;
    }

    // update the plane on each frame
    updatePlane();

    // Render the scene
    renderer.render(scene, camera);

    // Call the loop function again
    requestAnimationFrame(townLoop);
}
function forestLoop() {
    // Rotate the propeller, the sea and the sky
    forest.mesh.rotation.z += .005;
    var t = sessionStorage.getItem("Time");
    if (t == "night" || t == "dusk") {
        night.mesh.rotation.z += .01;
    } else {
        sky.mesh.rotation.z += .01;
    }

    // update the plane on each frame
    updatePlane();

    // Render the scene
    renderer.render(scene, camera);

    // Call the loop function again
    requestAnimationFrame(forestLoop);
}


/* ----------------------------- */
/* ----- User interaction ----- */ 
var mousePos = {x:0, y:0};

function handleMouseMove(event) {
    // Here we are converting the mouse position value received
    // to a normalized value varying between -1 and 1;
    // this is the formula for the horizontal axis:

    var tx = -1 + (event.clientX / WIDTH) * 2;

    // for the vertical axis, we need to inverse the formula
    // because the 2D y-axis goes the opposite direction of the 3D y-axis

    var ty = 1 - (event.clientY / HEIGHT) * 2;
    mousePos = {x:tx, y:ty};
}

function updatePlane() {
    // Let's move the airplane between -100 and 100 on the horizontal axis,
    // and between 25 and 175 on the vertical axis,
    // depending on the mouse position which ranges between -1 and 1 on both axes;
    // to achieve that we use a normalize function

    var targetX = normalize(mousePos.x, -.75, .75, -100, 100);
    var targetY = normalize(mousePos.y, -.75, .75, 25, 175);

    // Move the plane at each frame by adding a fraction of the remaining distance
    airplane.mesh.position.y += (targetY - airplane.mesh.position.y) * 0.1;

    // Rotate the plane proportionally to the remaining distance
    airplane.mesh.rotation.z = (targetY - airplane.mesh.position.y) * 0.0128;
    airplane.mesh.rotation.x = (airplane.mesh.position.y - targetY) * 0.0064;

    airplane.propeller.rotation.x += 0.3;
}

function normalize(v, vmin, vmax, tmin, tmax) {
    var nv = Math.max(Math.min(v,vmax), vmin);
    var dv = vmax - vmin;
    var pc = (nv - vmin) / dv;
    var dt = tmax - tmin;
    var tv = tmin + (pc * dt);
    return tv;
}

/* ---------------------------- */
/* ----- Helper Functions ----- */
/* ---------------------------- */
function pickRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
}