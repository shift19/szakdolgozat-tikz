"use strict";

import {COLORPICKERS, EDIT_CONTROLS, MAX_UNDO_SIZE, MOVE_CONTROLS, REDOS, SHAPES_DATABASE, UNDOS} from "./global.js";
import {parse2Class, parse2String} from "./load.js";
import {addPropertiesAccordions, editSetup} from "./edit.js";
import {moveSetup} from "./move.js";

//======================================================================================================================

let prevUndo = [];

const addUndo = () => {
    const currentState = JSONC.pack(parse2String());
    if (UNDOS.length === MAX_UNDO_SIZE) {
        UNDOS.splice(0, 1);
    }
    UNDOS.push(currentState); // deep copy
    REDOS.length = 0;
}

const processUndo = () => {
    if (UNDOS.length) {
        let current_undo = UNDOS.pop();
        prevUndo.push(current_undo);
        REDOS.push(JSONC.pack(parse2String()));
        parse2Class(JSONC.unpack(current_undo));
        refreshControls();
    }
}

//======================================================================================================================

const processRedo = () => {

    if (REDOS.length) {
        let current_redo = REDOS.pop();
        UNDOS.push(prevUndo.pop());
        parse2Class(JSONC.unpack(current_redo));
        refreshControls();
    }

}

//======================================================================================================================

const popUndo = () => {
    UNDOS.pop();
}

//======================================================================================================================

const refreshControls = () => {
    if (EDIT_CONTROLS.ENABLED) {
        EDIT_CONTROLS.POINT_MAPPING = [];
        editSetup();
        $("#aProperties").children().remove();
        COLORPICKERS.length = 2;

        if (SHAPES_DATABASE.length) {
            addPropertiesAccordions();
        }
    }

    if (MOVE_CONTROLS.ENABLED) {
        MOVE_CONTROLS.POINT_MAPPING = [];
        moveSetup();
    }
}

//======================================================================================================================

export {
    addUndo,
    processUndo,
    processRedo,
    popUndo
}
