# raytracer_from_scratch

## ✨ Features

### ✅ Implemented

* **Basic Ray Tracing**

  * Ray-sphere intersection
  * Lambertian diffuse shading
  * Phong specular highlights
  * Multiple light sources
  * Shadows

* **Camera**

  * Canvas-to-viewport projection
  * Adjustable camera position and orientation

* **Reflections**

  * Recursive reflection with adjustable recursion depth

* **Lighting**

  * Point lights and directional lights
  * Shadow rays for occlusion testing

* **Object Management**

  * Scene composition from multiple objects
  * Per-object transformations and color

* **Canvas & Viewport**

  * Pixel-wise rendering to HTML5 canvas
  * Canvas resize support
  * Viewport size control


### 🧪 In Progress / Planned

#### 📷 Camera & Navigation

* [ ] **First-person mode**: Walk around a scene using keyboard and mouse
* [ ] **Top-down object placement UI**: Add, rotate, and move objects before entering the scene
* [ ] **Multiple viewports**: Live preview from different angles

#### 🧱 Geometry

* [ ] **Support for triangles**: Triangle-ray intersection and barycentric coordinates
* [ ] **Plane objects**: Flat surfaces for walls or floors
* [ ] **Constructive Solid Geometry (CSG)**: Combine objects using union, intersection, and subtraction
* [ ] **Mesh loader**: Basic OBJ importer

#### 🧼 Visual Enhancements

* [ ] **Transparency**: Blended surface transparency
* [ ] **Refraction**: Snell’s Law-based light bending
* [ ] **Supersampling (anti-aliasing)**: Trace multiple rays per pixel for smoother images

#### 🚀 Performance Optimizations

* [ ] **Multi-threaded rendering**: Use Web Workers to parallelize tile rendering
* [ ] **Early shadow exit**: Abort shadow checks on first hit
* [ ] **Value caching**: Reuse immutable computation across rays
* [ ] **Bounding volume hierarchy (BVH)**: Accelerated spatial data structure for fewer ray-object checks
* [ ] **Subsampling**: Render every other pixel for quick previews
