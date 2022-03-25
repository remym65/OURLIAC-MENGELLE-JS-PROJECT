let canvas;
let engine;
let scene;
let earthPlane;
let inputStates = {};
let spheres = [];


window.onload = startGame;

function startGame() {
    canvas = document.querySelector("#myCanvas");
    engine = new BABYLON.Engine(canvas, true);
    scene = createScene();
    createPins(scene);
    modifySettings();
    let tank = scene.getMeshByName("heroTank");
    engine.runRenderLoop(() => {
        let deltaTime = engine.getDeltaTime(); // remind you something ? 
        tank.move();
        scene.render();
    });
}

function createScene() {
    let scene = new BABYLON.Scene(engine);
    let ground = createGround(scene);
    let cameraFixed = createCameraFixed(scene); 
    scene.activeCamera = cameraFixed;
    let tank = createTank(scene);
    // // i.e sun light with all light rays parallels, the vector is the direction.
    let light0 = new BABYLON.DirectionalLight("dir0", new BABYLON.Vector3(-1, -1, 0), scene);
    return scene;
}

function createCameraFixed(scene){
    let camera = new BABYLON.ArcRotateCamera("MyCamera", 0, 0, 90, new BABYLON.Vector3(0, 2500, 0), scene);
    camera.attachControl(canvas);
    // prevent camera to cross ground
    camera.checkCollisions = true; 
    // avoid flying with the camera
    camera.applyGravity = true;
    return camera;
}

function createFollowCamera(scene, target) {
    let camera = new BABYLON.FollowCamera("tankFollowCamera", target.position, scene, target);
    camera.radius = 40; // how far from the object to follow
	camera.heightOffset = 14; // how high above the object to place the camera
	camera.rotationOffset = 180; // the viewing angle
	camera.cameraAcceleration = .1; // how fast to move
	camera.maxCameraSpeed = 5; // speed limit
    return camera;
}

function createGround(scene) {
    const groundOptions = { width:2000, height:2000, subdivisions:10, minHeight:0, maxHeight:100};
    //scene is optional and defaults to the current scene
    const ground = BABYLON.MeshBuilder.CreateGround("groundGrass", groundOptions, scene); 
    console.log("ground created");
    const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
    groundMaterial.diffuseTexture = new BABYLON.Texture("images/grass.jpg");
    groundMaterial.diffuseTexture.uScale = 10;
    groundMaterial.diffuseTexture.vScale = 10;
    ground.material = groundMaterial;
    // to be taken into account by collision detection
    ground.checkCollisions = true;
    return ground;
}

function createEarthPlane(scene, x,z) {
    var materialPlane = new BABYLON.StandardMaterial("texturePlane", scene);
    materialPlane.diffuseTexture = new BABYLON.Texture("images/earth.jpg", scene);
    materialPlane.diffuseTexture.uScale = 5.0;//Repeat 5 times on the Vertical Axes
    materialPlane.diffuseTexture.vScale = 5.0;//Repeat 5 times on the Horizontal Axes
    materialPlane.backFaceCulling = false;//Allways show the front and the back of an element
	var plane = BABYLON.MeshBuilder.CreateBox("plane", {height: 10, width: 100, depth:100}, scene); 
    plane.position.x = x;
    plane.position.z = z;
    plane.material = materialPlane;
}

function createPins(scene){
    let sphereMaterials; 
    sphereMaterials = new BABYLON.StandardMaterial("sphereMaterials", scene);
    sphereMaterials.ambientColor = new BABYLON.Color3(0, .8, 0);
    sphereMaterials.diffuseColor = new BABYLON.Color3(1, 0, 0);
    sphereMaterials.alpha = 0.5;
    for(let i = 0; i < 10; i++) {
        spheres[i] = BABYLON.MeshBuilder.CreateSphere("mySphere" +i, {diameter: 100, segments: 40}, scene);
        spheres[i].position.x = getRandomInt(1000);
        spheres[i].position.z = getRandomInt(1000);
        spheres[i].position.y = 1;
        spheres[i].material = sphereMaterials;
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * (max*2)+1) -max;
  }
  

  // expected output: 0, 1 or 2

