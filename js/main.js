let canvas;
let engine;
let scene;

window.onload = startGame;

function startGame() {
    canvas = document.querySelector("#myCanvas");
    engine = new BABYLON.Engine(canvas, true);
    scene = createScene();;
    engine.runRenderLoop(() => {
        scene.render();
    });
}

function createScene() {
    let scene = new BABYLON.Scene(engine);
    let ground = createGround(scene);
    
    let cameraFixed = createCameraFixed(scene); 
     // second parameter is the target to follow
    //let followCamera = createFollowCamera(scene, buggy);
    scene.activeCamera = cameraFixed;
    //  scene.activeCamera = cameraFixed;

    // createBuggyTondeuse(scene); 

    // // i.e sun light with all light rays parallels, the vector is the direction.
     let light0 = new BABYLON.DirectionalLight("dir0", new BABYLON.Vector3(-1, -1, 0), scene);
    
    return scene;
}

function createCameraFixed(scene){
    let camera = new BABYLON.ArcRotateCamera("MyCamera", 0, 0, 90, new BABYLON.Vector3(0, 2500, 0), scene);
    camera.attachControl(canvas);
    camera.target
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
    const ground = BABYLON.MeshBuilder.CreateGround("gdhm", groundOptions, scene); 
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

// function createBuggyTondeuse(scene){
//     // BABYLON.SceneLoader.ImportMesh("myBuggyTondeuse", "models/", "Buggy.gltf", scene, function (meshes) {          
//     //     let myBuggyTondeuse = newMeshes[0];
//     //     myBuggyTondeuse.position =new BABYLON.Vector3(0, 0, 5);
//     //     myBuggyTondeuse.scaling = new BABYLON.Vector3(0.2  , 0.2, 0.2);
//     //     myBuggyTondeuse.name = "myBuggyTondeuse";
//     //     //let buggy = new BuggyTondeuse(myBuggyTondeuse,scene);
//     // });
    
// }

window.addEventListener("resize", () => {
    engine.resize()
})