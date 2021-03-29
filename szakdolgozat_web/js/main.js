// 'use strict';

//let width = document.getElementById("canvas").offsetWidth;
/*
    temp config
 */
let width = 600;
let height = 600;
let xv = 20;
let yv = 20;


function setup() {
    createCanvas(width, height).parent("canvas");
}


function drawCanvas() {
    background(255);
    stroke(0)
    graphAxis();
    strokeWeight(1);
    noFill();
    stroke(random(200), random(200), random(200));
    equation(document.getElementById("math_input").value)
    console.log(document.getElementById("math_input").value)
}


function graphAxis() {
    line(width / 2, 0, width / 2, height)
    line(0, height / 2, width, height / 2)

    let x = Math.floor(width / xv);
    let y = Math.floor(height / yv);
    stroke(220);

    for (let i = 0; i < x; i++) {
        line(i * xv, 0, i * xv, height)
    }
    for (let j = 0; j < y; j++) {
        line(0, j * yv, width, j * yv)
    }
}


function equation(str) {
    translate(width / 2, height / 2)
	let x = Math.floor(width / xv); // number of points
    if (typeof str == "string") {
        // str = str.replace(/\s/g, '');  // space
        str = str.replace(/[\^]/g, '**'); // pow
        beginShape()
        for (let xi = -x / 2; xi < x / 2; xi += 0.25) {
            try {
                const calculate = new Function('x', 'return ' + str);
                // console.log("xi=" + xi + " --- " + calculate(xi));
                vertex(xi * xv, -xv * calculate(xi)); // draw
            } catch (err) {
                console.log(err)
            }
        }
        endShape();
        resetMatrix();
    }
}

