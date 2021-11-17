'use strict';

// calculate real mouse position after moving the canvas
import {P5} from "./sketch.js";
import {ARROW, ARROW_TIPS, COLOR, grid_density, isNormalize, LINE_DASH, LINE_WIDTH, ZOOM_CONTROLS} from "./global.js";

//======================================================================================================================

const calcRPos = () => {
    let ctlX = -ZOOM_CONTROLS.VIEW.x / ZOOM_CONTROLS.VIEW.zoom;
    let ctlY = -ZOOM_CONTROLS.VIEW.y / ZOOM_CONTROLS.VIEW.zoom;

    let mouseRealX = P5.map(P5.mouseX, 0, P5.width, ctlX, ctlX + P5.width / ZOOM_CONTROLS.VIEW.zoom);
    let mouseRealY = P5.map(P5.mouseY, 0, P5.height, ctlY, ctlY + P5.height / ZOOM_CONTROLS.VIEW.zoom);

    return {x: mouseRealX, y: mouseRealY};
}

//======================================================================================================================

// get default properties from inputs for future use
const getDefaultProperties = () => {
    return {
        stroke: COLOR[$("#defaultStroke").val().toUpperCase()],
        fill: COLOR[$("#defaultFill").val().toUpperCase()],
        linewidth: LINE_WIDTH[$("#defaultLinewidth").val()],
        linedash: LINE_DASH[$("#defaultLinedash").val()],
        angles: {
            start: $("#defaultArcStart").val(),
            end: $("#defaultArcEnd").val()
        },
        arrow: ARROW[$("#defaultArrow").val()],
        tips: {
            head: ARROW_TIPS[$("#defaultArrowTipHead").val()],
            tail: ARROW_TIPS[$("#defaultArrowTipTail").val()]
        },
        text: $("#defaultText").val(),
        latex: $("#defaultLatex").val()
    };
}

//======================================================================================================================

const loadOptions = (dom, obj, def) => {
    Object.keys(obj).forEach(key => {
        let option = $(`<option value="${key}">${capitalize(key)}</option>`);

        if (key === def) {
            option.attr('selected', 'selected')
        }

        dom.append(option);
    });
}

//======================================================================================================================

const middlepoints = 2; // actual middlepoints is less by 1

const normalize = point => (!isNormalize) ? {
    x: point.x,
    y: point.y
} : {x: Math.round(point.x / (grid_density/middlepoints)) * (grid_density/middlepoints), y: Math.round(point.y / (grid_density/middlepoints)) * (grid_density/middlepoints)};

const getKey = (keyof, value) => Object.keys(keyof).find(key => JSON.stringify(keyof[key]) === JSON.stringify(value));
const getKeyLC = (keyof, value) => Object.keys(keyof).find(key => JSON.stringify(keyof[key]) === JSON.stringify(value)).toLowerCase().replace("_", " ");

const capitalize = ([first, ...rest]) => first.toUpperCase() + rest.join('').toLowerCase().replace("_", " ");

const toHex = rgb => '#' + rgb.slice(4, -1).split(',').map(x => (+x).toString(16).padStart(2, "0")).join('').toUpperCase();

const isBetween = (val, min, max, inc) => inc ? val >= min && val <= max : val > min && val < max;

//======================================================================================================================

export {
    calcRPos,
    getDefaultProperties,
    loadOptions,
    normalize,
    getKey,
    getKeyLC,
    capitalize,
    toHex,
    isBetween
}
