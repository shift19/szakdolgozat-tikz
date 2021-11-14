'use strict';

import {P5} from "../sketch.js";
import {ARROW, ARROW_TIPS, COLOR, grid_density, LINE_DASH, LINE_WIDTH} from "../global.js";
import {getKeyLC} from "../misc.js";
import {Shape} from "./Shape.js";

class Line extends Shape {

    constructor(start, end, properties) {
        delete properties.fill

        super(properties);
        this.dimension = {
            start: start,
            end: end
        }
        //this.start = start;
        //this.end = end;
        this.arrow = properties.arrow;
        this.tips = {
            head: properties.tips.head,
            tail: properties.tips.tail
        }
    }

    static fromJson(content) {
        const line = new Line({
                x: content.dimension.start.x,
                y: content.dimension.start.y
            }, {
                x: content.dimension.end.x,
                y: content.dimension.end.y
            },
            content
        );
        // properties from shape
        //Shape.setProperties(line, content)

        // properties from line
        line.arrow = content.arrow
        line.tips = content.tips

        return line;
    }

    static positionHead(start, end, tip, stroke) {
        // disable linedash in line for arrow heads
        P5.drawingContext.setLineDash([]);

        let nofill = [ARROW_TIPS.LATEX_OPEN, ARROW_TIPS.STEALTH_OPEN];
        nofill.some(e => tip.includes(e)) ? P5.noFill() : P5.fill(stroke); // to fill the arrow head

        P5.translate(end.x, end.y); //translates to the destination vertex
        P5.rotate(P5.atan2(start.y - end.y, start.x - end.x) - P5.PI); //  rotate to angle

    }

    static drawArrowHead(tip, size) {
        switch (tip) {
            case ARROW_TIPS.STEALTH:
            case ARROW_TIPS.STEALTH_OPEN:
                P5.beginShape()
                P5.vertex(0, 0)
                P5.vertex(-size, size)
                P5.vertex(-size / 2, 0)
                P5.vertex(-size, -size)
                P5.endShape(P5.CLOSE)
                break;
            case ARROW_TIPS.STEALTH_RESERVED:
                P5.beginShape()
                P5.vertex(0, -size)
                P5.vertex(-size, 0)
                P5.vertex(0, size)
                P5.vertex(-size / 2, 0)
                P5.endShape(P5.CLOSE)
                break;
            case ARROW_TIPS.LATEX:
            case ARROW_TIPS.LATEX_OPEN:
                P5.beginShape()
                P5.vertex(-size, size)
                P5.vertex(-size, -size)
                P5.vertex(0, 0)
                P5.endShape(P5.CLOSE)
                break;
            case ARROW_TIPS.LATEX_RESERVED:
                P5.beginShape()
                P5.vertex(0, -size)
                P5.vertex(0, size)
                P5.vertex(-size, 0)
                P5.endShape(P5.CLOSE)
                break;
            case ARROW_TIPS.TO:
                P5.beginShape()
                P5.vertex(0, 0)
                P5.vertex(-size, size)
                P5.vertex(-size / 16, 0)
                P5.vertex(-size, -size)
                P5.endShape(P5.CLOSE)
                break;
            case ARROW_TIPS.TO_RESERVED:
                P5.beginShape()
                P5.vertex(0, -size)
                P5.vertex(-size + size / 16, 0)
                P5.vertex(0, size)
                P5.vertex(-size, 0)
                P5.endShape(P5.CLOSE)
                break;
            case ARROW_TIPS.VERTICAL:
                P5.beginShape()
                P5.vertex(0, size)
                P5.vertex(0, -size)
                P5.endShape(P5.CLOSE)
                break;
        }
    }

