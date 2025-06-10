import { MathUtils } from "./utils/math-utils.js";
import { ViewportUtils } from "./utils/viewport-utils.js";
import { Sphere } from "./scene-objects/sphere.js";

// Create a canvas element and add it to the document
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







let running = true; // Flag to control the rendering loop
const recursion_depth = 3; // Set recursion depth for ray tracing
const O = [0, 0, 0]; // Fixed syntax for defining 'o'
const d = 1
const viewportSize = {
    width: 1,
    height: 1
}; // Set viewport size


// scene

const sceneObjects = [
    new Sphere([0, -1, 3], 1, [255, 0, 0], 500, 0.2), // Red sphere shiny
    new Sphere([-2, 0, 4], 1, [0, 0, 255], 500, 0.3), // Green sphere shiny
    new Sphere([2, 0, 4], 1, [0, 255, 0], 10, 0.4), // Blue sphere somewhat shiny
    new Sphere([0, -5001, 0], 5000, [255, 255, 0], 1000, 0.5) // Yellow sphere very shiny
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



let yaw = 0; // Left/Right rotation angle
let pitch = 0; // Up/Down rotation angle





window.addEventListener('keydown', function handleKeyDown(event) {
    switch (event.key) {
        case 'ArrowLeft':
            yaw -= 0.05; // Rotate left
            break;
        case 'ArrowRight':
            yaw += 0.05; // Rotate right
            break;
        case 'ArrowDown':
            pitch += 0.05; // Rotate down
            break;
        case 'ArrowUp':
            pitch -= 0.05; // Rotate UP
            break;
        case 'Escape':
            running = false;
            window.removeEventListener('keydown', handleKeyDown);
            console.log("not listening anymore yo phon linging") // Stop the rendering loop
            return;
    }
});

requestAnimationFrame(loop); // Start the rendering loop

function loop() {
    if (!running) {
        return; // Exit the loop if not running
    }
    const R = MathUtils.multiply3x3Matrices(MathUtils.createPitchMatrix(pitch), MathUtils.createYawMatrix(yaw)); // Combine pitch and yaw rotations
    lowResCtx.clearRect(0, 0, lowResCanvas.width, lowResCanvas.height);
    renderScene(R); // Render the scene with the updated rotation
    requestAnimationFrame(loop); // Request the next frame

}



function renderScene(R) {
    for (let x = -(lowResCanvas.width / 2); x < (lowResCanvas.width / 2); x++) {
        for (let y = -(lowResCanvas.height / 2); y < (lowResCanvas.height / 2); y++) {
            const D = ViewportUtils.canvasToViewPort(x, y, lowResCanvas, viewportSize, d); // Convert canvas coordinates to viewport coordinates
            const rotated_D = MathUtils.rotateVector(D, R); // Rotate the direction vector
            const color = TraceRay(O, rotated_D, 1, Infinity, recursion_depth);
            lowResCtx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
            // Adjust coordinates to center the origin
            lowResCtx.fillRect(x + lowResCanvas.width / 2, lowResCanvas.height / 2 - y, 1, 1);
        }
    }
    ctx.drawImage(lowResCanvas, 0, 0, canvas.width, canvas.height);
}


function TraceRay(O, D, t_min, t_max, recursion_depth) {

    const [closest_obj, closest_t] = ClosestIntersection(O, D, t_min, t_max);

    if (closest_obj === null) {
        // console.log("No sphere hit, returning background color");
        return [0, 0, 0]; // Background color
    }

    // console.log(`Hit sphere at ${closest_sphere.center} with color ${closest_sphere.color}`);
    const P = [O[0] + closest_t * D[0], O[1] + closest_t * D[1], O[2] + closest_t * D[2]]; // Intersection point
    const N = closest_obj.getNormal(P); // Normal at the intersection point
    const lighting = ComputeLighting(P, N, [D[0] * -1, D[1] * -1, D[2] * -1], closest_obj.specular); // Compute lighting
    const local_color = [
        closest_obj.color[0] * lighting,
        closest_obj.color[1] * lighting,
        closest_obj.color[2] * lighting
    ];


    const r = closest_obj.reflective;
    if (recursion_depth <= 0 || r <= 0) {
        // console.log(`Returning local color ${local_color}`);
        return local_color; // Return the local color if no reflection
    }

    const R = MathUtils.reflectRay([D[0] * -1, D[1] * -1, D[2] * -1], N); // Reflect the ray
    const reflected_color = TraceRay(P, R, 0.001, Infinity, recursion_depth - 1); // Trace the reflected ray
    return [
        local_color[0] * (1 - r) + reflected_color[0] * r,
        local_color[1] * (1 - r) + reflected_color[1] * r,
        local_color[2] * (1 - r) + reflected_color[2] * r
    ]; // Combine local and reflected colors
}


function ClosestIntersection(O, D, t_min, t_max) {
    let closest_t = Infinity;
    let closest_obj = null;
    for (const obj of sceneObjects) {
        const [t1, t2] = obj.intersect(O, D); // Get intersection point
        if (t1 > t_min && t1 < t_max && t1 < closest_t) {
            closest_t = t1;
            closest_obj = obj;
        }
        if (t2 > t_min && t2 < t_max && t2 < closest_t) {
            closest_t = t2;
            closest_obj = obj;
        }
    }

    return [closest_obj, closest_t]


}

// function IntersectRaySphere(O, D, sphere) {
//     const r = sphere.radius
//     const CO = [O[0] - sphere.center[0], O[1] - sphere.center[1], O[2] - sphere.center[2]]
//     const a = MathUtils.dot(D, D)
//     const b = 2 * MathUtils.dot(CO, D)
//     const c = MathUtils.dot(CO, CO) - r * r
//     const discriminant = b * b - 4 * a * c
//     if (discriminant < 0) {
//         return [Infinity, Infinity] // No intersection
//     } else {
//         const t1 = (-b - Math.sqrt(discriminant)) / (2 * a)
//         const t2 = (-b + Math.sqrt(discriminant)) / (2 * a)
//         return [t1, t2]
//     }
// }

function ComputeLighting(P, N, V, s) {
    let i = 0.0
    for (const light of lights) {
        if (light.type === 'ambient') {
            i += light.intensity
        }
        else {
            let L = 0
            let t_max
            if (light.type === 'point') {
                L = [light.position[0] - P[0], light.position[1] - P[1], light.position[2] - P[2]]
                t_max = 1
            }
            else if (light.type === 'directional') {
                L = [light.direction[0], light.direction[1], light.direction[2]]
                t_max = Infinity
            }
            // shadow check
            const [shadow_sphere, shadow_t] = ClosestIntersection(P, L, 0.001, t_max)
            if (shadow_sphere) {
                continue // Skip this light if there's a shadow
            }

            // diffuse
            const N_dot_L = MathUtils.dot(N, L)
            if (N_dot_L > 0) {
                i += light.intensity * N_dot_L / (MathUtils.length(N) * MathUtils.length(L))
            }

            // specular
            if (s != -1) {
                const R = MathUtils.reflectRay(L, N) // Reflect the light direction
                const V_dot_R = MathUtils.dot(V, R)
                if (V_dot_R > 0) {
                    i += light.intensity * Math.pow(V_dot_R / (MathUtils.length(V) * MathUtils.length(R)), s)
                }
            }
        }

    }
    return i
}
