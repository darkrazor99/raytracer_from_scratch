export class ViewportUtils {

    static canvasToViewPort(x, y, canvasHeight , canvasWidth, h, w, d) {
        return [x * w / canvasWidth, y * h / canvasHeight, d];
    }

}