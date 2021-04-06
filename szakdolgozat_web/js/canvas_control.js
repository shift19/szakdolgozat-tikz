'use strict';

//let width = document.getElementById("canvas").offsetWidth;


function setup() {
    createCanvas(width, height).parent("canvas");
    $("#canvas").css("width", width+"px");
}



function drawGraphCanvas() {
    background(255);
    stroke(0)
    graphAxis();
    strokeWeight(1);
    noFill();

    let color_select = $( "select[name='color_select[]']" ) // document.getElementsByName("color_select[]");
    let math_inputs =  $( "input[name='math_input[]']" )//document.getElementsByName("math_input[]");

    for (let i = 0; i < math_inputs.length; i++) {
        stroke(color_select[i].value);
        drawEquation(math_inputs[i].value);
        console.log(color_select[i].value + "  ---  " +math_inputs[i].value);
    }
}


function graphAxis() {
    let check_axis = $("#check_axis_equ")  // document.getElementById("check_axis");
    let check_grid = $("#check_grid_equ") // document.getElementById("check_grid");

    if (check_axis.is(':checked')) {
        stroke(100);
        line(width / 2, 0, width / 2, height)
        line(0, height / 2, width, height / 2)
    }

    if (check_grid.is(':checked')) {
        let x = Math.floor(width / xv);
        let y = Math.floor(height / yv);
        stroke(220);

        for (let i = 0; i <= x; i++) {
            line(i * xv, 0, i * xv, height);
        }
        for (let j = 0; j <= y; j++) {
            line(0, j * yv, width, j * yv);
        }
    }
}


function drawEquation(str) {
    translate(width / 2, height / 2)
    let x = Math.floor(width / xv); // number of points
    let wasNaN = false;
    if (typeof str == "string") { // nn
        // str = str.replace(/\s/g, '');  // space
        str = str.replace(/[\^]/g, '**'); // pow

        const calculate = new Function('x', 'return ' + str);
        // let calculate = Function("return " + "function (x) { return "+str+"}")();

        console.log(calculate)
        beginShape();
        for (let xi = -x / 2; xi <= x / 2; xi += 0.01) {
            try {
                // 0.8200000000003275
                xi = Number(xi.toFixed(4))
                let value = calculate(xi);

                if (Number.isNaN(value)) {
                    endShape();
                    wasNaN = true;
                    continue;
                }

                if (!Number.isNaN(value) && wasNaN) {
                    beginShape();
                    vertex(xi * xv, -xv * value);
                    wasNaN = false;
                }

                if (value === Number('Infinity')) {
                    vertex(xi * xv, -height); // predefined as the height of the canvas
                }
                if (value === Number('-Infinity')) {
                    vertex(xi * xv, height); // predefined as the height of the canvas
                }

                // console.log("xi=" + xi + " --- " + value); // debug
                vertex(xi * xv, -xv * (value <= height ? value : height));

            } catch (err) {
                console.log(err)
            }
        }
        endShape();
        resetMatrix();
    }
}

