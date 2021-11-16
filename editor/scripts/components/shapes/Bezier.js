'use strict';

import {P5} from "../sketch.js";
import {ARROW, COLOR, grid_density, LINE_DASH, LINE_WIDTH} from "../global.js";
import {getKeyLC, normalize} from "../misc.js";
import {Shape} from "./Shape.js";
import {Line} from "./Line.js";

class Bezier extends Shape {
    constructor(start, end, properties) {
        super(properties);
        this.dimension = {
            start: start,
            end: end
        }

        this.arrow = properties.arrow;
        this.tips = {
            head: properties.tips.head,
            tail: properties.tips.tail
        }

        // add controls points for bezier curve (normalize if necessary)
        let p1 = normalize({
            x: (2 * this.dimension.start.x + this.dimension.end.x) / 3,
            y: (2 * this.dimension.start.y + this.dimension.end.y) / 3
        });
        let p2 = normalize({
            x: (this.dimension.start.x + 2 * this.dimension.end.x) / 3,
            y: (this.dimension.start.y + 2 * this.dimension.end.y) / 3
        });
        this.controls = {
            p1: p1,
            p2: p2
        }
    }

    static fromJson(content) {
        const bezier = new Bezier({
                x: content.dimension.start.x,
                y: content.dimension.start.y
            }, {
                x: content.dimension.end.x,
                y: content.dimension.end.y
            },
            content
        );

        bezier.arrow = content.arrow;
        bezier.tips = {
            head: content.tips.head,
            tail: content.tips.tail
        }
        bezier.controls.p1 = {
            x: content.controls.p1.x,
            y: content.controls.p1.y
        }
        bezier.controls.p2 = {
            x: content.controls.p2.x,
            y: content.controls.p2.y
        }

        return bezier;
    }

    draw() {
        P5.push();
        super.draw();

        let size = 8 * (this.linewidth / 2);

        P5.bezier(this.dimension.start.x, this.dimension.start.y, this.controls.p1.x, this.controls.p1.y, this.controls.p2.x, this.controls.p2.y, this.dimension.end.x, this.dimension.end.y)

        switch (this.arrow) {
            case ARROW.HEAD:
                P5.push();
                if (JSON.stringify(this.dimension.end) === JSON.stringify(this.controls.p2)) {
                    Line.positionHead(this.controls.p1, this.dimension.end, this.tips.tail, this.stroke);
                } else {
                    Line.positionHead(this.controls.p2, this.dimension.end, this.tips.tail, this.stroke);
                }
                Line.drawArrowHead(this.tips.head, size)
                P5.pop();
                break;
            case ARROW.TAIL:
                P5.push();
                if (JSON.stringify(this.dimension.start) === JSON.stringify(this.controls.p1)) {
                    Line.positionHead(this.controls.p2, this.dimension.start, this.tips.head, this.stroke);
                } else {
                    Line.positionHead(this.controls.p1, this.dimension.start, this.tips.head, this.stroke);
                }
                Line.drawArrowHead(this.tips.tail, size)
                P5.pop();
                break;
            case ARROW.BOTH:
                P5.push();
                if (JSON.stringify(this.dimension.end) === JSON.stringify(this.controls.p2)) {
                    Line.positionHead(this.controls.p1, this.dimension.end, this.tips.tail, this.stroke);
                } else {
                    Line.positionHead(this.controls.p2, this.dimension.end, this.tips.tail, this.stroke);
                }
                Line.drawArrowHead(this.tips.head, size)
                P5.pop();
                P5.push();
                if (JSON.stringify(this.dimension.start) === JSON.stringify(this.controls.p1)) {
                    Line.positionHead(this.controls.p2, this.dimension.start, this.tips.head, this.stroke);
                } else {
                    Line.positionHead(this.controls.p1, this.dimension.start, this.tips.head, this.stroke);
                }
                Line.drawArrowHead(this.tips.tail, size)
                P5.pop();
                break;
            case ARROW.NONE:
                break;
        }

        P5.pop();
    }

    toLatex() {
        let arrow = this.arrow === ARROW.NONE ? "" : ", " + this.arrow.replace(">", this.tips.head).replace("<", this.tips.tail)
        //       \draw [draw=black] (0,0) .. controls (1,2) and (2,-2) .. (3,0);
        if (this.fill === COLOR.NONE) {
            return `\\draw[draw=${getKeyLC(COLOR, this.stroke)}, ${getKeyLC(LINE_WIDTH, this.linewidth)}${arrow}, ${getKeyLC(LINE_DASH, this.linedash)}] (${(this.dimension.start.x / grid_density).toFixed(2)},${(-this.dimension.start.y / grid_density).toFixed(2)}) .. controls (${(this.controls.p1.x / grid_density).toFixed(2)}, ${(-this.controls.p1.y / grid_density).toFixed(2)}) and (${(this.controls.p2.x / grid_density).toFixed(2)}, ${(-this.controls.p2.y / grid_density).toFixed(2)}) .. (${(this.dimension.end.x / grid_density).toFixed(2)},${(-this.dimension.end.y / grid_density).toFixed(2)});`
        }
        return `\\draw[draw=${getKeyLC(COLOR, this.stroke)}, fill=${getKeyLC(COLOR, this.fill)}${arrow}, ${getKeyLC(LINE_WIDTH, this.linewidth)}, ${getKeyLC(LINE_DASH, this.linedash)}] (${(this.dimension.start.x / grid_density).toFixed(2)},${(-this.dimension.start.y / grid_density).toFixed(2)}) .. controls (${(this.controls.p1.x / grid_density).toFixed(2)}, ${(-this.controls.p1.y / grid_density).toFixed(2)}) and (${(this.controls.p2.x / grid_density).toFixed(2)}, ${(-this.controls.p2.y / grid_density).toFixed(2)}) .. (${(this.dimension.end.x / grid_density).toFixed(2)},${(-this.dimension.end.y / grid_density).toFixed(2)});`
    }
}

// =====================================================================================================================

export {
    Bezier
}
