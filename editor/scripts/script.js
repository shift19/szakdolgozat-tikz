'use strict';


/*
    todo implement copy/paste/delete
 */


/*
        VARIABLES
 */
// TODO: refactor
let _draw;
let _mode;
let _parse = [];

const MODES = {
    SELECT: "select",
    EDIT: "edit",
    MOVE: "move"
}

const DRAWABLE_SHAPES = {
    POINT: "point",
    LINE: "line",
    ELLIPSE: "ellipse",
    RECTANGLE: "rectangle",
    BEZIER: "bezier",
    GRID: "grid",
    ARC: "arc",
    PARABOLA: "parabola"
}

// set grid density (higher is less dense)
let gd = 50;
//  bool to snap to grid (true: snap, false: no)
let isNormalize = true;

// store all the shapes drawn to canvas
const SHAPES_DATABASE = [];

/*
    COLOR ENUM
 */
const COLOR = {
    NONE: "#E9ECEF", // for no stroke or fill color
    WHITE: "#FFFFFF",
    LIGHTGRAY: "#BFBFBF",
    GRAY: "#808080",
    DARKGRAY: "#404040",
    BLACK: "#000000",
    RED: "#FF0000",
    VIOLET: "#800080",
    PURPLE: "#BF0040",
    MAGENTA: "#FF00FF",
    PINK: "#FFBFBF",
    GREEN: "#00FF00",
    LIME: "#BFFF00",
    OLIVE: "#808000",
    BROWN: "#BF8040",
    ORANGE: "#FF8000",
    YELLOW: "#FFFF00",
    BLUE: "#0000FF",
    CYAN: "#00FFFF",
    TEAL: "#008080",
    toHex: (rgb) => '#' + rgb.slice(4, -1).split(',').map(x => (+x).toString(16).padStart(2, "0")).join('').toUpperCase()
}

const getKey = (keyof, value) => Object.keys(keyof).find(key => keyof[key] === value);

// zoom controls
const ZOOM_CONTROLS = {
    VIEW: {x: 0, y: 0, zoom: 1},
    VIEW_POSITION: {prevX: null, prevY: null, isDragging: false},
}

// shape drawing controls
const DRAW_VARS = {
    CURRENTLY_DRAWING: false,
    STARTING_POINT: null,
    ENDING_POINT: null,
    CURRENTLY_DRAWN: null
}

// point movement controls
const MOVE_VARS = {
    ENABLED: false,
    SELECTED_POINTS: [],
    DRAGGED_POINT: undefined,
    KEY_PRESSED: null,
    POINT_MAPPING: [],
    POINT_DIAMETER: 10
};

// TODO:
const SELECT_VARS = {}


// $(document).ready...
$(function () {
    $("#edit_menu").hide();
    $("#defaultProperties").hide();
    $("#arrowProperties").hide();
    $("#arcProperties").hide();

});

/*
        CANVAS
 */

let canvas;

function setup() {
    let c = $("#canvas")
    let w = c.width();
    let h = c.height();

    canvas = createCanvas(w, h);
    frameRate(30);
    canvas.parent("canvas");
    canvas.mousePressed(cMousePressed)
    canvas.mouseReleased(cMouseReleased)
    canvas.mouseOut(cMouseOut);

    canvas.mouseWheel(e => Controls.zoomCanvas().zoom(e))

    _mode = $('input[name="toolbar_button"]:checked')[0].id

    // show center of the grid
    ZOOM_CONTROLS.VIEW = {x: width / 2, y: height / 2, zoom: 2}

    //testing new features
    //SHAPES_DATABASE.push(new Text(new Vector(0, 0), new Vector(100, 100)))
}

// calculate real mouse position after moving the canvas
function calcRPos() {
    let ctlX = -ZOOM_CONTROLS.VIEW.x / ZOOM_CONTROLS.VIEW.zoom;
    let ctlY = -ZOOM_CONTROLS.VIEW.y / ZOOM_CONTROLS.VIEW.zoom;

    let mouseRealX = map(mouseX, 0, width, ctlX, ctlX + width / ZOOM_CONTROLS.VIEW.zoom);
    let mouseRealY = map(mouseY, 0, height, ctlY, ctlY + height / ZOOM_CONTROLS.VIEW.zoom);

    return {x: mouseRealX, y: mouseRealY};
}

function windowResized() {
    let c = $("#canvas")
    let w = c.width();
    let h = c.height();
    resizeCanvas(w, h);
}

