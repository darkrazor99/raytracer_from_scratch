import { renderRaytracedScene } from "./raytracer.js";

const RENDERERS = {
    raytracer: renderRaytracedScene
}

export function getRenderer(name = "raytracer"){
    const renderer = RENDERERS[name];
    if(!renderer) {
        
    }
    
    
    else throw("unsupported renderer");
}