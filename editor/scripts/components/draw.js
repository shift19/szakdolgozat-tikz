'use strict';

/*
        DRAW mode functions
*/
import {DRAW_CONTROLS, DRAWABLE_SHAPES, SHAPES_DATABASE, TOOLBAR} from "./global.js";
import {calcRPos, getDefaultProperties, normalize} from "./misc.js";
import {P5} from "./sketch.js";
import {Rectangle} from "./shapes/Rectangle.js";
import {Line} from "./shapes/Line.js";
import {Ellipse} from "./shapes/Ellipse.js";
import {Bezier} from "./shapes/Bezier.js";
import {Grid} from "./shapes/Grid.js";
import {Arc} from "./shapes/Arc.js";
import {Parabola} from "./shapes/Parabola.js";
import {Point} from "./shapes/Point.js";
import {Text} from "./shapes/Text.js";
import {LMath} from "./shapes/LMath.js";


const drawCurrentShape = () => {

    if (P5.mouseIsPressed && P5.mouseButton === P5.LEFT && DRAW_CONTROLS.CURRENTLY_DRAWING) {

        const PROPERTIES = getDefaultProperties();

        switch (TOOLBAR.SELECTED_SHAPE) {
            case DRAWABLE_SHAPES.LINE:
                DRAW_CONTROLS.CURRENTLY_DRAWN = new Line(DRAW_CONTROLS.STARTING_POINT, normalize(calcRPos()), PROPERTIES);
                break;
            case DRAWABLE_SHAPES.ELLIPSE:
                DRAW_CONTROLS.CURRENTLY_DRAWN = new Ellipse(DRAW_CONTROLS.STARTING_POINT, normalize(calcRPos()), PROPERTIES);
                break;
            case DRAWABLE_SHAPES.RECTANGLE:
                DRAW_CONTROLS.CURRENTLY_DRAWN = new Rectangle(DRAW_CONTROLS.STARTING_POINT, normalize(calcRPos()), PROPERTIES);
                break;
            case DRAWABLE_SHAPES.BEZIER:
                DRAW_CONTROLS.CURRENTLY_DRAWN = new Bezier(DRAW_CONTROLS.STARTING_POINT, normalize(calcRPos()), PROPERTIES);
                break;
            case DRAWABLE_SHAPES.GRID:
                DRAW_CONTROLS.CURRENTLY_DRAWN = new Grid(DRAW_CONTROLS.STARTING_POINT, normalize(calcRPos()), PROPERTIES);
                break;
            case DRAWABLE_SHAPES.ARC:
                DRAW_CONTROLS.CURRENTLY_DRAWN = new Arc(DRAW_CONTROLS.STARTING_POINT, normalize(calcRPos()), PROPERTIES);
                break;
            case DRAWABLE_SHAPES.PARABOLA:
                DRAW_CONTROLS.CURRENTLY_DRAWN = new Parabola(DRAW_CONTROLS.STARTING_POINT, normalize(calcRPos()), PROPERTIES);
                break;
        }
    }

    if (DRAW_CONTROLS.CURRENTLY_DRAWN) {
        DRAW_CONTROLS.CURRENTLY_DRAWN.draw();
    }
}

// =====================================================================================================================

const enableDrawing = () => {
    DRAW_CONTROLS.STARTING_POINT = normalize(calcRPos());
    const PROPERTIES = getDefaultProperties();
    if (TOOLBAR.SELECTED_SHAPE === DRAWABLE_SHAPES.POINT) {
        SHAPES_DATABASE.push(new Point(DRAW_CONTROLS.STARTING_POINT.x, DRAW_CONTROLS.STARTING_POINT.y, PROPERTIES))
        DRAW_CONTROLS.STARTING_POINT = undefined;
    } else if (TOOLBAR.SELECTED_SHAPE === DRAWABLE_SHAPES.TEXT) {
        if (PROPERTIES.text.length) {
            SHAPES_DATABASE.push(new Text(DRAW_CONTROLS.STARTING_POINT.x, DRAW_CONTROLS.STARTING_POINT.y, PROPERTIES))
            DRAW_CONTROLS.STARTING_POINT = undefined;
        }
    } else if (TOOLBAR.SELECTED_SHAPE === DRAWABLE_SHAPES.MATH) {
        if (PROPERTIES.latex.length) {
            SHAPES_DATABASE.push(new LMath(DRAW_CONTROLS.STARTING_POINT.x, DRAW_CONTROLS.STARTING_POINT.y, PROPERTIES))
            DRAW_CONTROLS.STARTING_POINT = undefined;
        }
    } else {
        DRAW_CONTROLS.CURRENTLY_DRAWING = true;
    }
}

// =====================================================================================================================

const pushDrawing = () => {

    DRAW_CONTROLS.ENDING_POINT = normalize(calcRPos());

    if (DRAW_CONTROLS.STARTING_POINT) {
        // check for just clicking instead of click n drag
        if (DRAW_CONTROLS.STARTING_POINT.x === DRAW_CONTROLS.ENDING_POINT.x && DRAW_CONTROLS.STARTING_POINT.y === DRAW_CONTROLS.ENDING_POINT.y) return;

        //check if not undefined
        if (DRAW_CONTROLS.LAST_DRAW) {
            DRAW_CONTROLS.STARTING_POINT = undefined;
            SHAPES_DATABASE.push(DRAW_CONTROLS.LAST_DRAW)
        }
    }
}

// =====================================================================================================================

const drawPreview = () => {

    const PROPERTIES = getDefaultProperties();
    const MOUSE_POSITION = normalize(calcRPos());

    switch (TOOLBAR.SELECTED_SHAPE) {
        case DRAWABLE_SHAPES.TEXT:
            DRAW_CONTROLS.PREVIEW = new Text(MOUSE_POSITION.x, MOUSE_POSITION.y, PROPERTIES)
            break;
        case DRAWABLE_SHAPES.MATH:
            DRAW_CONTROLS.PREVIEW = new LMath(MOUSE_POSITION.x, MOUSE_POSITION.y, PROPERTIES)
            break;
        default:
            DRAW_CONTROLS.PREVIEW = new Point(MOUSE_POSITION.x, MOUSE_POSITION.y, PROPERTIES)
    }

    if (DRAW_CONTROLS.PREVIEW)
        DRAW_CONTROLS.PREVIEW.draw();

}

export {
    enableDrawing,
    drawCurrentShape,
    pushDrawing,
    drawPreview
}
