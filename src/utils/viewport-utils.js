export class ViewportUtils {

    static canvasToViewPort(x, y, canvas, h, w, d) {
        return [x * w / canvas.width, y * h / canvas.height, d];
    }

}