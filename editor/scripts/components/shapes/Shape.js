'use strict';

import {P5} from "../sketch.js";
import {COLOR} from "../global.js";

class Shape {

    constructor(properties) {
        this.stroke = properties.stroke;
        this.fill = properties.fill;
        this.linewidth = properties.linewidth;
        this.linedash = properties.linedash;
    }

    draw() {
        if (this.stroke)
            this.stroke === COLOR.NONE ? P5.noStroke() : P5.stroke(this.stroke);
        if (this.fill)
            this.fill === COLOR.NONE ? P5.noFill() : P5.fill(this.fill);
        if (this.linedash)
            P5.strokeWeight(this.linewidth);
        if (this.linedash)
            P5.drawingContext.setLineDash(this.linedash);
    }

    toLatex() {

    }
}

export {
    Shape
}
