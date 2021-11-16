'use strict';

import {P5} from "../sketch.js";
import {COLOR, grid_density, LINE_DASH, LINE_WIDTH} from "../global.js";
import {getKeyLC} from "../misc.js";
import {Shape} from "./Shape.js";


class Point extends Shape {
    constructor(x, y, properties) {
        super(properties);
        this.x = x;
        this.y = y;
    }

    static fromJson(content) {
        return new Point(content.x, content.y, content);
    }

    draw() {
        P5.push();
        super.draw();
        P5.circle(this.x, this.y, 5)
        P5.pop()
    }

    toLatex() {
        //      \draw[draw=blue, fill=red] (-1,2) circle (5pt)
        if (this.fill === COLOR.NONE) {
            return `\\draw[draw=${getKeyLC(COLOR, this.stroke)}, ${getKeyLC(LINE_WIDTH, this.linewidth)}, ${getKeyLC(LINE_DASH, this.linedash)}] (${(this.x / grid_density).toFixed(2)},${(-this.y / grid_density).toFixed(2)}) circle (${5 / grid_density});`
        }
        return `\\draw[draw=${getKeyLC(COLOR, this.stroke)}, fill=${getKeyLC(COLOR, this.fill)}, ${getKeyLC(LINE_WIDTH, this.linewidth)}, ${getKeyLC(LINE_DASH, this.linedash)}] (${(this.x / grid_density).toFixed(2)},${(-this.y / grid_density).toFixed(2)}) circle (${5 / grid_density});`
    }
}

// =====================================================================================================================

export {
    Point
}
