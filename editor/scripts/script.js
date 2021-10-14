'use strict';

/*
        VARIABLES
 */
let _draw;
let _mode;
let _parse = [];

let THINGS_TO_DRAW = [] // placeholder thingy

/*
    COLOR ENUM
    18 predefined by latex
 */
const COLOR = {
    BLACK: "#000000",
    BLUE: "#0000FF",
    BROWN: "#88540B",
    CYAN: "#00FFFF",
    DARKGRAY: "#A9A9A9",
    GRAY: "#808080",
    GREEN: "#00FF00",
    LIGHTGRAY: "#D3D3D3",
    LIME: "#32CD32",
    MAGENTA: "#FF00FF",
    OLIVE: "#808000",
    ORANGE: "#FF7F00",
    PINK: "#FFC0CB",
    PURPLE: "#800080",
    RED: "#FF0000",
    TEAL: "#008080",
    VIOLET: "#8F00FF",
    YELLOW: "#FFFF00"
}

const controls = {
    view: {x: 0, y: 0, zoom: 1},
    viewPos: {prevX: null, prevY: null, isDragging: false},
}

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
    canvas.mousePressed(startDrawing)
    canvas.mouseReleased(endDrawing)
    canvas.mouseWheel(e => Controls.zoom(controls).worldZoom(e))

    _mode = $('input[name="toolbar_button"]:checked')[0].id

}


function calculateRealMousePos(){
    let ctlX = -controls.view.x / controls.view.zoom;
    let ctlY = -controls.view.y / controls.view.zoom;

    let mouseRealX = map(mouseX, 0, width, ctlX, ctlX + width/controls.view.zoom);
    let mouseRealY = map(mouseY, 0, height, ctlY, ctlY + height/controls.view.zoom);

    return {x: mouseRealX, y: mouseRealY};
}

window.mousePressed = e => Controls.move(controls).mousePressed(e)
window.mouseDragged = e => Controls.move(controls).mouseDragged(e);
window.mouseReleased = e => Controls.move(controls).mouseReleased(e)

function windowResized() {
    let c = $("#canvas")
    let w = c.width();
    let h = c.height();
    resizeCanvas(w, h);
}

let p;
let drawing = false;
let drawable = null;

function draw() {
    background(255);
    translate(controls.view.x, controls.view.y);
    scale(controls.view.zoom)
    parseDraws()
    drawGrid();
    stroke(0);
    THINGS_TO_DRAW.forEach(e => e.draw())

    // DEBUG
    // text("(" + (calculateRealMousePos().x) + ", " + (calculateRealMousePos().y) + ")", calculateRealMousePos().x, calculateRealMousePos().y);

    if (drawable != null) drawable.draw();
    if (mouseIsPressed && (0 <= calculateRealMousePos().x <= width) && (0 <= calculateRealMousePos().y <= height)) {
        if (drawing) {
            switch (_draw) {
                case "line":
                case "arrow":
                    drawable = new Line(new Vector(p.x, p.y), new Vector(calculateRealMousePos().x, calculateRealMousePos().y));
                    break;
                case "ellipse":
                    drawable = new Ellipse(new Vector(p.x, p.y), new Vector(calculateRealMousePos().x, calculateRealMousePos().y));
                    break;
                case "rectangle":
                    drawable = new Rectangle(new Vector(p.x, p.y), new Vector(calculateRealMousePos().x, calculateRealMousePos().y));
                    break;
            }
        }
    }
}

function startDrawing() {
    _draw = $('input[name="menu_button"]:checked')[0].id

    if (_mode === 'select' && mouseButton === CENTER) {
        controls.view = {x: 0, y: 0, zoom: 1}
        controls.viewPos = {prevX: null, prevY: null, isDragging: false}
        resetMatrix();
    }

    if (_mode !== 'edit') return;

    if (mouseButton === LEFT && (0 <= calculateRealMousePos().x <= width) && (0 <= calculateRealMousePos().y <= height)) {
        p = new Vector(calculateRealMousePos().x, calculateRealMousePos().y);
        if (_draw === "point") {
            _parse.push({
                "type": _draw,
                "point": p
            });
        } else {
            drawing = true;
        }
    }

    // prevent default
    return false;
}

function endDrawing() {
    if (_draw === "point") return;
    if (_mode !== "edit") return;

    if (mouseButton === LEFT) {
        _parse.push({
            "type": _draw,
            "points": {
                start: p,
                end: new Vector(calculateRealMousePos().x, calculateRealMousePos().y)
            }
        });
    }
    drawing = false;
    drawable = null
    // console.log(calculateRealMousePos().x + " - "+ calculateRealMousePos().y)
}

function parseDraws() {
    _parse.forEach((e) => {
        switch (e.type) {
            case "point":
                THINGS_TO_DRAW.push(new Point(e.point.x, e.point.y));
                break;
            case "line":
                THINGS_TO_DRAW.push(new Line(e.points.start, e.points.end));
                break;
            case "arrow":
                THINGS_TO_DRAW.push(new Arrow(e.points.start, e.points.end));
                break;
            case "ellipse":
                THINGS_TO_DRAW.push(new Ellipse(e.points.start, e.points.end));
                break;
            case "rectangle":
                THINGS_TO_DRAW.push(new Rectangle(e.points.start, e.points.end));
                break;
        }
    })

    _parse.length = 0;
}

