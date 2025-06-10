export class ViewportUtils {

    static canvasToViewPort(x, y, canvas, viewportSize, d) {
        return [x * viewportSize.width / canvas.width, y * viewportSize.height / canvas.height, d];
    }

}