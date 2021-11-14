'use strict';

import {P5} from "../sketch.js";
import {
    DRAW_CONTROLS,
    EDIT_CONTROLS,
    enablePreview,
    grid_density,
    MODES,
    MOVE_CONTROLS,
    SHAPES_DATABASE,
    TOOLBAR,
    ZOOM_CONTROLS
} from "../global.js";
import {cMouseOut, cMousePressed, cMouseReleased} from "./handler.js";
import {drawCurrentShape, drawPreview} from "../draw.js";
import {moveSelectedPoints} from "../move.js";
import {deleteSelectedElements, endSelectingArea, fillCopiedElements, pasteCopiedElements} from "../edit.js";
import {addUndo, processRedo, processUndo} from "../undo.js";

//======================================================================================================================

let canvas;

const setup = () => {
    let c = $("#canvas")
    let w = c.width();
    let h = c.height();

    canvas = P5.createCanvas(w, h);
    P5.frameRate(60);
    canvas.parent("canvas");

    canvas.mousePressed(cMousePressed)
    canvas.mouseReleased(cMouseReleased)
    canvas.mouseOut(e => cMouseOut(e));

    // show center of the grid
    ZOOM_CONTROLS.VIEW = {
        x: P5.width / 2,
        y: P5.height / 2,
        zoom: 2
    }
}

// =====================================================================================================================

const draw = () => {
    P5.background(255);

    P5.translate(ZOOM_CONTROLS.VIEW.x, ZOOM_CONTROLS.VIEW.y);
    P5.scale(ZOOM_CONTROLS.VIEW.zoom)

    drawHelpingGrid();

    P5.push();
    SHAPES_DATABASE.forEach(e => e.draw())
    P5.pop();

    if (TOOLBAR.SELECTED_MODE === MODES.DRAW) {
        if (enablePreview && !DRAW_CONTROLS.STARTING_POINT)
            drawPreview();

        drawCurrentShape();
    }

    if (MOVE_CONTROLS.ENABLED) {
        moveSelectedPoints();
    }

    if (EDIT_CONTROLS.ENABLED) {
        endSelectingArea();

    }
}

//======================================================================================================================

const windowResized = () => {
    let c = $("#canvas")
    let w = c.width();
    let h = c.height();
    P5.resizeCanvas(w, h);
}

// =====================================================================================================================

const keyPressed = () => {

    if (MOVE_CONTROLS.ENABLED) {
        MOVE_CONTROLS.KEY_PRESSED = P5.keyCode;
    }

    if (EDIT_CONTROLS.ENABLED) {
        EDIT_CONTROLS.KEY_PRESSED = P5.keyCode;

        if (EDIT_CONTROLS.SELECTED_ELEMENTS.length !== 0 && P5.keyIsDown(P5.CONTROL)) { // check if control is down

            if (EDIT_CONTROLS.KEY_PRESSED === 67) { // for key "c"
                EDIT_CONTROLS.COPIED = true;
                fillCopiedElements();
            }

            if (EDIT_CONTROLS.KEY_PRESSED === 86) { // for key "v"
                addUndo();
                pasteCopiedElements();
            }

            if (EDIT_CONTROLS.KEY_PRESSED === 88) { // for key "x"
                addUndo();
                deleteSelectedElements();
            }

        }

        if (EDIT_CONTROLS.SELECTED_ELEMENTS.length !== 0 && EDIT_CONTROLS.KEY_PRESSED === P5.DELETE) {
            addUndo();
            deleteSelectedElements();
        }
    }

    // undo-redo to work on all window
    if (P5.keyIsDown(P5.CONTROL)) {
        if (P5.keyCode === 90) { // for key "z"
            processUndo();
        }

        if (P5.keyCode === 89) { // for key "y"
            processRedo();
        }
    }

}

// =====================================================================================================================

const keyReleased = () => {

    if (MOVE_CONTROLS.ENABLED) {
        MOVE_CONTROLS.KEY_PRESSED = undefined;
    }

    if (EDIT_CONTROLS.ENABLED) {
        EDIT_CONTROLS.KEY_PRESSED = undefined;
    }

}

//======================================================================================================================

//        BG GRID
const drawHelpingGrid = () => {
    P5.push();

    P5.stroke(128);
    P5.strokeWeight(0.2);
    let x = Math.floor(P5.width / grid_density);
    let y = Math.floor(P5.height / grid_density);

    // vertical lines
    for (let xi = 0; xi <= x; xi += 1) {
        P5.line(xi * grid_density, P5.height, xi * grid_density, -P5.height)
        P5.line(-xi * grid_density, P5.height, -xi * grid_density, -P5.height)
    }
    // horizontal lines
    for (let yi = 0; yi <= y; yi += 1) {
        P5.line(P5.width, yi * grid_density, -P5.width, yi * grid_density);
        P5.line(P5.width, -yi * grid_density, -P5.width, -yi * grid_density);
    }
    P5.pop();
}

export {
    setup,
    draw,
    windowResized,
    keyPressed,
    keyReleased
}
