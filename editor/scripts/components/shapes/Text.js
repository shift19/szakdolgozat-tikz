'use strict';

import {P5} from "../sketch.js";
import {COLOR, grid_density} from "../global.js";
import {getKeyLC} from "../misc.js";
import {Shape} from "./Shape.js";

class Text extends Shape {

    constructor(x, y, properties) {

        // delete unnecessary properties
        delete properties.fill
        delete properties.linewidth
        delete properties.linedash

        super(properties);
        this.x = x;
        this.y = y;
        // replace to remove \ from text, can't use in text mode
        this.text = properties.text.replace("\\", "");
    }

    static fromJSON(content) {
        // properties from shape
        //Shape.setProperties(point, content)

        return new Text(content.x, content.y, content);
    }

    draw() {
        P5.push();
        super.draw();
        P5.fill(this.stroke);  // override shape fill
        // custom katex library w/ canvas
        try {
            //                                                  to fix \ math expression crash
            katex.renderToCanvas(`\\text{${this.text}}`, document.getElementById(P5.canvas.id), this.x + grid_density / 8, this.y - grid_density / 2.5, {
                fontSize: 19.5
            });
        } catch (e) {
            console.log(e)
        }
        P5.pop();
    }

    toLatex() {
        let diff = {x: (grid_density / 4) / grid_density, y: (grid_density / 2.5) / grid_density}
        return `\\node[${getKeyLC(COLOR, this.stroke)}] at (${this.x / grid_density - diff.x},${-this.y / grid_density + diff.y}) {${this.text}};`
    }
}

export {
    Text
}
