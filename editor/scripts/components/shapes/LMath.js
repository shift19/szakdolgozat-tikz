'use strict';

import {P5} from "../sketch.js";
import {COLOR, grid_density} from "../global.js";
import {getKeyLC} from "../misc.js";
import {Shape} from "./Shape.js";

class LMath extends Shape {

    constructor(x, y, properties) {
        // delete unnecessary properties
        delete properties.fill
        delete properties.linewidth
        delete properties.linedash

        super(properties);
        this.x = x;
        this.y = y;
        this.latex = properties.latex;
    }

    static fromJson(content) {
        return new LMath(content.x, content.y, content);
    }

    draw() {
        P5.push();
        super.draw();
        P5.fill(this.stroke);  // override shape fill
        // custom katex library w/ canvas
        try {
            let canvas = document.getElementById(P5.canvas.id);
            katex.renderToCanvas(this.latex, canvas, this.x + grid_density / 8, this.y - grid_density / 2.5, {
                fontSize: 19.5
            });
        } catch (e) {
            //console.log(e)
        }
        P5.pop();
    }

    toLatex() {
        let diff = {x: (grid_density / 16) / grid_density, y: (grid_density / 4) / grid_density}
        return `\\node[${getKeyLC(COLOR, this.stroke)}, anchor=south west] at (${(this.x / grid_density - diff.x).toFixed(2)},${(-this.y / grid_density + diff.y).toFixed(2)}) {$${this.latex}$};`
    }
}

// =====================================================================================================================

export {
    LMath
}
