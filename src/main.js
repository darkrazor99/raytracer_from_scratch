import { AppState, getCurrentState, switchState, onStateChange } from "./core/state-manager.js";
import { MathUtils } from "./utils/math-utils.js";
import { ViewportUtils } from "./utils/viewport-utils.js";
import { Sphere } from "./scene-objects/sphere.js";
import { Plane } from "./scene-objects/plane.js";
import { Camera } from "./camera/camera.js";
import { CameraController } from "./camera/camera-controller.js";
import { getRenderer } from "./renderer/index.js";



// Create a canvas element and add it to the document

console.log('App starting in state:', getCurrentState());

onStateChange((newState, oldState) => {
    console.log(`State changed from ${oldState} to ${newState}`);

    if (oldState === AppState.FIRST_PERSON) {
        exitFirstPersonMode(); // Exit first-person mode if switching from it
        canvas.style.display = 'none'; // Hide the canvas   
    }

    if (newState === AppState.FIRST_PERSON) {
        canvas.style.display = 'block'; // Show the canvas
        enterFirstPersonMode(); // Enter first-person mode
    }

    if (oldState === AppState.INTRO) {
        console.log('Exiting INTRO state');
    }

    if (newState === AppState.INTRO) {
        console.log('Entering INTRO state');
        // Here you can add logic to display the intro screen
    }

    if (oldState === AppState.TOP_DOWN) {
        console.log('Exiting TOP_DOWN state');
    }

    if (newState === AppState.TOP_DOWN) {
        console.log('Entering TOP_DOWN state');
        // Here you can add logic to switch to top-down view
    }

});

window.addEventListener('keydown', (e) => {
    if (e.key === '1') switchState(AppState.INTRO);
    if (e.key === '2') switchState(AppState.TOP_DOWN);
    if (e.key === '3') switchState(AppState.FIRST_PERSON);
});




const canvas = document.createElement('canvas');
canvas.width = 1080; // Set canvas width
canvas.height = 720; // Set canvas height
document.body.appendChild(canvas);
// Get the 2D rendering context
const ctx = canvas.getContext('2d');

// lowResCanvas
const lowResCanvas = document.createElement('canvas');
lowResCanvas.width = 180; // Set low resolution canvas width
lowResCanvas.height = 180; // Set low resolution canvas height
const lowResCtx = lowResCanvas.getContext('2d');

ctx.imageSmoothingEnabled = false;
lowResCtx.imageSmoothingEnabled = false;
canvas.style.imageRendering = 'pixelated';



// scene

const sceneObjects = [
    new Sphere([0, -1, 3], 1, [255, 0, 0], 500, 0.2), // Red sphere shiny
    new Sphere([-2, 0, 4], 1, [0, 0, 255], 500, 0.3), // Green sphere shiny
    new Sphere([2, 0, 4], 1, [0, 255, 0], 10, 0.4), // Blue sphere somewhat shiny
    new Sphere([0, 0, -3], 1, [255, 0, 255], 10, 0.5), // Yellow sphere very shiny
    // new Sphere([0, -5001, 0], 5000, [255, 255, 0], 1000, 0.5), // Yellow sphere very shiny

    new Plane([0, -1, 0], [0, 1, 0], [255, 255, 0], 1000, 0.5), // acts as floor just to test will remove later
    new Plane([0, 0, 10], [0, 0, -1], [200, 200, 225], 300, 0.1), // Blue plane faces camera

];

const lights = [
    {
        type: 'ambient',
        intensity: 0.2,
    },
    {
        type: 'point',
        intensity: 0.6,
        position: [2, 1, 0]
    },
    {
        type: 'directional',
        intensity: 0.2,
        direction: [1, 4, 4]
    }

]

const config = {
    width: lowResCanvas.width,
    height: lowResCanvas.height,
    recursionDepth: 3,
    lights: lights,
    scene: sceneObjects,
};





const recursion_depth = 3; // Set recursion depth for ray tracing


const renderer = getRenderer("raytracer"); // Get the raytracer renderer




document.addEventListener('pointerlockerror', () => {
    console.error('❌ Pointer lock failed.');
});

const camera = new Camera(); // Create a camera instance

const cameraController = new CameraController(camera, canvas); // Create a camera controller instance

let running = false; // Flag to control the rendering loop
let loopId = null;

console.log("renderer", renderer)


function loop() {
    if (!running) return;

    //handle input
    cameraController.update();

    const R = camera.getRotationMatrix();
    const position = camera.getPosition();

    lowResCtx.clearRect(0, 0, lowResCanvas.width, lowResCanvas.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    renderer(camera, lowResCtx, config);
//   we draw on the action canvas what the lower canvas has cause i render on low res then shove to high res and make it pixelated 
//  for now untill i figure out a better way of doing this i guess i can hand it to renderer and make it take two canvases lowres + highres. 
    ctx.drawImage(lowResCanvas, 0, 0, canvas.width, canvas.height);
    // renderScene(R, position); // Render the scene with the updated rotation
    requestAnimationFrame(loop); // Request the next frame

}



function enterFirstPersonMode() {
    // console.log('Entering First Person Mode');
    cameraController.enable(); // Enable camera controller for first-person mode
    running = true; // Start the rendering loop
    loopId = requestAnimationFrame(loop); // Start the rendering loop
}

function exitFirstPersonMode() {
    // console.log('Exiting First Person Mode');
    cameraController.disable(); // Disable camera controller
    running = false; // Stop the rendering loop
    if (loopId) {
        cancelAnimationFrame(loopId); // Cancel the rendering loop
        loopId = null;
    }
}