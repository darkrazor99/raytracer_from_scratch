import { MathUtils } from "../utils/math-utils.js";

export class Camera {

    constructor() {
        this.position = [0, 0, 0];
        this.viewportWidth = 1;
        this.viewportHeight = 1;
        this.viewportDistance = 1;
        this.yaw = 0;
        this.pitch = 0;
        this.movementSpeed = 0.1; 
    }

    setViewport(width, height, distance) {
        this.viewportWidth = width;
        this.viewportHeight = height;
        this.viewportDistance = distance;
    }
    getViewportWidth() {
        return this.viewportWidth;
    }
    getViewportHeight() {
        return this.viewportHeight;
    }
    getViewportDistance() {
        return this.viewportDistance;
    }

    getPosition() {
        return this.position;
    }

    setPosition(x, y, z) {
        this.position = [x, y, z];
    }

    moveBy(dx, dy, dz) {
        this.position[0] += dx;
        this.position[1] += dy;
        this.position[2] += dz; 
    }

    getYaw() {
        return this.yaw;
    }

    setYaw(yaw) {
        this.yaw = yaw;
    }

    getPitch() {
        return this.pitch;
    }
    
    setPitch(pitch) {
        this.pitch = pitch;
    }

    getRotationMatrix() {
        return MathUtils.multiply3x3Matrices(
        
            MathUtils.createYawMatrix(this.yaw),
            MathUtils.createPitchMatrix(this.pitch)
        );
    }
    
    getForwardVector() {
        const forward = [0, 0, 1];
        return MathUtils.rotateVector(forward, this.getRotationMatrix()); 
    }

    getRightVector() {
        const right = [1, 0, 0];
        return MathUtils.rotateVector(right, this.getRotationMatrix());
    }


}