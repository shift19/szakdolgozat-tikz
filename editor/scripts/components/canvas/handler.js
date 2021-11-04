'use strict';

/*
       CANVAS HANDLERS
 */

import {P5} from "../sketch.js";
import {DRAW_CONTROLS, DRAWABLE_SHAPES, EDIT_CONTROLS, MODES, MOVE_CONTROLS, TOOLBAR} from "../global.js";
import {enableDrawing, pushDrawing} from "../draw.js";
import {addPropertiesAccordions, fillSelectedElements, startSelectingArea} from "../edit.js";
import {fillSelectedPoints} from "../move.js";

// =====================================================================================================================

const cMousePressed = () => {

    if (P5.mouseButton === P5.RIGHT) return;

    // mouse handler for move
    if (TOOLBAR.SELECTED_MODE === MODES.MOVE && P5.mouseButton === P5.LEFT) {
        fillSelectedPoints();
    }

    if (TOOLBAR.SELECTED_MODE === MODES.DRAW) {

        if (P5.mouseButton === P5.LEFT) {
            enableDrawing();
        }
    }

    if (TOOLBAR.SELECTED_MODE === MODES.EDIT && P5.mouseButton === P5.LEFT) {
        startSelectingArea();
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

    MOVE_CONTROLS.DRAGGABLE = false;
    MOVE_CONTROLS.DRAGGED_POINT = undefined;

    if (EDIT_CONTROLS.CURRENTLY_SELECTING) {
        EDIT_CONTROLS.CURRENTLY_SELECTING = false;

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
