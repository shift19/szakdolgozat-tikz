'use strict';

import {DRAW_MODEL, EDIT_MODEL, MOVE_MODEL, TOOLBAR_MODEL, ZOOM_MODEL} from "./interfaces/models.js";

//======================================================================================================================

// set grid density (higher is less dense)
let grid_density = 50;

//======================================================================================================================

//  bool to snap to grid (true: snap, false: no)
let isNormalize = true;
const setNormalize = n => {
    isNormalize = n
}

//======================================================================================================================

// bool for preview
let enablePreview = false;
const setPreview = p => {
    enablePreview = p
}

// =====================================================================================================================

// store all shapes to draw to canvas
let SHAPES_DATABASE = [];
const setShapes = sd => {
    SHAPES_DATABASE = sd;
}

//store all color pickers
const COLORPICKERS = [];

// =====================================================================================================================

// toolbar
let TOOLBAR = {
    ...TOOLBAR_MODEL
}
const setToolbar = tb => {
    MOVE_CONTROLS = tb;
}

// zoom controls
let ZOOM_CONTROLS = {
    ...ZOOM_MODEL
}
const setZoomControl = zc => {
    MOVE_CONTROLS = zc;
}

// shape drawing controls
let DRAW_CONTROLS = {
    ...DRAW_MODEL
}
const setDrawControl = dc => {
    MOVE_CONTROLS = dc;
}

// point movement controls
let MOVE_CONTROLS = {
    ...MOVE_MODEL
};
const setMoveControl = mc => {
    MOVE_CONTROLS = mc;
}

// shape edit controls
let EDIT_CONTROLS = {
    ...EDIT_MODEL
};
const setEditControl = ec => {
    MOVE_CONTROLS = ec;
}
// =====================================================================================================================

// max undo size
const MAX_UNDO_SIZE = 20;

// to store undos
let UNDOS = [];
const setUndo = u => {
    UNDOS = u;
}

// to store redos
let REDOS = [];
const setRedo = r => {
    REDOS = r;
}

// =====================================================================================================================

// to store predefined colors
const COLOR = {
    NONE: "#E9ECEF", // for no stroke or fill color
    WHITE: "#FFFFFF",
    LIGHTGRAY: "#BFBFBF",
    GRAY: "#808080",
    DARKGRAY: "#404040",
    BLACK: "#000000",
    RED: "#FF0000",
    VIOLET: "#800080",
    PURPLE: "#BF0040",
    MAGENTA: "#FF00FF",
    PINK: "#FFBFBF",
    GREEN: "#00FF00",
    LIME: "#BFFF00",
    OLIVE: "#808000",
    BROWN: "#BF8040",
    ORANGE: "#FF8000",
    YELLOW: "#FFFF00",
    BLUE: "#0000FF",
    CYAN: "#00FFFF",
    TEAL: "#008080"
}

// =====================================================================================================================

const MODES = {
    SELECT: "select",   // to move canvas
    DRAW: "draw",       // to draw shapes
    EDIT: "edit",       // to edit shapes
    MOVE: "move"        // to move shapes
}

const DRAWABLE_SHAPES = {
    POINT: "point",
    LINE: "line",
    ELLIPSE: "ellipse",
    RECTANGLE: "rectangle",
    BEZIER: "bezier",
    GRID: "grid",
    ARC: "arc",
    PARABOLA: "parabola",
    TEXT: "text",
    MATH: "math"
}

// =====================================================================================================================

const LINE_WIDTH = {
    ULTRA_THIN: 0.2,
    VERY_THIN: 0.3,
    THIN: 0.4,
    SEMITHICK: 0.5,
    THICK: 0.7,
    VERY_THICK: 0.8,
    ULTRA_THICK: 1
}

const LINE_DASH = {
    SOLID: [],
    DOTTED: [1, 2],
    DENSELY_DOTTED: [1, 1],
    LOOSELY_DOTTED: [1, 4],
    DASHED: [3, 3],
    DENSELY_DASHED: [3, 2],
    LOOSELY_DASHED: [3, 6],
    DASHDOTTED: [3, 2, 0.5, 2],
    DENSELY_DASHDOTTED: [3, 1, 0.5, 1],
    LOOSELY_DASHDOTTED: [3, 4, 0.5, 4]
}

const ARROW = {
    NONE: "-",
    HEAD: "->",
    TAIL: "<-",
    BOTH: "<->"
}

const ARROW_TIPS = {
    STEALTH: "stealth",
    STEALTH_RESERVED: "stealth reversed",
    STEALTH_OPEN: "{Stealth[open]}",                    // arrows.meta
    TO: "to",
    TO_RESERVED: "to reversed",
    LATEX: "latex",
    LATEX_RESERVED: "latex reserved",
    LATEX_OPEN: "{LMath[open]}",                        // arrows.meta
    VERTICAL: "|"
}

// =====================================================================================================================

export {
    MODES,
    DRAWABLE_SHAPES,
    COLOR,
    TOOLBAR,
    setToolbar,
    ZOOM_CONTROLS,
    setZoomControl,
    DRAW_CONTROLS,
    setDrawControl,
    MOVE_CONTROLS,
    setMoveControl,
    EDIT_CONTROLS,
    setEditControl,
    LINE_WIDTH,
    LINE_DASH,
    ARROW,
    ARROW_TIPS,
    SHAPES_DATABASE,
    setShapes,
    COLORPICKERS,
    grid_density,
    isNormalize,
    setNormalize,
    enablePreview,
    setPreview,
    MAX_UNDO_SIZE,
    UNDOS,
    setUndo,
    REDOS,
    setRedo
}
