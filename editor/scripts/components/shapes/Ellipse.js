'use strict';

import {P5} from "../sketch.js";
import {COLOR, grid_density, LINE_DASH, LINE_WIDTH} from "../global.js";
import {getKeyLC} from "../misc.js";
import {Shape} from "./Shape.js";

class Ellipse extends Shape {
    constructor(start, end, properties) {
        super(properties);
        this.dimension = {
            start: start,
            end: end
        }
        //this.start = start;
        //this.end = end;
    }

    static fromJSON(content) {
        return new Ellipse({
                x: content.dimension.start.x,
                y: content.dimension.start.y
            }, {
                x: content.dimension.end.x,
                y: content.dimension.end.y
            },
            content
        );
    }

    // fix drawing w/ negative coordination
    static getCenterDiameter(start, end) {
        let center = {
            x: start.x + (end.x - start.x) / 2,
            y: start.y + (end.y - start.y) / 2
        };
        let diameter = {
            x: end.x - start.x,
            y: end.y - start.y
        };
        return {center, diameter}
    }

    draw() {
        P5.push();
        super.draw();
        let {center, diameter} = Ellipse.getCenterDiameter(this.dimension.start, this.dimension.end)
        P5.ellipse(center.x, center.y, diameter.x, diameter.y);
        P5.pop();
    }

    toLatex() {
        let {center, diameter} = Ellipse.getCenterDiameter(this.dimension.start, this.dimension.end)
        //      \draw (0,0) ellipse (2cm and 1cm);
        if (this.fill === COLOR.NONE) {
            return `\\draw[draw=${getKeyLC(COLOR, this.stroke)}, ${getKeyLC(LINE_WIDTH, this.linewidth)}, ${getKeyLC(LINE_DASH, this.linedash)}] (${center.x / grid_density},${-center.y / grid_density}) ellipse (${diameter.x / (2 * grid_density)} and ${diameter.y / (2 * grid_density)});`

        }
        return `\\draw[draw=${getKeyLC(COLOR, this.stroke)}, fill=${getKeyLC(COLOR, this.fill)}, ${getKeyLC(LINE_WIDTH, this.linewidth)}, ${getKeyLC(LINE_DASH, this.linedash)}] (${center.x / grid_density},${-center.y / grid_density}) ellipse (${diameter.x / (2 * grid_density)} and ${diameter.y / (2 * grid_density)});`
    }
}

export {
    Ellipse
}