function draw() {
    background(255);

    translate(ZOOM_CONTROLS.VIEW.x, ZOOM_CONTROLS.VIEW.y);
    scale(ZOOM_CONTROLS.VIEW.zoom)
    parseDraws()
    drawHelpingGrid();

    push();
    SHAPES_DATABASE.forEach(e => e.draw())


    if (_mode === MODES.EDIT) {
        if (mouseIsPressed && mouseButton === LEFT && DRAW_VARS.CURRENTLY_DRAWING) {

            switch (_draw) {
                case "line":
                    DRAW_VARS.CURRENTLY_DRAWN = new Line(Vector.constructorV(DRAW_VARS.STARTING_POINT), Vector.constructorV(calcRPos()));
                    break;
                case "ellipse":
                    DRAW_VARS.CURRENTLY_DRAWN = new Ellipse(Vector.constructorV(DRAW_VARS.STARTING_POINT), Vector.constructorV(calcRPos()));
                    break;
                case "rectangle":
                    DRAW_VARS.CURRENTLY_DRAWN = new Rectangle(Vector.constructorV(DRAW_VARS.STARTING_POINT), Vector.constructorV(calcRPos()));
                    break;
                case "bezier":
                    DRAW_VARS.CURRENTLY_DRAWN = new Bezier(Vector.constructorV(DRAW_VARS.STARTING_POINT), Vector.constructorV(calcRPos()));
                    break;
                case "grid":
                    DRAW_VARS.CURRENTLY_DRAWN = new Grid(Vector.constructorV(DRAW_VARS.STARTING_POINT), Vector.constructorV(calcRPos()));
                    break;
                case "arc":
                    DRAW_VARS.CURRENTLY_DRAWN = new Arc(Vector.constructorV(DRAW_VARS.STARTING_POINT), Vector.constructorV(calcRPos()));
                    break;
                case "parabola":
                    DRAW_VARS.CURRENTLY_DRAWN = new Parabola(Vector.constructorV(DRAW_VARS.STARTING_POINT), Vector.constructorV(calcRPos()));
                    break;
            }
        }
        if (DRAW_VARS.CURRENTLY_DRAWN) DRAW_VARS.CURRENTLY_DRAWN.draw();
    }

    if (MOVE_VARS.ENABLED) {
        if (MOVE_VARS.DRAGGABLE && mouseIsPressed) {


            const MOUSE_POSITION = normalize(calcRPos());

            if (!MOVE_VARS.DRAGGED_POINT) {
                MOVE_VARS.POINT_MAPPING.forEach(points => {
                    Object.keys(points).forEach((point) => {
                        if (point !== 'index') {
                            if (Math.abs(points[point].x - MOUSE_POSITION.x) < MOVE_VARS.POINT_DIAMETER / 2 &&
                                Math.abs(points[point].y - MOUSE_POSITION.y) < MOVE_VARS.POINT_DIAMETER / 2) {

                                MOVE_VARS.DRAGGED_POINT = points[point];

                            }
                        }
                    })
                });
            }

            const DELTA = {
                x: MOUSE_POSITION.x - MOVE_VARS.DRAGGED_POINT.x,
                y: MOUSE_POSITION.y - MOVE_VARS.DRAGGED_POINT.y
            };


            MOVE_VARS.SELECTED_POINTS.forEach(selected_point => {
                const CONTROL_POINTS = ['p1', 'p2'];

                if (CONTROL_POINTS.includes(selected_point.which)) {
                    SHAPES_DATABASE[selected_point.index]['controls'][selected_point.which].x += DELTA.x;
                    SHAPES_DATABASE[selected_point.index]['controls'][selected_point.which].y += DELTA.y;
                } else if (SHAPES_DATABASE[selected_point.index] instanceof Point) {
                    SHAPES_DATABASE[selected_point.index].x += DELTA.x;
                    SHAPES_DATABASE[selected_point.index].y += DELTA.y;
                } else {
                    SHAPES_DATABASE[selected_point.index][selected_point.which].x += DELTA.x;
                    SHAPES_DATABASE[selected_point.index][selected_point.which].y += DELTA.y;
                }

                MOVE_VARS.POINT_MAPPING[selected_point.index][selected_point.which].x += DELTA.x;
                MOVE_VARS.POINT_MAPPING[selected_point.index][selected_point.which].y += DELTA.y;
            });
        }

        SHAPES_DATABASE.filter(shape => (shape instanceof Bezier)).forEach(bezier => {
            line(bezier.start.x, bezier.start.y, bezier.controls.p1.x, bezier.controls.p1.y);
            line(bezier.end.x, bezier.end.y, bezier.controls.p2.x, bezier.controls.p2.y);
        });


        MOVE_VARS.POINT_MAPPING.forEach((points, i) => {
                Object.keys(points).forEach((point) => {
                    fill(0, 255, 0);
                    if (point !== 'index') {
                        MOVE_VARS.SELECTED_POINTS.forEach(selected_point => {
                            if (selected_point?.index === i && selected_point?.which === point) {
                                fill(255, 0, 0);
                            }
                        });
                    }
                    circle(points[point].x, points[point].y, MOVE_VARS.POINT_DIAMETER);
                });
            }
        );
        pop();
    }
}

function keyPressed() {
    MOVE_VARS.KEY_PRESSED = keyCode;
}

function keyReleased() {
    MOVE_VARS.KEY_PRESSED = null;
}

function normalize(point) {
    if(!isNormalize)
        return {x:point.x, y:point.y}
    return {x: Math.round(point.x / gd) * gd, y: Math.round(point.y / gd) * gd}
}

function moveSetup() {
    MOVE_VARS.ENABLED = true;
    SHAPES_DATABASE.forEach((shape, index) => {
        if (shape instanceof Point) {
            MOVE_VARS.POINT_MAPPING.push({
                index,
                start: new Vector(shape.x, shape.y)
            });
        } else {
            if (shape instanceof Bezier) {
                MOVE_VARS.POINT_MAPPING.push({
                    index,
                    start: Vector.constructorV(shape.start),
                    end: Vector.constructorV(shape.end),

                    p1: Vector.constructorV(shape.controls.p1),
                    p2: Vector.constructorV(shape.controls.p2)
                });
            } else {
                MOVE_VARS.POINT_MAPPING.push({
                    index,
                    start: Vector.constructorV(shape.start),
                    end: Vector.constructorV(shape.end)
                });
            }
        }
    });
}

function cMousePressed() {
    _draw = $('input[name="edit_button"]:checked')[0].id
    if (mouseButton === RIGHT) return;


    // reset zoom after pressing mouse middle button in select
    if (_mode === MODES.SELECT && mouseButton === CENTER) {
        ZOOM_CONTROLS.VIEW = {x: width / 2, y: height / 2, zoom: 2}
        ZOOM_CONTROLS.VIEW_POSITION = {prevX: null, prevY: null, isDragging: false}
        resetMatrix();
    }

    // mouse handler for move
    if (_mode === MODES.MOVE && mouseButton === LEFT) {
        const MOUSE_POSITION = calcRPos();
        const PREV_SELECTED_POINTS = MOVE_VARS.SELECTED_POINTS;

        MOVE_VARS.POINT_MAPPING.forEach(points => {
            Object.keys(points).forEach((point) => {
                if (point !== 'index') {
                    if (Math.abs(points[point].x - MOUSE_POSITION.x) < MOVE_VARS.POINT_DIAMETER / 2 &&
                        Math.abs(points[point].y - MOUSE_POSITION.y) < MOVE_VARS.POINT_DIAMETER / 2) {

                        if (MOVE_VARS.KEY_PRESSED !== CONTROL)
                            MOVE_VARS.SELECTED_POINTS.length = 0;

                        const SELECTED_POINT_EXISTS = MOVE_VARS.SELECTED_POINTS.filter(sp => sp.index === points['index'] && sp.which === point)

                        if (!SELECTED_POINT_EXISTS.length) {
                            MOVE_VARS.SELECTED_POINTS.push({index: points['index'], which: point});
                        }
                    }
                }
            })
        });

        if (!!MOVE_VARS.SELECTED_POINTS && JSON.stringify(PREV_SELECTED_POINTS) === JSON.stringify(MOVE_VARS.SELECTED_POINTS)) {
            MOVE_VARS.SELECTED_POINTS.forEach(selected_point => {
                const INDEX = selected_point.index;
                const WHICH = selected_point.which;

                const POINT = MOVE_VARS.POINT_MAPPING.filter(point => point.index === INDEX)[0][WHICH];

                if (Math.abs(POINT.x - MOUSE_POSITION.x) < MOVE_VARS.POINT_DIAMETER / 2 &&
                    Math.abs(POINT.y - MOUSE_POSITION.y) < MOVE_VARS.POINT_DIAMETER / 2) {
                    MOVE_VARS.DRAGGABLE = true;
                }
            });
        }
    }

    if (_mode !== MODES.EDIT) return;

    if (mouseButton === LEFT && (0 <= calcRPos().x <= width) && (0 <= calcRPos().y <= height)) {

        DRAW_VARS.STARTING_POINT = normalize(calcRPos());

        if (_draw === DRAWABLE_SHAPES.POINT) {
            _parse.push({
                "type": _draw,
                "point": DRAW_VARS.STARTING_POINT
            });
        } else {
            DRAW_VARS.CURRENTLY_DRAWING = true;
        }
    }

    // prevent default
    return false;
}

