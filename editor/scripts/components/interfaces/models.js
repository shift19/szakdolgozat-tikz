'use strict';

//======================================================================================================================

const EDIT_MODEL = {
    ENABLED: false,
    KEY_PRESSED: undefined,
    CURRENTLY_SELECTING: false,
    SELECTED_AREA: {
        STARTING_POINT: undefined,
        ENDING_POINT: undefined
    },
    SELECTED_ELEMENTS: [],
    COPIED: false,
    COPIED_ELEMENTS: [],
    POINT_MAPPING: []
};

//======================================================================================================================

const MOVE_MODEL = {
    ENABLED: false,
    DRAGGED_POINT: undefined,
    KEY_PRESSED: undefined,
    SELECTED_POINTS: [],
    POINT_MAPPING: []
};

//======================================================================================================================

const TOOLBAR_MODEL = {
    SELECTED_MODE: undefined,
    SELECTED_SHAPE: undefined
}

//======================================================================================================================

const ZOOM_MODEL = {
    VIEW: {
        x: 0,
        y: 0,
        zoom: 1
    },
    VIEW_POSITION: {
        prevX: null,
        prevY: null,
        isDragging: false
    }
}

//======================================================================================================================

const DRAW_MODEL = {
    CURRENTLY_DRAWING: false,
    STARTING_POINT: undefined,
    ENDING_POINT: undefined,
    CURRENTLY_DRAWN: undefined,
    LAST_DRAW: undefined,
    PREVIEW: undefined
};

//======================================================================================================================

export {
    EDIT_MODEL,
    MOVE_MODEL,
    TOOLBAR_MODEL,
    ZOOM_MODEL,
    DRAW_MODEL
}
