import { MathUtils } from "../utils/math-utils.js";

export class CameraController { // first person
    constructor(camera, canvas) {
        this.camera = camera;
        this.canvas = canvas;

        this.mouseSensitivity = 0.002;
        this._isPointerLocked = false;

        this.keysPressed = new Set();

        this._onMouseMove = this._onMouseMove.bind(this);
        this._onKeyDown = this._onKeyDown.bind(this);
        this._onKeyUp = this._onKeyUp.bind(this);
        this._onPointerLockChange = this._onPointerLockChange.bind(this);
        this._requestPointerLock = this._requestPointerLock.bind(this);

    }

    _addEventListeners() {
        document.addEventListener('mousemove', this._onMouseMove);
        document.addEventListener('keydown', this._onKeyDown);
        document.addEventListener('keyup', this._onKeyUp);
        document.addEventListener('pointerlockchange', this._onPointerLockChange);

    }

    _removeEventListeners() {
        document.removeEventListener('mousemove', this._onMouseMove);
        document.removeEventListener('keydown', this._onKeyDown);
        document.removeEventListener('keyup', this._onKeyUp);
        document.removeEventListener('pointerlockchange', this._onPointerLockChange);
    }

    _requestPointerLock() {
        console.log("Canvas clicked: requesting pointer lock");
        if (!this._isPointerLocked) {
            this.canvas.requestPointerLock();
        }
    }

    _onPointerLockChange() {
        this._isPointerLocked = document.pointerLockElement === this.canvas;
    }

    _onKeyDown(e) {
        // if (e.key === 'Escape') {
        //     this._removeEventListeners();
        //     return;
        // }
        this.keysPressed.add(e.key.toLowerCase());
    }

    _onKeyUp(e) {
        this.keysPressed.delete(e.key.toLowerCase());
    }

    _onMouseMove(e) {
        if (!this._isPointerLocked) return;

        const { movementX, movementY } = e;
        const newYaw = this.camera.getYaw() + movementX * this.mouseSensitivity;;
        const newPitch = this.camera.getPitch() + movementY * this.mouseSensitivity;

        const maxPitch = Math.PI / 2 - 0.01; // Prevent flipping
        const newPitchClamped = Math.max(-maxPitch, Math.min(maxPitch, newPitch));
        this.camera.setYaw(newYaw);
        this.camera.setPitch(newPitchClamped);
        // console.log(`Mouse moved: Yaw=${this.camera.getYaw().toFixed(2)}, Pitch=${this.camera.getPitch().toFixed(2)}`);
    }

    update() {
        const forward = this.camera.getForwardVector();
        const right = this.camera.getRightVector();
        const speed = this.camera.movementSpeed;
        let dx = 0, dy = 0, dz = 0;

        if (this.keysPressed.has('w')) {
            dx += forward[0]; dy += forward[1]; dz += forward[2];
        }
        if (this.keysPressed.has('s')) {
            dx -= forward[0]; dy -= forward[1]; dz -= forward[2];
        }
        if (this.keysPressed.has('a')) {
            dx -= right[0]; dy -= right[1]; dz -= right[2];
        }
        if (this.keysPressed.has('d')) {
            dx += right[0]; dy += right[1]; dz += right[2];
        }
        const movementVec = MathUtils.normalize3([dx, dy, dz]);
        // console.log(`Movement vector: ${movementVec}`);
        console.log("Yaw:", this.camera.getYaw().toFixed(2),
            "Pitch:", this.camera.getPitch().toFixed(2),
            "Forward:", forward.map(n => n.toFixed(2)).join(', '));
        // console.log('right vector:', right);
        this.camera.moveBy(movementVec[0] * speed, movementVec[1] * speed, movementVec[2] * speed);
    }

    enable() {
        this._addEventListeners();

        this.canvas.addEventListener('click', this._requestPointerLock);
    }

    disable() {
        this._removeEventListeners();
        document.exitPointerLock();
        this.canvas.removeEventListener('click', this._requestPointerLock);
    }
}