function cMouseReleased() {
    MOVE_VARS.DRAGGABLE = false;
    MOVE_VARS.DRAGGED_POINT= undefined;

    if (_mode !== MODES.EDIT || _draw === DRAWABLE_SHAPES.POINT || mouseButton === RIGHT) return;

    if (mouseButton === LEFT && (0 <= calcRPos().x <= width) && (0 <= calcRPos().y <= height)) {
        DRAW_VARS.ENDING_POINT = normalize(calcRPos());

        if (DRAW_VARS.STARTING_POINT) {
            // check for just clicking instead of click n drag
            if (DRAW_VARS.STARTING_POINT.x === DRAW_VARS.ENDING_POINT.x && DRAW_VARS.STARTING_POINT.y === DRAW_VARS.ENDING_POINT.y) return;

            _parse.push({
                "type": _draw,
                "points": {
                    start: DRAW_VARS.STARTING_POINT,
                    end: DRAW_VARS.ENDING_POINT
                }
            });
        }
    }

    DRAW_VARS.CURRENTLY_DRAWING = false;
    DRAW_VARS.CURRENTLY_DRAWN = undefined;
}

function cMouseOut() {
    DRAW_VARS.STARTING_POINT = undefined;
    DRAW_VARS.CURRENTLY_DRAWING = false;
    DRAW_VARS.CURRENTLY_DRAWN = undefined;
}

function parseDraws() {
    _parse.forEach((e) => {
        switch (e.type) {
            case "point":
                SHAPES_DATABASE.push(new Point(e.point.x, e.point.y));
                break;
            case "line":
                SHAPES_DATABASE.push(new Line(e.points.start, e.points.end));
                break;
            case "ellipse":
                SHAPES_DATABASE.push(new Ellipse(e.points.start, e.points.end));
                break;
            case "rectangle":
                SHAPES_DATABASE.push(new Rectangle(e.points.start, e.points.end));
                break;
            case "bezier":
                SHAPES_DATABASE.push(new Bezier(e.points.start, e.points.end));
                break;
            case "grid":
                SHAPES_DATABASE.push(new Grid(e.points.start, e.points.end));
                break;
            case "arc":
                SHAPES_DATABASE.push(new Arc(e.points.start, e.points.end));
                break;
            case "parabola":
                SHAPES_DATABASE.push(new Parabola(e.points.start, e.points.end));
                break;
        }

        //TODO:
        document.querySelector("#shapes").innerHTML += (`<span onclick="select('${e.type}')" class="col-12">${e.type}</span>`);
    })

    _parse.length = 0;
}

/*
        OBJECTS
 */
class Vector {
    constructor(x, y) {
        // for snap to grid points
        let normalized = normalize({x, y});
        this.x = normalized.x;
        this.y = normalized.y;
    }

    static constructorV(v) {
        return new Vector(v.x, v.y)
    }

}

/*
    LINE WIDTH
 */
const LINE_WIDTH = {
    ULTRA_THIN: 0.1,                        //  \tikzstyle{ultra thin}=              [line width=0.1pt]
    VERY_THIN: 0.2,                         //  \tikzstyle{very thin}=               [line width=0.2pt]
    THIN: 0.4,                              //  \tikzstyle{thin}=                    [line width=0.4pt]
    SEMITHICK: 0.6,                         //  \tikzstyle{semithick}=               [line width=0.6pt]
    THICK: 0.8,                             //  \tikzstyle{thick}=                   [line width=0.8pt]
    VERY_THICK: 1.2,                        //  \tikzstyle{very thick}=              [line width=1.2pt]
    ULTRA_THICK: 1.6                        //  \tikzstyle{ultra thick}=             [line width=1.6pt]
}

/*
    LINE_DASH
 */
const LINE_DASH = {
    SOLID: [],                              //  \tikzstyle{solid}=                   [dash pattern=]
    DOTTED: [1, 2],                         //  \tikzstyle{dotted}=                  [dash pattern=on \pgflinewidth off 2pt]
    DENSELY_DOTTED: [1, 1],                 //  \tikzstyle{densely dotted}=          [dash pattern=on \pgflinewidth off 1pt]
    LOOSELY_DOTTED: [1, 4],                 //  \tikzstyle{loosely dotted}=          [dash pattern=on \pgflinewidth off 4pt]
    DASHED: [3, 3],                         //  \tikzstyle{dashed}=                  [dash pattern=on 3pt off 3pt]
    DENSELY_DASHED: [3, 2],                 //  \tikzstyle{densely dashed}=          [dash pattern=on 3pt off 2pt]
    LOOSELY_DASHED: [3, 6],                 //  \tikzstyle{loosely dashed}=          [dash pattern=on 3pt off 6pt]
    DASHDOTTED: [3, 2, 0.5, 2],             //  \tikzstyle{dashdotted}=              [dash pattern=on 3pt off 2pt on \the\pgflinewidth off 2pt]
    DENSELY_DASHDOTTED: [3, 1, 0.5, 1],     //  \tikzstyle{densely dashdotted}=      [dash pattern=on 3pt off 1pt on \the\pgflinewidth off 1pt]
    LOOSELY_DASHDOTTED: [3, 4, 0.5, 4]      //  \tikzstyle{loosely dashdotted}=      [dash pattern=on 3pt off 4pt on \the\pgflinewidth off 4pt]
}

class Shape {
    constructor() {
        this.stroke = COLOR[$("#defaultStrokeInput").val().toUpperCase()];
        this.fill = COLOR[$("#defaultFillInput").val().toUpperCase()];
        this.strokeWeight = LINE_WIDTH[$("#defaultLinewidthInput").val()];
        this.linedash = LINE_DASH[$("#defaultLinedashInput").val()];
    }

    setStroke(stroke) {
        this.stroke = stroke;
    }

