'use strict';

import {P5} from "../sketch.js";
import {COLOR, grid_density, LINE_DASH, LINE_WIDTH} from "../global.js";
import {getKeyLC} from "../misc.js";
import {Shape} from "./Shape.js";

class Rectangle extends Shape {
    constructor(start, end, properties) {
        super(properties);
        this.dimension = {
            start: start,
            end: end
        }
        //this.start = start;
        //this.end = end;
    }

    static fromJson(content) {
        // properties from shape
        //Shape.setProperties(rectangle, content)

        return new Rectangle({
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
        P5.rectMode(P5.CORNERS);
        P5.rect(this.dimension.start.x, this.dimension.start.y, this.dimension.end.x, this.dimension.end.y);
        P5.pop();
    }

    toLatex() {
        //       \draw [draw=black, fill=red] (0.0) rectangle (1,1);
        if (this.fill === COLOR.NONE) {
            return `\\draw[draw=${getKeyLC(COLOR, this.stroke)}, ${getKeyLC(LINE_WIDTH, this.linewidth)}, ${getKeyLC(LINE_DASH, this.linedash)}] (${(this.dimension.start.x / grid_density).toFixed(2)},${(-this.dimension.start.y / grid_density).toFixed(2)}) rectangle (${(this.dimension.end.x / grid_density).toFixed(2)},${(-this.dimension.end.y / grid_density).toFixed(2)});`
        }
        return `\\draw[draw=${getKeyLC(COLOR, this.stroke)}, fill=${getKeyLC(COLOR, this.fill)}, ${getKeyLC(LINE_WIDTH, this.linewidth)}, ${getKeyLC(LINE_DASH, this.linedash)}] (${(this.dimension.start.x / grid_density).toFixed(2)},${(-this.dimension.start.y / grid_density).toFixed(2)}) rectangle (${(this.dimension.end.x / grid_density).toFixed(2)},${(-this.dimension.end.y / grid_density).toFixed(2)});`
    }
}

export {
    Rectangle
}