/*
        OBJECTS
 */

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Shape {
    constructor() {
        this.stroke = COLOR.BLACK;
        this.fill = COLOR.BLACK;
        this.linedash = []
    }

    setStroke(stroke) {
        this.stroke = stroke;
    }

    setFill(fill) {
        this.fill = fill;
    }

    setLinedash(linedash) {
        this.linedash = linedash;
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
        stroke(this.stroke);
        ellipse(this.x, this.y, 5, 5)
        pop()
    }
}

class Line extends Shape {
    constructor(start, end) {
        super();
        this.start = start;
        this.end = end;
    }

    draw() {
        push();
        stroke(this.stroke);
        line(this.start.x, this.start.y, this.end.x, this.end.y);
        pop();
    }
}

class Arrow extends Line {
    constructor(start, end) {
        super(start, end);
    }

    draw() {
        // arrowhead
        push();
        translate(this.start.x, this.start.y);
        stroke(this.stroke);
        fill(this.stroke); // to fill the arrow head
        let ending = createVector(this.end.x - this.start.x, this.end.y - this.start.y);
        rotate(ending.heading());
        let arrowSize = 7;
        translate(ending.mag() - arrowSize, 0);
        triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
        pop();
        // line
        line(this.start.x, this.start.y, this.end.x, this.end.y);
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
        noFill();
        stroke(this.stroke);
        ellipseMode(CORNERS);
        ellipse(this.start.x, this.start.y, this.end.x, this.end.y);
        pop();
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
        noFill();
        stroke(this.stroke);
        rectMode(CORNERS);
        rect(this.start.x, this.start.y, this.end.x, this.end.y);
        pop();
    }
}


//testing
let p1 = new Vector(400, 500);
let p2 = new Vector(700, 800);
THINGS_TO_DRAW.push(new Point(p1.x, p1.y))
THINGS_TO_DRAW.push(new Point(p2.x, p2.y))
THINGS_TO_DRAW.push(new Ellipse(p1, p2))
let p3 = new Vector(p1.x + ((p2.x - p1.x) / 2), p1.y + ((p2.y - p1.y) / 2))
THINGS_TO_DRAW.push(new Point(p3.x, p3.y)); // center
let p4 = new Vector(p1.x + ((p2.y - p1.y) / 2), p2.y)
THINGS_TO_DRAW.push(new Point(p4.x, p4.y))
THINGS_TO_DRAW.push(new Line(p3, p4))
THINGS_TO_DRAW.push(new Point(0,0))


function linedash(x1, y1, x2, y2, list) {
    drawingContext.setLineDash(list); // set the "dashed line" mode
    line(x1, y1, x2, y2); // draw the line
    drawingContext.setLineDash([]); // reset into "solid line" mode
}


function fillColorOptions() {
    let output = "";
    for (const [key, value] of Object.entries(COLOR)) {
        output += `<option style="background-color:${value} !important; color:${value} !important; ">${key.toLowerCase()}</option>\n`
    }
    $("#stroke").append(output);
    $("#fill").append(output);
    console.log(output);
}


function drawGrid() {
    push();
    translate(width / 2, height / 2);
    let gd = 50;

    stroke(125);
    strokeWeight(0.5);
    let x = Math.floor(width / gd);
    let y = Math.floor(height / gd);

    // vertical lines
    for (let xi = 0; xi <= x/2; xi += 1) {
        line(xi * gd, height/2, xi * gd, -height/2)
        line(-xi * gd, height/2, -xi * gd, -height/2)
    }
    // horizontal lines
    for (let yi = 0; yi <= y/2; yi += 1) {
        line(width/2, yi * gd, -width/2, yi * gd);
        line(width/2, -yi * gd, -width/2, -yi * gd);
    }
    pop();
}

class Controls {
    static move(controls) {
        function mousePressed(e) {
            if (_mode === "select") {
                controls.viewPos.isDragging = true;
                controls.viewPos.prevX = e.clientX;
                controls.viewPos.prevY = e.clientY;
            }
        }

        function mouseDragged(e) {
            if (_mode === "select") {
                const {prevX, prevY, isDragging} = controls.viewPos;
                if (!isDragging) return;

                const pos = {x: e.clientX, y: e.clientY};
                const dx = pos.x - prevX;
                const dy = pos.y - prevY;

                if (prevX || prevY) {
                    controls.view.x += dx;
                    controls.view.y += dy;
                    controls.viewPos.prevX = pos.x;
                    controls.viewPos.prevY = pos.y
                }
            }
        }

        function mouseReleased(e) {
            if (_mode === "select") {
                controls.viewPos.isDragging = false;
                controls.viewPos.prevX = null;
                controls.viewPos.prevY = null;
            }
        }

        return {
            mousePressed,
            mouseDragged,
            mouseReleased
        }
    }

    static zoom(controls) {

        function worldZoom(e) {
            if (_mode === "select") {
                const {x, y, deltaY} = e;
                const direction = deltaY > 0 ? -1 : 1;
                const factor = 0.05;
                const zoom = 1 * direction * factor;

                const wx = (x - controls.view.x) / (width * controls.view.zoom);
                const wy = (y - controls.view.y) / (height * controls.view.zoom);

                if(controls.view.zoom + zoom < 1) return;

                controls.view.x -= wx * width * zoom;
                controls.view.y -= wy * height * zoom;
                controls.view.zoom += zoom;
            }
        }

        return {worldZoom}
    }
}

$('input[name="toolbar_button"]').on('click', function (e) {
    _mode = e.target.id;
});
