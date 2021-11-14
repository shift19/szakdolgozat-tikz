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
                SHAPES_DATABASE.push(Point.fromJson(element.content));
                break;
            case DRAWABLE_SHAPES.LINE:
                SHAPES_DATABASE.push(Line.fromJson(element.content));
                break;
            case DRAWABLE_SHAPES.ELLIPSE:
                SHAPES_DATABASE.push(Ellipse.fromJson(element.content));
                break;
            case DRAWABLE_SHAPES.RECTANGLE:
                SHAPES_DATABASE.push(Rectangle.fromJson(element.content));
                break;
            case DRAWABLE_SHAPES.BEZIER:
                SHAPES_DATABASE.push(Bezier.fromJson(element.content));
                break;
            case DRAWABLE_SHAPES.GRID:
                SHAPES_DATABASE.push(Grid.fromJson(element.content));
                break;
            case DRAWABLE_SHAPES.ARC:
                SHAPES_DATABASE.push(Arc.fromJson(element.content));
                break;
            case DRAWABLE_SHAPES.PARABOLA:
                SHAPES_DATABASE.push(Parabola.fromJson(element.content));
                break;
            case DRAWABLE_SHAPES.TEXT:
                SHAPES_DATABASE.push(Text.fromJson(element.content));
                break;
            case "lmath":
                SHAPES_DATABASE.push(LMath.fromJson(element.content));
                break;
        }
    });
}

// =====================================================================================================================

const getReferenceCode = () => JSONC.pack(parse2String());
const processReferralCode = ref => parse2Class(JSONC.unpack(ref));

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
    getTikzCode,
    parse2Class,
    parse2String
}
