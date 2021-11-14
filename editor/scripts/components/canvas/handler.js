'use strict';

import {P5} from "../sketch.js";
import {
    DRAW_CONTROLS,
    DRAWABLE_SHAPES,
    EDIT_CONTROLS,
    MODES,
    MOVE_CONTROLS,
    SHAPES_DATABASE,
    TOOLBAR,
    UNDOS
} from "../global.js";
import {enableDrawing, pushDrawing} from "../draw.js";
import {addPropertiesAccordions, fillSelectedElements, startSelectingArea} from "../edit.js";
import {fillSelectedPoints} from "../move.js";
import {addUndo, popUndo} from "../undo.js";

// =====================================================================================================================

let prevSD = null;

const cMousePressed = () => {

    if (P5.mouseButton === P5.RIGHT) return;

    // mouse handler for move
    if (P5.mouseButton === P5.LEFT) {

        if (TOOLBAR.SELECTED_MODE === MODES.DRAW) {
            enableDrawing();
        }

        if (TOOLBAR.SELECTED_MODE === MODES.EDIT) {
            startSelectingArea();
        }

        if (TOOLBAR.SELECTED_MODE === MODES.MOVE) {
            if (JSON.stringify(SHAPES_DATABASE) !== JSON.stringify(UNDOS[UNDOS.length - 1])) {
                addUndo();
                prevSD = JSON.stringify(SHAPES_DATABASE);
            }
            fillSelectedPoints();
        }
    }

    // prevent default
    return false;
}

// =====================================================================================================================

const cMouseReleased = () => {

    if (P5.mouseButton === P5.RIGHT) return;

    if (TOOLBAR.SELECTED_MODE === MODES.DRAW || TOOLBAR.SELECTED_SHAPE !== DRAWABLE_SHAPES.POINT) {

        if (P5.mouseButton === P5.LEFT) {
            DRAW_CONTROLS.LAST_DRAW = DRAW_CONTROLS.CURRENTLY_DRAWN;
            pushDrawing();
        }

        DRAW_CONTROLS.CURRENTLY_DRAWING = false;
        DRAW_CONTROLS.CURRENTLY_DRAWN = undefined;
    }

    if (MOVE_CONTROLS.DRAGGABLE) {
        if (JSON.stringify(SHAPES_DATABASE) === prevSD)
            popUndo();
    }

    MOVE_CONTROLS.DRAGGABLE = false;
    MOVE_CONTROLS.DRAGGED_POINT = undefined;

    if (EDIT_CONTROLS.CURRENTLY_SELECTING) {

        EDIT_CONTROLS.CURRENTLY_SELECTING = false;

        if (JSON.stringify(EDIT_CONTROLS.SELECTED_AREA.STARTING_POINT) === JSON.stringify(EDIT_CONTROLS.SELECTED_AREA.ENDING_POINT)) {
            return;
        }

        fillSelectedElements();

        let properties = $("#aProperties");
        if (EDIT_CONTROLS.SELECTED_ELEMENTS.length) {
            addPropertiesAccordions();
            properties.show("slow");
        } else {
            properties.hide("slow");
        }
    }
}

// =====================================================================================================================

const cMouseOut = (e) => {
    DRAW_CONTROLS.STARTING_POINT = undefined;
    DRAW_CONTROLS.CURRENTLY_DRAWING = false;
    DRAW_CONTROLS.CURRENTLY_DRAWN = undefined;
}

// =====================================================================================================================

export {
    cMousePressed,
    cMouseReleased,
    cMouseOut
}