    setFill(fill) {
        this.fill = fill;
    }

    setStrokeWeight(strokeWeight) {
        this.strokeWeight = strokeWeight;
    }

    setLinedash(linedash) {
        this.linedash = linedash;
    }

    draw() {
        this.stroke === COLOR.NONE ? noStroke() : stroke(this.stroke);
        strokeWeight(this.strokeWeight);
        this.fill === COLOR.NONE.toUpperCase() ? noFill() : fill(this.fill);
        drawingContext.setLineDash(this.linedash);
    }

    static setProperties(shape, content) {
        shape.stroke = content.stroke
        shape.fill = content.fill;
        shape.strokeWeight = content.strokeWeight;
        shape.linedash = content.linedash;
    }

}

class Point extends Shape {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
    }

    draw() {
        push();
        super.draw();
        circle(this.x, this.y, 5)
        pop()
    }

    latex() {
        //      \draw[draw=blue, fill=red] (-1,2) circle (5pt)
        if (this.fill === COLOR.NONE) {
            return `\\draw[draw=${getKey(COLOR, this.stroke).toLowerCase()}, ${getKey(LINE_WIDTH, this.strokeWeight).toLowerCase()}, ${keyLC(getKey(LINE_DASH, this.linedash))}] (${this.x / gd},${-this.y / gd}) circle (5pt);`
        }
        return `\\draw[draw=${getKey(COLOR, this.stroke).toLowerCase()}, fill=${getKey(COLOR, this.fill).toLowerCase()}, ${keyLC(getKey(LINE_WIDTH, this.strokeWeight))}, ${keyLC(getKey(LINE_DASH, this.linedash))}] (${this.x / gd},${-this.y / gd}) circle (5pt);`
    }

    static fromJSON(content) {
        const point = new Point(0, 0);
        // properties from shape
        Shape.setProperties(point, content)

        // properties from point
        point.x = content.x
        point.y = content.y

        return point;
    }
}

const ARROW = {
    NONE: "-",
    START: "->",
    END: "<-",
    BOTH: "<->"
}

const ARROW_TIPS = {
    STEALTH: "stealth",
    STEALTH_RESERVED: "stealth reversed",
    STEALTH_OPEN: "{Stealth[open]}",                    // arrows.meta
    TO: "to",
    TO_RESERVED: "to reversed",
    LATEX: "latex",
    LATEX_RESERVED: "latex reserved",
    LATEX_OPEN: "{Latex[open]}",                        // arrows.meta
    VERTICAL: "|"
}

class Line extends Shape {

    constructor(start, end) {
        super();
        this.start = start;
        this.end = end;
        this.arrow = ARROW[$("#defaultArrowInput").val()];
        this.tips = {
            head: ARROW_TIPS[$("#defaultArrowTipHeadInput").val()],
            tail: ARROW_TIPS[$("#defaultArrowTipTailInput").val()]
        }
    }

    draw() {
        push();
        super.draw();

        switch (this.arrow) {
            case ARROW.START:
                this.drawArrowHead(this.start, this.end, this.tips.head);
                this.drawArrowLine(this.start, this.end, this.arrow, this.tips.head);
                break;
            case ARROW.END:
                this.drawArrowHead(this.end, this.start, this.tips.tail);
                this.drawArrowLine(this.end, this.start, this.arrow, this.tips.tail);
                break;
            case ARROW.BOTH:
                this.drawArrowHead(this.start, this.end, this.tips.head);
                this.drawArrowHead(this.end, this.start, this.tips.tail);
                this.drawArrowLine(this.end, this.start, this.arrow, this.tips);
                break;
            case ARROW.NONE:
                // draw the line between the points
                line(this.start.x, this.start.y, this.end.x, this.end.y);
                break;
        }

        pop();
    }

    latex() {
        //      \draw[draw=blue] (-1,2) -- (2,-4);
        let arrow = this.arrow === ARROW.NONE ? "" : ", " + this.arrow.replace(">", this.tips.head).replace("<", this.tips.tail)
        return `\\draw[draw=${getKey(COLOR, this.stroke).toLowerCase()}${arrow}, ${keyLC(getKey(LINE_WIDTH, this.strokeWeight))}, ${keyLC(getKey(LINE_DASH, this.linedash))}] (${this.start.x / gd},${-this.start.y / gd}) -- (${this.end.x / gd},${-this.end.y / gd});`
    }

    drawArrowLine(start, end, arrow, tip) {
        let arrowSize = 8 * (this.strokeWeight / 2);
        push();
        translate(start.x, start.y);
        stroke(this.stroke);
        let ending = createVector(end.x - start.x, end.y - start.y);
        rotate(ending.heading());
        translate(ending.mag(), 0);

        let dS = -arrowSize;
        let dE = -(dist(this.start.x, this.start.y, this.end.x, this.end.y));

        switch (arrow) {
            case ARROW.START:
            case ARROW.END:
                switch (tip) {
                    case ARROW_TIPS.STEALTH:
                    case ARROW_TIPS.STEALTH_OPEN:
                        dS = -arrowSize / 2
                        break;
                    case ARROW_TIPS.TO:
                        dS = -arrowSize / 16
                        break;
                    case ARROW_TIPS.VERTICAL:
                        dS = 0
                        break;
                }
                break;
            case ARROW.BOTH:
                switch (tip.end) {
                    case ARROW_TIPS.STEALTH:
                    case ARROW_TIPS.STEALTH_OPEN:
                        dS = -arrowSize / 2
                        break;
                    case ARROW_TIPS.TO:
                        dS = -arrowSize / 16
                        break;
                    case ARROW_TIPS.TO_RESERVED:
                        dS = -arrowSize + arrowSize / 16
                        break;
                    case ARROW_TIPS.VERTICAL:
                        dS = 0
                        break;
                }
                switch (tip.start) {
                    case ARROW_TIPS.STEALTH:
                    case ARROW_TIPS.STEALTH_OPEN:
                    case ARROW_TIPS.STEALTH_RESERVED:
                        dE = -(dist(this.start.x, this.start.y, this.end.x, this.end.y)) + arrowSize / 2
                        break;
                    case ARROW_TIPS.TO:
                        dE = -(dist(this.start.x, this.start.y, this.end.x, this.end.y)) + arrowSize / 16
                        break;
                    case ARROW_TIPS.TO_RESERVED:
                        dE = -(dist(this.start.x, this.start.y, this.end.x, this.end.y)) + arrowSize - arrowSize / 16
                        break;
                    case ARROW_TIPS.LATEX_OPEN:
                        dE = -(dist(this.start.x, this.start.y, this.end.x, this.end.y)) + arrowSize
                        break;
                }
                break;
        }

        line(dS, 0, dE, 0)

        pop()
    }

