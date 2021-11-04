'use strict';

/*
        ZOOM CONTROLS
 */

import {P5} from "../sketch.js";
import {MODES, TOOLBAR, ZOOM_CONTROLS} from "../global.js";

// add zoom event listeners

class Controls {

    static mousePressed(e) {

        if (e.target.id !== P5.canvas.id)
            return;

        if (TOOLBAR.SELECTED_MODE === MODES.SELECT) {
            ZOOM_CONTROLS.VIEW_POSITION = {
                isDragging: true,
                prevX: e.clientX,
                prevY: e.clientY
            };

            if (e.which === 2) { // middle
                resetCanvasZoom();
            }
        }
    }

    static mouseDragged(e) {

        if (e.target.id !== P5.canvas.id)
            return;

        if (TOOLBAR.SELECTED_MODE === MODES.SELECT) {
            const {prevX, prevY, isDragging} = ZOOM_CONTROLS.VIEW_POSITION;
            if (!isDragging) return;

            const pos = {x: e.clientX, y: e.clientY};
            const dx = pos.x - prevX;
            const dy = pos.y - prevY;

            if (prevX || prevY) {
                ZOOM_CONTROLS.VIEW.x += dx;
                ZOOM_CONTROLS.VIEW.y += dy;
                ZOOM_CONTROLS.VIEW_POSITION.prevX = pos.x;
                ZOOM_CONTROLS.VIEW_POSITION.prevY = pos.y
            }
        }
    }

    static mouseReleased(e) {

        if (e.target.id !== P5.canvas.id)
            return;

        if (TOOLBAR.SELECTED_MODE === MODES.SELECT) {
            ZOOM_CONTROLS.VIEW_POSITION = {
                isDragging: false,
                prevX: null,
                prevY: null
            }
        }
    }

    static zoomCanvas(e) {

        if (e.target.id !== P5.canvas.id)
            return;


        if (TOOLBAR.SELECTED_MODE === MODES.SELECT) {
            const {x, y, deltaY} = e;
            const direction = deltaY > 0 ? -1 : 1;
            const zoom = 0.05 * direction;

            const wx = (x - ZOOM_CONTROLS.VIEW.x) / (P5.width * ZOOM_CONTROLS.VIEW.zoom);
            const wy = (y - ZOOM_CONTROLS.VIEW.y) / (P5.height * ZOOM_CONTROLS.VIEW.zoom);

            if (ZOOM_CONTROLS.VIEW.zoom + zoom < 0.5) return;

            ZOOM_CONTROLS.VIEW.x -= wx * P5.width * zoom;
            ZOOM_CONTROLS.VIEW.y -= wy * P5.height * zoom;
            ZOOM_CONTROLS.VIEW.zoom += zoom;
        }
    }
}

const resetCanvasZoom = () => {
    ZOOM_CONTROLS.VIEW = {x: P5.width / 2, y: P5.height / 2, zoom: 2}
    ZOOM_CONTROLS.VIEW_POSITION = {prevX: null, prevY: null, isDragging: false}
    P5.resetMatrix();
}

export {
    Controls
}
