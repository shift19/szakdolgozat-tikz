'use strict';

import {P5} from "../sketch.js";
import {COLOR, grid_density, LINE_DASH, LINE_WIDTH} from "../global.js";
import {getKeyLC} from "../misc.js";
import {Shape} from "./Shape.js";

class Grid extends Shape {
    constructor(start, end, properties) {
        // delete unnecessary properties
        delete properties.fill

        super(properties);
        this.dimension = {
            start: start,
            end: end
        }
    }

    static fromJson(content) {
        // properties from shape
        //Shape.setProperties(grid, content)

        return new Grid({
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

        for (let i = Math.min(this.dimension.start.x, this.dimension.end.x); i <= Math.max(this.dimension.start.x, this.dimension.end.x); i += grid_density) {
            P5.line(i, this.dimension.start.y, i, this.dimension.end.y)
        }
        for (let i = Math.min(this.dimension.start.y, this.dimension.end.y); i <= Math.max(this.dimension.start.y, this.dimension.end.y); i += grid_density) {
            P5.line(this.dimension.start.x, i, this.dimension.end.x, i)
        }
        P5.pop();
    }

    toLatex() {
        return `\\draw[draw=${getKeyLC(COLOR, this.stroke)}, ${getKeyLC(LINE_WIDTH, this.linewidth)}, ${getKeyLC(LINE_DASH, this.linedash)}]  (${(this.dimension.start.x / grid_density).toFixed(2)},${(-this.dimension.start.y / grid_density).toFixed(2)}) grid (${(this.dimension.end.x / grid_density).toFixed(2)},${(-this.dimension.end.y / grid_density).toFixed(2)});`
    }

}

export {
    Grid
}