    drawArrowHead(start, end, tip) {
        let arrowSize = 8 * (this.strokeWeight / 2);
        push();
        // disable linedash in line for arrow heads
        drawingContext.setLineDash([]);

        translate(start.x, start.y);
        stroke(this.stroke);

        let nofill = [ARROW_TIPS.LATEX_OPEN, ARROW_TIPS.STEALTH_OPEN];
        nofill.some(e => tip.includes(e)) ? noFill() : fill(this.stroke); // to fill the arrow head

        let ending = createVector(end.x - start.x, end.y - start.y);
        rotate(ending.heading());
        translate(ending.mag(), 0);
        switch (tip) {
            case ARROW_TIPS.STEALTH:
            case ARROW_TIPS.STEALTH_OPEN:
                beginShape()
                vertex(0, 0)
                vertex(-arrowSize, arrowSize)
                vertex(-arrowSize / 2, 0)
                vertex(-arrowSize, -arrowSize)
                endShape(CLOSE)
                break;
            case ARROW_TIPS.STEALTH_RESERVED:
                beginShape()
                vertex(0, -arrowSize)
                vertex(-arrowSize, 0)
                vertex(0, arrowSize)
                vertex(-arrowSize / 2, 0)
                endShape(CLOSE)
                break;
            case ARROW_TIPS.LATEX:
            case ARROW_TIPS.LATEX_OPEN:
                beginShape()
                vertex(-arrowSize, arrowSize)
                vertex(-arrowSize, -arrowSize)
                vertex(0, 0)
                endShape(CLOSE)
                break;
            case ARROW_TIPS.LATEX_RESERVED:
                beginShape()
                vertex(0, -arrowSize)
                vertex(0, arrowSize)
                vertex(-arrowSize, 0)
                endShape(CLOSE)
                break;
            case ARROW_TIPS.TO:
                beginShape()
                vertex(0, 0)
                vertex(-arrowSize, arrowSize)
                vertex(-arrowSize / 16, 0)
                vertex(-arrowSize, -arrowSize)
                endShape(CLOSE)
                break;
            case ARROW_TIPS.TO_RESERVED:
                beginShape()
                vertex(0, -arrowSize)
                vertex(-arrowSize + arrowSize / 16, 0)
                vertex(0, arrowSize)
                vertex(-arrowSize, 0)
                endShape(CLOSE)
                break;
            case ARROW_TIPS.VERTICAL:
                beginShape()
                vertex(0, arrowSize)
                vertex(0, -arrowSize)
                endShape(CLOSE)
                break;
        }

        pop();
    }

    static fromJSON(content) {
        const line = new Line(new Vector(0, 0), new Vector(0, 0));
        // properties from shape
        Shape.setProperties(line, content)

        // properties from line
        line.start = Vector.constructorV(content.start);
        line.end = Vector.constructorV(content.end);
        line.arrow = content.arrow
        line.tips = content.tips

        return line;
    }

}


class Ellipse extends Shape {
    constructor(start, end) {
        super();
        this.start = start;
        this.end = end;
    }

    draw() {
        push();
        super.draw();
        let {center, diameter} = Ellipse.getCenterDiameter(this.start, this.end)
        ellipse(center.x, center.y, diameter.x, diameter.y);
        pop();
    }

    latex() {
        let {center, diameter} = Ellipse.getCenterDiameter(this.start, this.end)
        //      \draw (0,0) ellipse (2cm and 1cm);
        if (this.fill === COLOR.NONE) {
            return `\\draw[draw=${getKey(COLOR, this.stroke).toLowerCase()}, ${keyLC(getKey(LINE_WIDTH, this.strokeWeight))}, ${keyLC(getKey(LINE_DASH, this.linedash))}] (${center.x / gd},${-center.y / gd}) ellipse (${diameter.x / (2 * gd)} and ${diameter.y / (2 * gd)});`

        }
        return `\\draw[draw=${getKey(COLOR, this.stroke).toLowerCase()}, fill=${getKey(COLOR, this.fill).toLowerCase()}, ${keyLC(getKey(LINE_WIDTH, this.strokeWeight))}, ${keyLC(getKey(LINE_DASH, this.linedash))}] (${center.x / gd},${-center.y / gd}) ellipse (${diameter.x / (2 * gd)} and ${diameter.y / (2 * gd)});`
    }

    static fromJSON(content) {
        const ellipse = new Ellipse(new Vector(0, 0), new Vector(0, 0));
        // properties from shape
        ellipse.stroke = content.stroke
        ellipse.fill = content.fill;
        ellipse.strokeWeight = content.strokeWeight;
        ellipse.linedash = content.linedash;

        // properties from ellipse
        ellipse.start = Vector.constructorV(content.start);
        ellipse.end = Vector.constructorV(content.end);

        return ellipse;
    }

    // fix drawing w/ negative coordination
    static getCenterDiameter(start, end) {
        let center = {
            x: start.x + (end.x - start.x) / 2,
            y: start.y + (end.y - start.y) / 2
        };
        let diameter = {
            x: end.x - start.x,
            y: end.y - start.y
        };
        return {center, diameter}
    }
}

class Rectangle extends Shape {
    constructor(start, end) {
        super();
        this.start = start;
        this.end = end;
    }

    draw() {
        push();
        super.draw();
        rectMode(CORNERS);
        rect(this.start.x, this.start.y, this.end.x, this.end.y);
        pop();
    }

    latex() {
        //       \draw [draw=black, fill=red] (0.0) rectangle (1,1);
        if (this.fill === COLOR.NONE) {
            return `\\draw[draw=${getKey(COLOR, this.stroke).toLowerCase()}, ${keyLC(getKey(LINE_WIDTH, this.strokeWeight))}, ${keyLC(getKey(LINE_DASH, this.linedash))}] (${this.start.x / gd},${-this.start.y / gd}) rectangle (${this.end.x / gd},${-this.end.y / gd});`
        }
        return `\\draw[draw=${getKey(COLOR, this.stroke).toLowerCase()}, fill=${getKey(COLOR, this.fill).toLowerCase()}, ${keyLC(getKey(LINE_WIDTH, this.strokeWeight))}, ${keyLC(getKey(LINE_DASH, this.linedash))}] (${this.start.x / gd},${-this.start.y / gd}) rectangle (${this.end.x / gd},${-this.end.y / gd});`
    }

