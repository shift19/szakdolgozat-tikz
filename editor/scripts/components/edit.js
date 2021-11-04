'use strict';

/*
        EDIT mode functions
 */

import {
    ARROW,
    ARROW_TIPS,
    COLOR,
    COLORPICKERS,
    DRAWABLE_SHAPES,
    EDIT_CONTROLS,
    grid_density,
    LINE_DASH,
    LINE_WIDTH,
    SHAPES_DATABASE
} from "./global.js";
import {P5} from "./sketch.js";
import {calcRPos, capitalize, getKey, isBetween, loadOptions} from "./misc.js";
import {ColorPicker, refreshColorPickerHandlers} from "./utility/ColorPicker.js";
import {Rectangle} from "./shapes/Rectangle.js";
import {Line} from "./shapes/Line.js";
import {Ellipse} from "./shapes/Ellipse.js";
import {Bezier} from "./shapes/Bezier.js";
import {Grid} from "./shapes/Grid.js";
import {Arc} from "./shapes/Arc.js";
import {Point} from "./shapes/Point.js";
import {Parabola} from "./shapes/Parabola.js";
import {LMath} from "./shapes/LMath.js";
import {Text} from "./shapes/Text.js";

const editSetup = () => {

    EDIT_CONTROLS.ENABLED = true;

    SHAPES_DATABASE.forEach((shape, index) => {
            if (shape instanceof Point
                || shape instanceof Text
                || shape instanceof LMath) {
                EDIT_CONTROLS.POINT_MAPPING.push({
                    index,
                    start: {
                        x: shape.x,
                        y: shape.y
                    }
                });
            } else {
                EDIT_CONTROLS.POINT_MAPPING.push({
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
    );
}

// =====================================================================================================================

const startSelectingArea = () => {
    EDIT_CONTROLS.CURRENTLY_SELECTING = true;
    EDIT_CONTROLS.SELECTED_ELEMENTS = [];
    EDIT_CONTROLS.SELECTED_AREA.STARTING_POINT = calcRPos();
}

// =====================================================================================================================

const endSelectingArea = () => {

    if (P5.mouseIsPressed && P5.mouseButton === P5.LEFT && EDIT_CONTROLS.CURRENTLY_SELECTING) {
        let rectangle;

        EDIT_CONTROLS.SELECTED_AREA.ENDING_POINT = calcRPos();

        let gray = P5.color(211, 211, 211);
        gray.setAlpha(128)

        const PROPERTIES = {
            stroke: COLOR.LIGHTGRAY,
            fill: gray,
            linedash: LINE_DASH.SOLID,
            linewidth: LINE_WIDTH.THIN
        };
        rectangle = new Rectangle(EDIT_CONTROLS.SELECTED_AREA.STARTING_POINT, EDIT_CONTROLS.SELECTED_AREA.ENDING_POINT, PROPERTIES);

        if (!!rectangle) {
            rectangle.draw();
        }
    }

}

// =====================================================================================================================

const fillSelectedElements = () => {

    EDIT_CONTROLS.POINT_MAPPING.forEach(points => {
        Object.keys(points).forEach((point) => {
            if (point !== 'index') {

                if (isBetween(points[point].x, Math.min(EDIT_CONTROLS.SELECTED_AREA.STARTING_POINT.x, EDIT_CONTROLS.SELECTED_AREA.ENDING_POINT.x),
                    Math.max(EDIT_CONTROLS.SELECTED_AREA.STARTING_POINT.x, EDIT_CONTROLS.SELECTED_AREA.ENDING_POINT.x), true)) {
                    if (isBetween(points[point].y, Math.min(EDIT_CONTROLS.SELECTED_AREA.STARTING_POINT.y, EDIT_CONTROLS.SELECTED_AREA.ENDING_POINT.y),
                        Math.max(EDIT_CONTROLS.SELECTED_AREA.STARTING_POINT.y, EDIT_CONTROLS.SELECTED_AREA.ENDING_POINT.y), true)) {

                        const SELECTED_ELEMENT_EXISTS = EDIT_CONTROLS.SELECTED_ELEMENTS.filter(sp => sp.index === points['index'])

                        if (!SELECTED_ELEMENT_EXISTS.length) {
                            EDIT_CONTROLS.SELECTED_ELEMENTS.push({index: points['index']});
                        }
                    }
                }
            }
        });
    });
}

// =====================================================================================================================

const addPropertiesAccordions = () => {

    //$("#aProperties").children().not(':first').remove();
    //COLORPICKERS.length = 4;
    $("#aProperties").children().remove();
    COLORPICKERS.length = 2;

    EDIT_CONTROLS.SELECTED_ELEMENTS.forEach(element => {
        let accordion = $(
            `<div class="accordion-item">
                <h2 class="accordion-header" id="head_${element.index}">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        data-bs-target="#content_${element.index}" aria-expanded="false"
                        aria-controls="content_${element.index}">
                            ${SHAPES_DATABASE[element.index].constructor.name}
                    </button>
                </h2>
                <div id="content_${element.index}" class="accordion-collapse collapse"
                         aria-labelledby="head_${element.index}" data-bs-parent="#aProperties">
                    </div>
                </div>`
        );

        $('#aProperties').append(accordion);

        // add corresponding accordion elements
        let content = $(`#content_${element.index}`);
        if (!!SHAPES_DATABASE[element.index].stroke) {
            let stroke = `<div id="stroke_container_${element.index}" class="form-floating">
                            <input class="form-control color-input property-element" id="stroke_${element.index}" readOnly type="text"
                                value="${capitalize(getKey(COLOR, SHAPES_DATABASE[element.index].stroke))}">
                            <label for="Stroke_${element.index}">Stroke color:</label>
                          </div>`

            content.append(stroke)
            COLORPICKERS.push(new ColorPicker(`stroke_${element.index}`))
        }

        if (!!SHAPES_DATABASE[element.index].fill) {
            let fill = `<div id="fill_container_${element.index}" class="form-floating">
                            <input class="form-control color-input property-element" id="fill_${element.index}" readOnly type="text"
                                value="${capitalize(getKey(COLOR, SHAPES_DATABASE[element.index].fill))}">
                            <label for="fill_${element.index}">Fill color:</label>
                        </div>`

            content.append(fill)
            COLORPICKERS.push(new ColorPicker(`fill_${element.index}`))
        }

        if (!!SHAPES_DATABASE[element.index].linewidth) {
            let linewidth = `<div id="linewidth_container_${element.index}" class="form-floating">
                                <select class="form-select property-element" id="linewidth_${element.index}"></select>
                                <label for="linewidth_${element.index}">Line width:</label>
                            </div>`

            content.append(linewidth)
            loadOptions($(`#linewidth_${element.index}`), LINE_WIDTH, getKey(LINE_WIDTH, SHAPES_DATABASE[element.index].linewidth).toUpperCase());
        }

        if (!!SHAPES_DATABASE[element.index].linedash) {
            let linedash = `<div id="linedash_container_${element.index}" class="form-floating">
                                <select class="form-select property-element" id="linedash_${element.index}"></select>
                                <label for="linedash_${element.index}">Line dash style:</label>
                            </div>`

            content.append(linedash)
            loadOptions($(`#linedash_${element.index}`), LINE_DASH, getKey(LINE_DASH, SHAPES_DATABASE[element.index].linedash).toUpperCase());
        }

        if (!!SHAPES_DATABASE[element.index].arrow) {
            let arrow = `<div id="arrow_container_${element.index}" class="form-floating">
                                <select class="form-select property-element" id="arrow_${element.index}"></select>
                                <label for="arrow_${element.index}">Arrows appear on:</label>
                            </div>`

            content.append(arrow)
            loadOptions($(`#arrow_${element.index}`), ARROW, getKey(ARROW, SHAPES_DATABASE[element.index].arrow).toUpperCase());
        }

        if (!!SHAPES_DATABASE[element.index].tips) {
            let tips = `<div id="tips_head_container_${element.index}" class="form-floating">
                                 <select class="form-select property-element" id="tips-head_${element.index}"></select>
                                 <label for="tips_head_${element.index}"">Head style:</label>
                          </div>
                          <div id="tips_tail_container_${element.index}" class="form-floating">
                                 <select class="form-select property-element" id="tips-tail_${element.index}"></select>
                                 <label for="tips_tail_${element.index}"">Tail style:</label>
                            </div>`

            content.append(tips)
            loadOptions($(`#tips-head_${element.index}`), ARROW_TIPS, getKey(ARROW_TIPS, SHAPES_DATABASE[element.index].tips.head).toUpperCase());
            loadOptions($(`#tips-tail_${element.index}`), ARROW_TIPS, getKey(ARROW_TIPS, SHAPES_DATABASE[element.index].tips.tail).toUpperCase());
        }

        if (!!SHAPES_DATABASE[element.index].angles) {
            let angles = `<div id="angles_start_container_${element.index}" class="form-floating">
                                <input class="form-control property-element" id="angles-start_${element.index}" type="number" value="${SHAPES_DATABASE[element.index].angles.start}">
                                <label for="angle_head_${element.index}"">Starting angle of arc:</label>
                          </div>
                          <div id="angles_tail_container_${element.index}" class="form-floating">
                                <input class="form-control property-element" id="angles-end_${element.index}" type="number" value="${SHAPES_DATABASE[element.index].angles.end}">
                                <label for="angle_tail_${element.index}"">Ending angle of arc:</label>
                            </div>`

            content.append(angles)
        }

        if (!!SHAPES_DATABASE[element.index].text) {
            let text = `<div id="text_container_${element.index}" class="form-floating">
                                <textarea class="form-control property-element" id="text_${element.index}" rows="3" style="height:100%">${SHAPES_DATABASE[element.index].text}</textarea> 
                                <label for="arrow_${element.index}">Text:</label>
                            </div>`

            content.append(text)
        }

        if (!!SHAPES_DATABASE[element.index].latex) {
            let latex = `<div id="latex_container_${element.index}" class="form-floating">
                                <textarea class="form-control property-element" id="latex_${element.index}" rows="3" style="height:100%">${SHAPES_DATABASE[element.index].latex}</textarea> 
                                <label for="arrow_${element.index}">Text:</label>
                            </div>`

            content.append(latex)
        }

        refreshColorPickerHandlers();
        refreshPropertyElementHandler();
    });
}
// =====================================================================================================================

const refreshPropertyElementHandler = () => {
    $(".property-element").off('change').on('change', e => {
            let id_split = e.target.id.split("_")
            let {target, id, value} = {target: id_split[0], id: id_split[1], value: e.target.value}

            let target_split = target.split("-")
            if (target_split.length === 2) {
                let {target, subtarget} = {target: target_split[0], subtarget: target_split[1]}
                switch (target) {
                    case "tips":
                        SHAPES_DATABASE[id][target][subtarget] = ARROW_TIPS[value]
                        break;
                    case "angles":
                        SHAPES_DATABASE[id][target][subtarget] = value;
                        break;
                }
            } else {
                switch (target) {
                    case "linewidth":
                        SHAPES_DATABASE[id][target] = LINE_WIDTH[value]
                        break;
                    case "linedash":
                        SHAPES_DATABASE[id][target] = LINE_DASH[value]
                        break;
                        case "arrow":
                        SHAPES_DATABASE[id][target] = ARROW[value]
                        break;
                        case "text":
                        case "latex":
                        SHAPES_DATABASE[id][target] = value
                        break;
                }
            }
        }
    );
}

// =====================================================================================================================

const fillCopiedElements = () => {
    EDIT_CONTROLS.SELECTED_ELEMENTS.forEach(element => {
        EDIT_CONTROLS.COPIED_ELEMENTS.push({
            index: element.index,
            type: SHAPES_DATABASE[element.index].constructor.name,
            content: SHAPES_DATABASE[element.index]
        });
    });
}

// =====================================================================================================================

const pasteCopiedElements = () => {
    if (!EDIT_CONTROLS.COPIED) return;
    let elements = [];

    EDIT_CONTROLS.COPIED_ELEMENTS.forEach(element => {
        switch (element.type.toLowerCase()) {
            case DRAWABLE_SHAPES.POINT:
                elements.push(Point.fromJSON(element.content));
                break;
            case DRAWABLE_SHAPES.LINE:
                elements.push(Line.fromJSON(element.content));
                break;
            case DRAWABLE_SHAPES.ELLIPSE:
                elements.push(Ellipse.fromJSON(element.content));
                break;
            case DRAWABLE_SHAPES.RECTANGLE:
                elements.push(Rectangle.fromJSON(element.content));
                break;
            case DRAWABLE_SHAPES.BEZIER:
                elements.push(Bezier.fromJSON(element.content));
                break;
            case DRAWABLE_SHAPES.GRID:
                elements.push(Grid.fromJSON(element.content));
                break;
            case DRAWABLE_SHAPES.ARC:
                elements.push(Arc.fromJSON(element.content));
                break;
            case DRAWABLE_SHAPES.PARABOLA:
                elements.push(Parabola.fromJSON(element.content));
                break;
            case DRAWABLE_SHAPES.TEXT:
                elements.push(Text.fromJSON(element.content));
                break;
            case "lmath":
                elements.push(LMath.fromJSON(element.content));
                break;
        }
    });

    EDIT_CONTROLS.COPIED_ELEMENTS.length = 0;
    let length = SHAPES_DATABASE.length;

    elements.forEach(e => {
        if (e.constructor.name.toLowerCase() === DRAWABLE_SHAPES.POINT
            || e.constructor.name.toLowerCase() === DRAWABLE_SHAPES.TEXT
            || e.constructor.name.toLowerCase() === "lmath") {
            e.x = e.x + grid_density;
            e.y = e.y + grid_density;
        } else {
            e.dimension = {
                start: {
                    x: e.dimension.start.x + grid_density,
                    y: e.dimension.start.y + grid_density
                },
                end: {
                    x: e.dimension.end.x + grid_density,
                    y: e.dimension.end.y + grid_density
                }
            }

            if (e.constructor.name.toLowerCase() === DRAWABLE_SHAPES.BEZIER) {

                e.controls.p1 = {
                    x: e.controls.p1.x + grid_density,
                    y: e.controls.p1.y + grid_density
                };
                e.controls.p2 = {
                    x: e.controls.p2.x + grid_density,
                    y: e.controls.p2.y + grid_density
                };
            }
        }


        SHAPES_DATABASE.push(e);
    });

    for (let i = 0; i < elements.length; i++) {
        let index = length + i
        EDIT_CONTROLS.COPIED_ELEMENTS.push({
            index: index,
            type: SHAPES_DATABASE[index].constructor.name,
            content: SHAPES_DATABASE[index]
        });

        if (SHAPES_DATABASE[index] instanceof Point || SHAPES_DATABASE[index] instanceof LMath) {
            EDIT_CONTROLS.POINT_MAPPING.push({
                index,
                start: {
                    x: SHAPES_DATABASE[index].x,
                    y: SHAPES_DATABASE[index].y
                }
            });
        } else {
            EDIT_CONTROLS.POINT_MAPPING.push({
                index,
                start: {
                    x: SHAPES_DATABASE[index].dimension.start.x,
                    y: SHAPES_DATABASE[index].dimension.start.y
                },
                end: {
                    x: SHAPES_DATABASE[index].dimension.end.x,
                    y: SHAPES_DATABASE[index].dimension.end.y
                }
            });
        }
    }
}

// =====================================================================================================================

const deleteSelectedElements = () => {
    let deletables = [];
    EDIT_CONTROLS.SELECTED_ELEMENTS.forEach(element => {
        deletables.push(element.index);
    });

    for (let i = SHAPES_DATABASE.length; i >= 0; i--) {
        if (deletables.includes(i)) {
            SHAPES_DATABASE.splice(i, 1);
            EDIT_CONTROLS.POINT_MAPPING.splice(i, 1);
        }
    }

    $("#aProperties").hide("slow");
}

loadOptions($("#linewidth_common"), LINE_WIDTH, "THIN");
loadOptions($("#linedash_common"), LINE_DASH, "SOLID");


export {
    editSetup,
    startSelectingArea,
    endSelectingArea,
    fillSelectedElements,
    deleteSelectedElements,
    fillCopiedElements,
    pasteCopiedElements,
    addPropertiesAccordions
}
