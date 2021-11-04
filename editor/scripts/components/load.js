'use strict';

import {DRAWABLE_SHAPES, SHAPES_DATABASE} from "./global.js";
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

// =====================================================================================================================

const parse2String = () => {
    let json = [];
    for (let shape of SHAPES_DATABASE) {
        json.push({
            type: shape.constructor.name,
            content: shape
        });
    }
    return JSON.stringify(json);
}

// =====================================================================================================================

const parse2Class = (json) => {
    let parsed_json = JSON.parse(json);

    console.log(parsed_json)

    SHAPES_DATABASE.length = 0;

    parsed_json.forEach(element => {
        switch (element.type.toLowerCase()) {
            case DRAWABLE_SHAPES.POINT:
                SHAPES_DATABASE.push(Point.fromJSON(element.content));
                break;
            case DRAWABLE_SHAPES.LINE:
                SHAPES_DATABASE.push(Line.fromJSON(element.content));
                break;
            case DRAWABLE_SHAPES.ELLIPSE:
                SHAPES_DATABASE.push(Ellipse.fromJSON(element.content));
                break;
            case DRAWABLE_SHAPES.RECTANGLE:
                SHAPES_DATABASE.push(Rectangle.fromJSON(element.content));
                break;
            case DRAWABLE_SHAPES.BEZIER:
                SHAPES_DATABASE.push(Bezier.fromJSON(element.content));
                break;
            case DRAWABLE_SHAPES.GRID:
                SHAPES_DATABASE.push(Grid.fromJSON(element.content));
                break;
            case DRAWABLE_SHAPES.ARC:
                SHAPES_DATABASE.push(Arc.fromJSON(element.content));
                break;
            case DRAWABLE_SHAPES.PARABOLA:
                SHAPES_DATABASE.push(Parabola.fromJSON(element.content));
                break;
            case DRAWABLE_SHAPES.TEXT:
                SHAPES_DATABASE.push(Text.fromJSON(element.content));
                break;
            case "lmath":
                SHAPES_DATABASE.push(LMath.fromJSON(element.content));
                break;
        }
    });
}

// =====================================================================================================================

const parse2BASE64 = str => btoa(unescape(encodeURIComponent(str)));
const parseBASE64 = b64 => decodeURIComponent(escape(atob(b64)));

// =====================================================================================================================

const getReferenceCode = () => parse2BASE64(parse2String());

// =====================================================================================================================

const processReferralCode = ref => parse2Class(parseBASE64(ref));

// =====================================================================================================================

const getTikzCode = () => {
    let latex = `\\begin{tikzpicture}\n`;
    SHAPES_DATABASE.forEach(e => latex += `\t${e.toLatex()}\n`);
    latex += `\\end{tikzpicture}`
    return latex;
}

// =====================================================================================================================

export {
    processReferralCode,
    getReferenceCode,
    getTikzCode
}