    static fromJSON(content) {
        const rectangle = new Rectangle(new Vector(0, 0), new Vector(0, 0));
        // properties from shape
        Shape.setProperties(rectangle, content)

        // properties from rectangle
        rectangle.start = Vector.constructorV(content.start);
        rectangle.end = Vector.constructorV(content.end);

        return rectangle;
    }
}

class Bezier extends Shape {
    constructor(start, end) {
        super();
        this.start = start;
        this.end = end;
        this.controls = {
            p1: new Vector((2 * this.start.x + this.end.x) / 3, (2 * this.start.y + this.end.y) / 3),
            p2: new Vector((this.start.x + 2 * this.end.x) / 3, (this.start.y + 2 * this.end.y) / 3)
        }
    }

    draw() {
        push();
        super.draw();
        bezier(this.start.x, this.start.y, this.controls.p1.x, this.controls.p1.y, this.controls.p2.x, this.controls.p2.y, this.end.x, this.end.y)
        pop();
    }

    latex() {
        //       \draw [draw=black] (0,0) .. controls (1,2) and (2,-2) .. (3,0);
        if (this.fill === COLOR.NONE) {
            return `\\draw[draw=${getKey(COLOR, this.stroke).toLowerCase()}, ${keyLC(getKey(LINE_WIDTH, this.strokeWeight))}, ${keyLC(getKey(LINE_DASH, this.linedash))}] (${this.start.x / gd},${-this.start.y / gd}) .. controls (${this.controls.p1.x / gd}, ${-this.controls.p1.y / gd}) and (${this.controls.p2.x / gd}, ${-this.controls.p2.y / gd}) .. (${this.end.x / gd},${-this.end.y / gd});`
        }
        return `\\draw[draw=${getKey(COLOR, this.stroke).toLowerCase()}, fill=${getKey(COLOR, this.fill).toLowerCase()}, ${keyLC(getKey(LINE_WIDTH, this.strokeWeight))}, ${keyLC(getKey(LINE_DASH, this.linedash))}] (${this.start.x / gd},${-this.start.y / gd}) .. controls (${this.controls.p1.x / gd}, ${-this.controls.p1.y / gd}) and (${this.controls.p2.x / gd}, ${-this.controls.p2.y / gd}) .. (${this.end.x / gd},${-this.end.y / gd});`
    }

    static fromJSON(content) {
        const bezier = new Bezier(new Vector(0, 0), new Vector(0, 0));
        // properties from shape
        Shape.setProperties(bezier, content)

        // properties from bezier
        bezier.start = Vector.constructorV(content.start);
        bezier.end = Vector.constructorV(content.end);
        bezier.controls.p1 = Vector.constructorV(content.controls.p1)
        bezier.controls.p2 = Vector.constructorV(content.controls.p2)

        return bezier;
    }
}

class Grid extends Shape {
    constructor(start, end) {
        super();
        this.start = start;
        this.end = end;
    }

    draw() {
        push();
        super.draw();

        for (let i = min(this.start.x, this.end.x); i <= max(this.start.x, this.end.x); i += gd) {
            line(i, this.start.y, i, this.end.y)
        }
        for (let i = min(this.start.y, this.end.y); i <= max(this.start.y, this.end.y); i += gd) {
            line(this.start.x, i, this.end.x, i)
        }
        pop();
    }

    latex() {
        return `\\draw[draw=${getKey(COLOR, this.stroke).toLowerCase()}, ${keyLC(getKey(LINE_WIDTH, this.strokeWeight))}, ${keyLC(getKey(LINE_DASH, this.linedash))}]  (${this.start.x / gd},${-this.start.y / gd}) grid (${this.end.x / gd},${-this.end.y / gd});`
    }

    static fromJSON(content) {
        const grid = new Grid(new Vector(0, 0), new Vector(0, 0));
        // properties from shape
        Shape.setProperties(grid, content)

        // properties from grid
        grid.start = Vector.constructorV(content.start);
        grid.end = Vector.constructorV(content.end);

        return grid;
    }

}

class Arc extends Shape {
    constructor(start, end) {
        super();
        this.start = start;
        this.end = end;
        this.angles = {
            start: $("#defaultArcStartInput").val(),
            end: $("#defaultArcEndInput").val()
        }
    }

    draw() {
        push();
        super.draw();
        let {center, diameter} = Ellipse.getCenterDiameter(this.start, this.end)
        arc(center.x, center.y, diameter.x, diameter.y, radians(-this.angles.end), radians(-this.angles.start), OPEN);
        pop();
    }

    latex() {
        let {center, diameter} = Ellipse.getCenterDiameter(this.start, this.end)
        //      \draw (0,0) arc (2cm and 1cm);
        if (this.fill === COLOR.NONE) {
            return `\\draw[draw=${getKey(COLOR, this.stroke).toLowerCase()}, ${keyLC(getKey(LINE_WIDTH, this.strokeWeight))}, ${keyLC(getKey(LINE_DASH, this.linedash))}] ([shift=(${this.angles.start}:${diameter.x / (2 * gd)} and ${diameter.y / (2 * gd)})]${center.x / gd},${-center.y / gd}) arc (${this.angles.start}:${this.angles.end}:${diameter.x / (2 * gd)} and ${diameter.y / (2 * gd)});`

        }
        return `\\draw[draw=${getKey(COLOR, this.stroke).toLowerCase()}, fill=${getKey(COLOR, this.fill).toLowerCase()}, ${keyLC(getKey(LINE_WIDTH, this.strokeWeight))}, ${keyLC(getKey(LINE_DASH, this.linedash))}] ([shift=(${this.angles.start}:${diameter.x / (2 * gd)} and ${diameter.y / (2 * gd)})]${center.x / gd},${-center.y / gd}) arc (${this.angles.start}:${this.angles.end}:${diameter.x / (2 * gd)} and ${diameter.y / (2 * gd)});`
    }

    static fromJSON(content) {
        const arc = new Arc(new Vector(0, 0), new Vector(0, 0));
        // properties from shape
        Shape.setProperties(arc, content)

        // properties from arc
        arc.start = Vector.constructorV(content.start);
        arc.end = Vector.constructorV(content.end);
        arc.angles.start = Vector.constructorV(content.angles.start);
        arc.angles.end = Vector.constructorV(content.angles.end);

        return arc;
    }

}

class Parabola extends Shape {
    constructor(start, end) {
        super();
        this.start = start;
        this.end = end;
    }

