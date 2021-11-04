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
        //this.latex = "\\dot{\\theta}_{k} = \\omega_{k} + \\frac{K}{N} \\displaystyle\\sum_{j=1}^N \\sin(\\theta_{j} - \\theta_{k})";
    }

    static fromJSON(content) {
        return new LMath(content.x, content.y, content);
    }

    draw() {
        P5.push();
        super.draw();
        P5.fill(this.stroke);  // override shape fill
        // custom katex library w/ canvas
        try {
            katex.renderToCanvas(this.latex, document.getElementById(P5.canvas.id), this.x + grid_density / 8, this.y - grid_density / 2.5, {
                fontSize: 19.5
            });
        } catch (e) {
            console.log(e)
        }
        P5.pop();
    }

    toLatex() {
        let diff = {x: 0, y: Number(((grid_density / 4) / grid_density).toFixed(2))} // todo y pos
        return `\\node[${getKeyLC(COLOR, this.stroke)}, anchor=south west] at (${this.x / grid_density},${-this.y / grid_density + diff.y}) {$${this.latex}$};`
    }
}

export {
    LMath
}