function createTank(scene) {
    let tank = new BABYLON.MeshBuilder.CreateBox("heroTank", {height:100, depth:100, width:100}, scene);
    let tankMaterial = new BABYLON.StandardMaterial("tankMaterial", scene);
    tankMaterial.diffuseColor = new BABYLON.Color3.Red;
    tankMaterial.emissiveColor = new BABYLON.Color3.Blue;
    tank.material = tankMaterial;
    // By default the box/tank is in 0, 0, 0, let's change that...
    tank.position.y = 10;
    tank.position.x = -800;
    tank.position.z = 800;
    tank.speed = 10;
    tank.verticalVector = new BABYLON.Vector3(1, 0, 0);
    tank.horizontalVector = new BABYLON.Vector3(0, 0, 1);
    tank.move = () => {
        if(inputStates.up) {
            //tank.moveWithCollisions(new BABYLON.Vector3(0, 0, 1*tank.speed));
            if (tank.position.x>-950){
                tank.moveWithCollisions(tank.verticalVector.multiplyByFloats(-tank.speed, -tank.speed, -tank.speed));
            }
            console.log("tank x,y,z: "+tank.position.x+";"+tank.position.y+";"+tank.position.z);
            checkPinsCollision(tank);
        }    
        if(inputStates.down) {
            if (tank.position.x<950){
                tank.moveWithCollisions(tank.verticalVector.multiplyByFloats(tank.speed, tank.speed, tank.speed));
            }
            console.log("tank x,y,z: "+tank.position.x+";"+tank.position.y+";"+tank.position.z);
            checkPinsCollision(tank);
        }  
        if(inputStates.left) { 
            if (tank.position.z>-950){
                tank.moveWithCollisions(tank.horizontalVector.multiplyByFloats(-tank.speed, -tank.speed, -tank.speed)); 
            }
            checkPinsCollision(tank);
            console.log("tank x,y,z: "+tank.position.x+";"+tank.position.y+";"+tank.position.z);
        }    
        if(inputStates.right) {
            if (tank.position.z<950){
                tank.moveWithCollisions(tank.horizontalVector.multiplyByFloats(tank.speed, tank.speed, tank.speed));
            }
            checkPinsCollision(tank);
            console.log("tank x,y,z: "+tank.position.x+";"+tank.position.y+";"+tank.position.z);
        }
        earthPlane = createEarthPlane(scene,tank.position.x,tank.position.z);
    }
    return tank;
}

function checkPinsCollision(tank){
    for (let i=0; i< spheres.length; i++){
        let spheresx = spheres[i].position.x;
        let spheresz = spheres[i].position.z;
        let tankx = tank.position.x;
        let tankz = tank.position.z;
        let distance = Math.hypot(tankx - spheresx, tankz - spheresz);
        console.log("distance tank - sphere"+i+" :"+distance);
        if (distance<100){
            spheres[i].dispose();
            tank.scaling =  new BABYLON.Vector3(1,1,1); 
        }
        //do what you need here
    }
    
}

function modifySettings() {
       
    // key listeners for the tank
    inputStates.left = false;
    inputStates.right = false;
    inputStates.up = false;
    inputStates.down = false;
    inputStates.space = false;
    
    //add the listener to the main, window object, and update the states
    window.addEventListener('keydown', (event) => {
        if ((event.key === "ArrowLeft") || (event.key === "q")|| (event.key === "Q")) {
           inputStates.left = true;
        } else if ((event.key === "ArrowUp") || (event.key === "z")|| (event.key === "Z")){
           inputStates.up = true;
        } else if ((event.key === "ArrowRight") || (event.key === "d")|| (event.key === "D")){
           inputStates.right = true;
        } else if ((event.key === "ArrowDown")|| (event.key === "s")|| (event.key === "S")) {
           inputStates.down = true;
        }  else if (event.key === " ") {
           inputStates.space = true;
        }
    }, false);

    //if the key will be released, change the states object 
    window.addEventListener('keyup', (event) => {
        if ((event.key === "ArrowLeft") || (event.key === "q")|| (event.key === "Q")) {
           inputStates.left = false;
        } else if ((event.key === "ArrowUp") || (event.key === "z")|| (event.key === "Z")){
           inputStates.up = false;
        } else if ((event.key === "ArrowRight") || (event.key === "d")|| (event.key === "D")){
           inputStates.right = false;
        } else if ((event.key === "ArrowDown")|| (event.key === "s")|| (event.key === "S")) {
           inputStates.down = false;
        }  else if (event.key === " ") {
           inputStates.space = false;
        }
    }, false);
}