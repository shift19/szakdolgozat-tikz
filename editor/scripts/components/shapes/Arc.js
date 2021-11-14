'use strict';

import {P5} from "../sketch.js";
import {COLOR, grid_density, LINE_DASH, LINE_WIDTH} from "../global.js";
import {getKeyLC} from "../misc.js";
import {Shape} from "./Shape.js";
import {Ellipse} from "./Ellipse.js";

class Arc extends Shape {
    constructor(start, end, properties) {
        super(properties);
        this.dimension = {
            start: start,
            end: end
        }

        this.angles = {
            start: properties.angles.start,
            end: properties.angles.end
        }
    }

    static fromJson(content) {
        return new Arc({
                x: content.dimension.start.x,
                y: content.dimension.start.y
            }, {
                x: content.dimension.end.x,
                y: content.dimension.end.y
            },
            content
        );
    }

    draw() {
        P5.push();
        super.draw();
        let {center, diameter} = Ellipse.getCenterDiameter(this.dimension.start, this.dimension.end)
        P5.arc(center.x, center.y, diameter.x, diameter.y, P5.radians(-this.angles.end), P5.radians(-this.angles.start), P5.OPEN);
        P5.pop();
    }

    toLatex() {
        let {center, diameter} = Ellipse.getCenterDiameter(this.dimension.start, this.dimension.end)
        //      \draw (0,0) arc (2cm and 1cm);
        if (this.fill === COLOR.NONE) {
            return `\\draw[draw=${getKeyLC(COLOR, this.stroke)}, ${getKeyLC(LINE_WIDTH, this.linewidth)}, ${getKeyLC(LINE_DASH, this.linedash)}] ([shift=(${this.angles.start}:${(diameter.x / (2 * grid_density)).toFixed(2)} and ${(diameter.y / (2 * grid_density)).toFixed(2)})]${(center.x / grid_density).toFixed(2)},${(-center.y / grid_density).toFixed(2)}) arc (${this.angles.start}:${this.angles.end}:${(diameter.x / (2 * grid_density)).toFixed(2)} and ${(diameter.y / (2 * grid_density)).toFixed(2)});`

        }
        return `\\draw[draw=${getKeyLC(COLOR, this.stroke)}, fill=${getKeyLC(COLOR, this.fill)}, ${getKeyLC(LINE_WIDTH, this.linewidth)}, ${getKeyLC(LINE_DASH, this.linedash)}] ([shift=(${this.angles.start}:${(diameter.x / (2 * grid_density)).toFixed(2)} and ${(diameter.y / (2 * grid_density)).toFixed(2)})]${(center.x / grid_density).toFixed(2)},${(-center.y / grid_density).toFixed(2)}) arc (${this.angles.start}:${this.angles.end}:${(diameter.x / (2 * grid_density)).toFixed(2)} and ${(diameter.y / (2 * grid_density)).toFixed(2)});`
    }

}

export {
    Arc
}