    draw() {
        push();
        super.draw();
        // y = a(x - x0)^2 + y0, x in [x0, y0], where a = (y1 - y0) / (x1 - x0)^2
        let a = (this.end.y - this.start.y) / pow(this.end.x - this.start.x, 2)
        if (isFinite(a)) {
            beginShape();
            for (let i = min(this.start.x, this.end.x); i <= max(this.start.x, this.end.x); i += 0.25) {
                vertex(i, a * (pow(i - this.start.x, 2)) + this.start.y)
            }
            endShape();
        } else {
            line(this.start.x, this.start.y, this.end.x, this.end.y)
        }

        pop();
    }

    latex() {
        //       \draw [draw=black, fill=red] (0,0) parabola (1,1);
        if (this.fill === COLOR.NONE) {
            return `\\draw[draw=${getKey(COLOR, this.stroke).toLowerCase()}, ${keyLC(getKey(LINE_WIDTH, this.strokeWeight))}, ${keyLC(getKey(LINE_DASH, this.linedash))}] (${this.start.x / gd},${-this.start.y / gd}) parabola (${this.end.x / gd},${-this.end.y / gd});`
        }
        return `\\draw[draw=${getKey(COLOR, this.stroke).toLowerCase()}, fill=${getKey(COLOR, this.fill).toLowerCase()}, ${keyLC(getKey(LINE_WIDTH, this.strokeWeight))}, ${keyLC(getKey(LINE_DASH, this.linedash))}] (${this.start.x / gd},${-this.start.y / gd}) parabola (${this.end.x / gd},${-this.end.y / gd});`
    }

    static fromJSON(content) {
        const parabola = new Parabola(new Vector(0, 0), new Vector(0, 0));
        // properties from shape
        Shape.setProperties(parabola, content)

        // properties from parabola
        parabola.start = Vector.constructorV(content.start);
        parabola.end = Vector.constructorV(content.end);

        return parabola;
    }
}

// TODO implement text
class Text
    extends Shape {
    constructor(start) {
        super();
        this.start = start;
        this.text = '\\dot{\\theta}_{i} = \\omega_{i} + \\frac{K}{N}  \\displaystyle\\sum_{j=1}^N \\sin(\\theta_{j} - \\theta_{i})';
        this.rendered = createP();
        katex.render(this.text, this.rendered.elt)

    }

    draw() {
        this.rendered.style('font-size', '20px')
        let mouseP = calcRPos()
        this.rendered.position(mouseP.x, mouseP.y)
        text(this.rendered.elt.innerHTML, mouseP.x, mouseP.y)


    }
}

class Polygon extends Shape {
    // TODO implement polygon
    constructor(points) {
        super();
        this.points = points;

    }
}


/*
        GRID DRAW
 */
function drawHelpingGrid() {
    push();

    stroke(125);
    strokeWeight(0.2);
    let x = Math.floor(width / gd);
    let y = Math.floor(height / gd);

    // vertical lines
    for (let xi = 0; xi <= x; xi += 1) {
        line(xi * gd, height, xi * gd, -height)
        line(-xi * gd, height, -xi * gd, -height)
    }
    // horizontal lines
    for (let yi = 0; yi <= y; yi += 1) {
        line(width, yi * gd, -width, yi * gd);
        line(width, -yi * gd, -width, -yi * gd);
    }
    pop();
}

/*
        ZOOM CONTROLS
 */

// add zoom event listeners
window.mousePressed = e => Controls.moveCanvas().mousePressed(e);
window.mouseDragged = e => Controls.moveCanvas().mouseDragged(e);
window.mouseReleased = e => Controls.moveCanvas().mouseReleased(e);

class Controls {
    static moveCanvas() {
        function mousePressed(e) {
            if (_mode === MODES.SELECT) {
                ZOOM_CONTROLS.VIEW_POSITION = {
                    isDragging: true,
                    prevX: e.clientX,
                    prevY: e.clientY
                };
            }
        }

        function mouseDragged(e) {
            if (_mode === MODES.SELECT) {
                const {prevX, prevY, isDragging} = ZOOM_CONTROLS.VIEW_POSITION;
                if (!isDragging) return;

                const pos = {x: e.clientX, y: e.clientY};
                const dx = pos.x - prevX;
                const dy = pos.y - prevY;

                if (prevX || prevY) {
                    ZOOM_CONTROLS.VIEW.x += dx;
                    ZOOM_CONTROLS.VIEW.y += dy;
                    ZOOM_CONTROLS.VIEW_POSITION.prevX = pos.x;
                    ZOOM_CONTROLS.VIEW_POSITION.prevY = pos.y
                }
            }
        }

        function mouseReleased(e) {
            if (_mode === MODES.SELECT) {
                ZOOM_CONTROLS.VIEW_POSITION.isDragging = false;
                ZOOM_CONTROLS.VIEW_POSITION.prevX = null;
                ZOOM_CONTROLS.VIEW_POSITION.prevY = null;
            }
        }

        return {
            mousePressed,
            mouseDragged,
            mouseReleased
        }
    }

    static zoomCanvas() {

        function zoom(e) {
            if (_mode === MODES.SELECT) {
                const {x, y, deltaY} = e;
                const direction = deltaY > 0 ? -1 : 1;
                const zoom = 0.05 * direction;

                const wx = (x - ZOOM_CONTROLS.VIEW.x) / (width * ZOOM_CONTROLS.VIEW.zoom);
                const wy = (y - ZOOM_CONTROLS.VIEW.y) / (height * ZOOM_CONTROLS.VIEW.zoom);

                if (ZOOM_CONTROLS.VIEW.zoom + zoom < 0.5) return;

                ZOOM_CONTROLS.VIEW.x -= wx * width * zoom;
                ZOOM_CONTROLS.VIEW.y -= wy * height * zoom;
                ZOOM_CONTROLS.VIEW.zoom += zoom;
            }
        }

        return {zoom}
    }
}

/*
        TOOLBAR HANDLER
 */

$('input[name="toolbar_button"]').on('click', function (e) {
    _mode = e.target.id;

    DRAW_VARS.CURRENTLY_DRAWN = undefined;
    DRAW_VARS.CURRENTLY_DRAWING = false;

    MOVE_VARS.ENABLED = false;
    MOVE_VARS.POINT_MAPPING = [];
    MOVE_VARS.SELECTED_POINTS = [];
    MOVE_VARS.DRAGGED_POINT= undefined;

    $("#edit_menu").hide();
    $("#defaultProperties").hide();
    $("#arrowProperties").hide();
    $("#arcProperties").hide();

    if (_mode === MODES.EDIT) {
        $("#edit_menu").show();
        $("#defaultProperties").show();
        $("#point").prop('checked', true);
    } else if (_mode === MODES.MOVE) {
        if (!MOVE_VARS.ENABLED)
            moveSetup();
    } else {
        DRAW_VARS.CURRENTLY_DRAWING = false;
    }

});

