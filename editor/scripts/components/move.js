'use strict';

/*
        MOVE mode functions
 */

import {COLOR, LINE_DASH, MOVE_CONTROLS, SHAPES_DATABASE} from "./global.js";
import {P5} from "./sketch.js";
import {calcRPos, normalize} from "./misc.js";
import {Point} from "./shapes/Point.js";
import {Bezier} from "./shapes/Bezier.js";
import {Text} from "./shapes/Text.js";
import {LMath} from "./shapes/LMath.js";

const moveSetup = () => {

    MOVE_CONTROLS.ENABLED = true;

    SHAPES_DATABASE.forEach((shape, index) => {
        if (shape instanceof Point
            || shape instanceof Text
            || shape instanceof LMath) {
            MOVE_CONTROLS.POINT_MAPPING.push({
                index,
                start: {
                    x: shape.x,
                    y: shape.y
                }
            });
        } else {
            if (shape instanceof Bezier) {
                MOVE_CONTROLS.POINT_MAPPING.push({
                    index,
                    start: {
                        x: shape.dimension.start.x,
                        y: shape.dimension.start.y
                    },
                    end: {
                        x: shape.dimension.end.x,
                        y: shape.dimension.end.y
                    },

                    p1: {
                        x: shape.controls.p1.x,
                        y: shape.controls.p1.y
                    },
                    p2: {
                        x: shape.controls.p2.x,
                        y: shape.controls.p2.y
                    }
                });
            } else {
                MOVE_CONTROLS.POINT_MAPPING.push({
                    index,
                    start: {
                        x: shape.dimension.start.x,
                        y: shape.dimension.start.y
                    },
                    end: {
                        x: shape.dimension.end.x,
                        y: shape.dimension.end.y
                    }
                });
            }
        }
    });
}

const moveSelectedPoints = () => {
    if (MOVE_CONTROLS.DRAGGABLE && P5.mouseIsPressed) {

        const POINT_DIAMETER = 10
        const MOUSE_POSITION = normalize(calcRPos());

        if (!MOVE_CONTROLS.DRAGGED_POINT) {
            MOVE_CONTROLS.POINT_MAPPING.forEach(points => {
                Object.keys(points).forEach((point) => {
                    if (point !== 'index') {
                        if (Math.abs(points[point].x - MOUSE_POSITION.x) < POINT_DIAMETER / 2 &&
                            Math.abs(points[point].y - MOUSE_POSITION.y) < POINT_DIAMETER / 2) {

                            MOVE_CONTROLS.DRAGGED_POINT = points[point];

                        }
                    }
                })
            });
        }

        const DELTA = {
            x: MOUSE_POSITION.x - MOVE_CONTROLS.DRAGGED_POINT.x,
            y: MOUSE_POSITION.y - MOVE_CONTROLS.DRAGGED_POINT.y
        };


        MOVE_CONTROLS.SELECTED_POINTS.forEach(selected_point => {

            const CONTROL_POINTS = ['p1', 'p2'];

            if (CONTROL_POINTS.includes(selected_point.which)) {
                SHAPES_DATABASE[selected_point.index]['controls'][selected_point.which].x += DELTA.x;
                SHAPES_DATABASE[selected_point.index]['controls'][selected_point.which].y += DELTA.y;
            } else if (SHAPES_DATABASE[selected_point.index] instanceof Point
                || SHAPES_DATABASE[selected_point.index] instanceof Text
                || SHAPES_DATABASE[selected_point.index] instanceof LMath) {
                SHAPES_DATABASE[selected_point.index].x += DELTA.x;
                SHAPES_DATABASE[selected_point.index].y += DELTA.y;
            } else {
                SHAPES_DATABASE[selected_point.index]['dimension'][selected_point.which].x += DELTA.x;
                SHAPES_DATABASE[selected_point.index]['dimension'][selected_point.which].y += DELTA.y;
            }

            MOVE_CONTROLS.POINT_MAPPING[selected_point.index][selected_point.which].x += DELTA.x;
            MOVE_CONTROLS.POINT_MAPPING[selected_point.index][selected_point.which].y += DELTA.y;

        });
    }

    drawBezierGuideLines();
    drawCircles();
}

const drawCircles = () => {
    const POINT_DIAMETER = 10
    P5.push();
    MOVE_CONTROLS.POINT_MAPPING.forEach((points, i) => {
            Object.keys(points).forEach((point) => {
                P5.fill(0, 255, 0);
                if (point !== 'index') {
                    MOVE_CONTROLS.SELECTED_POINTS.forEach(selected_point => {
                        if (selected_point?.index === i && selected_point?.which === point) {
                            P5.fill(255, 0, 0);
                        }
                    });
                }
                P5.circle(points[point].x, points[point].y, POINT_DIAMETER);
            });
        }
    );
    P5.pop();
}

const drawBezierGuideLines = () => {
    P5.push();
    SHAPES_DATABASE.filter(shape => (shape instanceof Bezier)).forEach(bezier => {
        P5.stroke(COLOR.LIGHTGRAY);
        P5.drawingContext.setLineDash(LINE_DASH.DASHED);
        P5.line(bezier.dimension.start.x, bezier.dimension.start.y, bezier.controls.p1.x, bezier.controls.p1.y);
        P5.line(bezier.dimension.end.x, bezier.dimension.end.y, bezier.controls.p2.x, bezier.controls.p2.y);
    });
    P5.pop();
}

const fillSelectedPoints = () => {
    const MOUSE_POSITION = calcRPos();
    const POINT_DIAMETER = 10
    const PREV_SELECTED_POINTS = MOVE_CONTROLS.SELECTED_POINTS;

    MOVE_CONTROLS.POINT_MAPPING.forEach(points => {
        Object.keys(points).forEach((point) => {
            if (point !== 'index') {
                if (Math.abs(points[point].x - MOUSE_POSITION.x) < POINT_DIAMETER / 2 &&
                    Math.abs(points[point].y - MOUSE_POSITION.y) < POINT_DIAMETER / 2) {

                    if (MOVE_CONTROLS.KEY_PRESSED !== P5.CONTROL)
                        MOVE_CONTROLS.SELECTED_POINTS.length = 0;

                    const SELECTED_POINT_EXISTS = MOVE_CONTROLS.SELECTED_POINTS.filter(sp => sp.index === points['index'] && sp.which === point)

                    if (!SELECTED_POINT_EXISTS.length) {
                        MOVE_CONTROLS.SELECTED_POINTS.push({index: points['index'], which: point});
                    }
                }
            }
        })
    });

    if (!!MOVE_CONTROLS.SELECTED_POINTS && JSON.stringify(PREV_SELECTED_POINTS) === JSON.stringify(MOVE_CONTROLS.SELECTED_POINTS)) {
        MOVE_CONTROLS.SELECTED_POINTS.forEach(selected_point => {
            const INDEX = selected_point.index;
            const WHICH = selected_point.which;

            const POINT = MOVE_CONTROLS.POINT_MAPPING.filter(point => point.index === INDEX)[0][WHICH];

            if (Math.abs(POINT.x - MOUSE_POSITION.x) < POINT_DIAMETER / 2 &&
                Math.abs(POINT.y - MOUSE_POSITION.y) < POINT_DIAMETER / 2) {
                MOVE_CONTROLS.DRAGGABLE = true;
            }
        });
    }
}

export {
    moveSetup,
    fillSelectedPoints,
    moveSelectedPoints
}
