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
            MathUtils.createPitchMatrix(this.pitch),
            MathUtils.createYawMatrix(this.yaw)
        );
    }
    
    getForwardVector() {
        const rot = this.getRotationMatrix();
        return [rot[2][0], rot[2][1], rot[2][2]]; 
    }

    getRightVector() {
        const rot = this.getRotationMatrix();
        return [rot[0][0], rot[0][1], rot[0][2]]; 
    }


}