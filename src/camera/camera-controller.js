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

        this._addEventListeners();


    }

    _addEventListeners() {
        document.addEventListener('mousemove', this._onMouseMove);
        document.addEventListener('keydown', this._onKeyDown);
        document.addEventListener('keyup', this._onKeyUp);
        document.addEventListener('pointerlockchange', this._onPointerLockChange);

        this.canvas.addEventListener('click', this._requestPointerLock);
    }

    _removeEventListeners() {
        document.removeEventListener('mousemove', this._onMouseMove);
        document.removeEventListener('keydown', this._onKeyDown);
        document.removeEventListener('keyup', this._onKeyUp);
        document.removeEventListener('pointerlockchange', this._onPointerLockChange);
        this.canvas.removeEventListener('click', this._requestPointerLock);
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
        if (e.key === 'Escape') {
            this._removeEventListeners();
            document.exitPointerLock();
            return;
        }
        this.keysPressed.add(e.key.toLowerCase());
    }

    _onKeyUp(e) {
        this.keysPressed.delete(e.key.toLowerCase());
    }

    _onMouseMove(e) {
        if (!this._isPointerLocked) return;

        const { movementX, movementY } = e;
        const newYaw = this.camera.getYaw() + movementX * this.mouseSensitivity;;
        const newPitch = this.camera.getPitch() - movementY * this.mouseSensitivity;

        const maxPitch = Math.PI / 2 - 0.01; // Prevent flipping
        const newPitchClamped = Math.max(-maxPitch, Math.min(maxPitch, newPitch));
        this.camera.setYaw(newYaw);
        this.camera.setPitch(newPitchClamped);
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

        this.camera.moveBy(dx * speed, dy * speed, dz * speed);
    }

}