'use strict';

import {P5} from "../sketch.js";
import {COLOR, grid_density, LINE_DASH, LINE_WIDTH} from "../global.js";
import {getKeyLC} from "../misc.js";
import {Shape} from "./Shape.js";

class Parabola extends Shape {
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
        //Shape.setProperties(parabola, content)

        return new Parabola({
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
        // y = a(x - x0)^2 + y0, x in [x0, y0], where a = (y1 - y0) / (x1 - x0)^2
        let a = (this.dimension.end.y - this.dimension.start.y) / Math.pow(this.dimension.end.x - this.dimension.start.x, 2)
        if (isFinite(a)) {
            P5.beginShape();
            for (let i = Math.min(this.dimension.start.x, this.dimension.end.x); i <= Math.max(this.dimension.start.x, this.dimension.end.x); i += 0.25) {
                P5.vertex(i, a * (Math.pow(i - this.dimension.start.x, 2)) + this.dimension.start.y)
            }
            P5.endShape();
        } else {
            P5.line(this.dimension.start.x, this.dimension.start.y, this.dimension.end.x, this.dimension.end.y)
        }

        P5.pop();
    }

    toLatex() {
        //       \draw [draw=black, fill=red] (0,0) parabola (1,1);
        if (this.fill === COLOR.NONE) {
            return `\\draw[draw=${getKeyLC(COLOR, this.stroke)}, ${getKeyLC(LINE_WIDTH, this.linewidth)}, ${getKeyLC(LINE_DASH, this.linedash)}] (${(this.dimension.start.x / grid_density).toFixed(2)},${(-this.dimension.start.y / grid_density).toFixed(2)}) parabola (${(this.dimension.end.x / grid_density).toFixed(2)},${(-this.dimension.end.y / grid_density).toFixed(2)});`
        }
        return `\\draw[draw=${getKeyLC(COLOR, this.stroke)}, fill=${getKeyLC(COLOR, this.fill)}, ${getKeyLC(LINE_WIDTH, this.linewidth)}, ${getKeyLC(LINE_DASH, this.linedash)}] (${(this.dimension.start.x / grid_density).toFixed(2)},${(-this.dimension.start.y / grid_density).toFixed(2)}) parabola (${(this.dimension.end.x / grid_density).toFixed(2)},${(-this.dimension.end.y / grid_density).toFixed(2)});`
    }
}

export {
    Parabola
}