    draw() {
        P5.push();
        super.draw();

        let size = 8 * (this.linewidth / 2);

        switch (this.arrow) {
            case ARROW.HEAD:
                Line.positionHead(this.dimension.start, this.dimension.end, this.tips.head, this.stroke);
                Line.drawArrowHead(this.tips.head, size)
                this.drawArrowLine(this.dimension.start, this.dimension.end, this.arrow, this.tips.head, size);
                break;
            case ARROW.TAIL:
                Line.positionHead(this.dimension.end, this.dimension.start, this.tips.tail, this.stroke);
                Line.drawArrowHead(this.tips.tail, size)
                this.drawArrowLine(this.dimension.end, this.dimension.start, this.arrow, this.tips.tail, size);
                break;
            case ARROW.BOTH:
                P5.push();
                Line.positionHead(this.dimension.start, this.dimension.end, this.tips.head, this.stroke);
                Line.drawArrowHead(this.tips.head, size)
                this.drawArrowLine(this.dimension.start, this.dimension.end, this.arrow, this.tips, size);
                P5.pop();
                P5.push();
                Line.positionHead(this.dimension.end, this.dimension.start, this.tips.tail, this.stroke);
                Line.drawArrowHead(this.tips.tail, size)
                P5.pop()
                break;
            case ARROW.NONE:
                // draw the line between the points
                P5.line(this.dimension.start.x, this.dimension.start.y, this.dimension.end.x, this.dimension.end.y);
                break;
        }

        P5.pop();
    }

    toLatex() {
        //      \draw[draw=blue] (-1,2) -- (2,-4);
        let arrow = this.arrow === ARROW.NONE ? "" : ", " + this.arrow.replace(">", this.tips.head).replace("<", this.tips.tail)
        return `\\draw[draw=${getKeyLC(COLOR, this.stroke)}${arrow}, ${getKeyLC(LINE_WIDTH, this.linewidth)}, ${getKeyLC(LINE_DASH, this.linedash)}] (${(this.dimension.start.x / grid_density).toFixed(2)},${(-this.dimension.start.y / grid_density).toFixed(2)}) -- (${(this.dimension.end.x / grid_density).toFixed(2)},${(-this.dimension.end.y / grid_density).toFixed(2)});`
    }

    drawArrowLine(start, end, arrow, tip, size) {
        let dS = -size;
        let dE = -(P5.dist(start.x, start.y, end.x, end.y));

        switch (arrow) {
            case ARROW.HEAD:
            case ARROW.TAIL:
                switch (tip) {
                    case ARROW_TIPS.STEALTH:
                    case ARROW_TIPS.STEALTH_OPEN:
                        dS = -size / 2
                        break;
                    case ARROW_TIPS.TO:
                        dS = -size / 16
                        break;
                    case ARROW_TIPS.VERTICAL:
                        dS = 0
                        break;
                }
                break;
            case ARROW.BOTH:
                switch (tip.head) {
                    case ARROW_TIPS.STEALTH:
                    case ARROW_TIPS.STEALTH_OPEN:
                        dS = -size / 2
                        break;
                    case ARROW_TIPS.TO:
                        dS = -size / 16
                        break;
                    case ARROW_TIPS.TO_RESERVED:
                        dS = -size + size / 16
                        break;
                    case ARROW_TIPS.VERTICAL:
                        dS = 0
                        break;
                }
                switch (tip.tail) {
                    case ARROW_TIPS.STEALTH:
                    case ARROW_TIPS.STEALTH_OPEN:
                    case ARROW_TIPS.STEALTH_RESERVED:
                        dE = -(P5.dist(start.x, start.y, end.x, end.y)) + size / 2
                        break;
                    case ARROW_TIPS.TO:
                        dE = -(P5.dist(start.x, start.y, end.x, end.y)) + size / 16
                        break;
                    case ARROW_TIPS.TO_RESERVED:
                        dE = -(P5.dist(start.x, start.y, end.x, end.y)) + size - size / 16
                        break;
                    case ARROW_TIPS.LATEX_OPEN:
                        dE = -(P5.dist(start.x, start.y, end.x, end.y)) + size
                        break;
                }
                break;
        }

        P5.line(dS, 0, dE, 0)
    }

}

export {
    Line
}