$('input[name="edit_button"]').on('click', function (e) {
    if (e.target.id === DRAWABLE_SHAPES.LINE) {
        $("#arrowProperties").show();
    } else {
        $("#arrowProperties").hide();
    }
    if (e.target.id === DRAWABLE_SHAPES.ARC) {
        $("#arcProperties").show();
    } else {
        $("#arcProperties").hide();
    }

});

/*
        COLORPICKER
 */

class ColorPicker {

    constructor(ci) {
        this.id = ci;

        this.colorInput = $("#" + this.id);
        this.colorPalette = $("<div>").attr('id', `${this.id}palette`).addClass("palette");
        this.colorInput.parent().append(this.colorPalette);

        this.colorInput.on('click', e => this.showColorPalette());
        this.colorInput.on('focusout', e => this.hideColorPalette());

        this.colorPalette.on("mouseover", e => this.mouseOver());
        this.colorPalette.on('mouseout', e => this.mouseOut());
        this.colorPalette.mouseIsOver = false;
        this.colorPalette.isShown = false;

        // fill color palette in constructor
        for (const [key, value] of Object.entries(COLOR)) {
            if (key !== "toHex") {
                this.colorPalette.append(`<div id="${this.id}${key.toLowerCase()}" class="color-option" style="background-color:${value}">${key === "NONE" ? '<span style="color: red">x</span>' : ''}</div>`);
            }
        }

        this.colorInput.css("border-right-color", `${COLOR[this.colorInput.val().toUpperCase()]}`);
    }

    mouseOver() {
        this.colorPalette.mouseIsOver = true;
    }

    mouseOut() {
        this.colorPalette.mouseIsOver = false;
    }

    hideColorPalette() {
        if (!this.colorPalette.mouseIsOver) {
            this.colorPalette.css("display", 'none');
            this.colorPalette.isShown = false;
        }
    }

    showColorPalette() {
        if (!this.colorPalette.isShown) {
            this.colorPalette.css("display", 'block');
            this.colorPalette.isShown = true;
        } else {
            this.colorPalette.css("display", 'none');
            this.colorPalette.isShown = false;
        }
    }
}

let colorpickers = [];
for (let colorpicker of $(".color-input")) {
    colorpickers.push(new ColorPicker(colorpicker.id))
}

$(".color-option").on('click', function (e) {
    colorpickers.forEach(cp => {
        if (e.target.id.includes(cp.id)) {
            let color = COLOR.toHex(e.target.style.backgroundColor)
            cp.colorInput.css("border-right-color", color)
            cp.colorInput.val(capitalize(getKey(COLOR, color)))
            cp.colorPalette.css("display", "none")
            cp.colorPalette.isShown = false
        }
    });
});

const capitalize = ([first, ...rest]) => first.toUpperCase() + rest.join('').toLowerCase().replace("_", " ");
const keyLC = value => value.toLowerCase().replace("_", " ");

// todo make function
for (const [key] of Object.entries(LINE_WIDTH)) {
    let width_o = $(`<option value="${key}">${capitalize(key)}</option>`);

    if (key === "THIN") {
        width_o.attr('selected', 'selected')
    }

    $("#defaultLinewidthInput").append(width_o);
}
for (const [key] of Object.entries(LINE_DASH)) {
    let dash_o = $(`<option value="${key}">${capitalize(key)}</option>`);

    if (key === "SOLID") {
        dash_o.attr('selected', 'selected')
    }

    $("#defaultLinedashInput").append(dash_o);
}
for (const [key] of Object.entries(ARROW)) {
    let arrow_o = $(`<option value="${key}">${capitalize(key)}</option>`);

    if (key === "NONE") {
        arrow_o.attr('selected', 'selected')
    }

    $("#defaultArrowInput").append(arrow_o);
}
for (const [key] of Object.entries(ARROW_TIPS)) {
    let tip_h_o = $(`<option value="${key}">${capitalize(key)}</option>`);

    if (key === "LATEX") {
        tip_h_o.attr('selected', 'selected')
    }

    $("#defaultArrowTipHeadInput").append(tip_h_o);


    let tip_t_o = $(`<option value="${key}">${capitalize(key)}</option>`);

    if (key === "LATEX") {
        tip_t_o.attr('selected', 'selected')
    }

    $("#defaultArrowTipTailInput").append(tip_t_o);
}
// todo end

/*
        TODO        IMPLEMENT FRONT
 */
function parse2String() {
    let json = [];
    for (let shape of SHAPES_DATABASE) {
        json.push({
            "type": shape.constructor.name,
            "content": shape
        });
    }
    json = JSON.stringify(json);
    return json;
}

function parse2Class(json) {
    let parsed_json = JSON.parse(json);

    SHAPES_DATABASE.length = 0;

    parsed_json.forEach(element => {
        print(element)
        switch (element.type.toLowerCase()) {
            case DRAWABLE_SHAPES.POINT:
                SHAPES_DATABASE.push(Point.fromJSON(element.content));
                break;
            case DRAWABLE_SHAPES.LINE:
                SHAPES_DATABASE.push(Line.fromJSON(element.content));
                break;
            case DRAWABLE_SHAPES.ELLIPSE:
                SHAPES_DATABASE.push(Ellipse.fromJSON(element.content));
                break;
            case DRAWABLE_SHAPES.RECTANGLE:
                SHAPES_DATABASE.push(Rectangle.fromJSON(element.content));
                break;
            case DRAWABLE_SHAPES.BEZIER:
                SHAPES_DATABASE.push(Bezier.fromJSON(element.content));
                break;
            case DRAWABLE_SHAPES.GRID:
                SHAPES_DATABASE.push(Grid.fromJSON(element.content));
                break;
            case DRAWABLE_SHAPES.ARC:
                SHAPES_DATABASE.push(Arc.fromJSON(element.content));
                break;
            case DRAWABLE_SHAPES.PARABOLA:
                SHAPES_DATABASE.push(Parabola.fromJSON(element.content));
                break;
        }
    });
}

const parse2BASE64 = str => btoa(unescape(encodeURIComponent(str)));
const parseBASE64 = b64 => decodeURIComponent(escape(atob(b64)));

const printTikz = () => {
    let latex = "";
    SHAPES_DATABASE.forEach(e => latex += e.latex() + "\n");
    print(latex)
}
